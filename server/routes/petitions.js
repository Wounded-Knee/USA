const express = require('express');
const router = express.Router();
const Petition = require('../models/Petition');
const Vote = require('../models/Vote');
const User = require('../models/User');
const { getTrendingPetitions, getPetitionStats, validatePetitionData } = require('../utils/petitionUtils');

// GET /api/petitions - Get all petitions with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      isActive, 
      creator, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (creator) filter.creator = creator;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const petitions = await Petition.find(filter)
      .populate('creator', 'username firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Petition.countDocuments(filter);

    res.json({
      petitions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching petitions:', error);
    res.status(500).json({ error: 'Failed to fetch petitions' });
  }
});

// GET /api/petitions/:id - Get a specific petition
router.get('/:id', async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate('creator', 'username firstName lastName');

    if (!petition) {
      return res.status(404).json({ error: 'Petition not found' });
    }

    res.json(petition);
  } catch (error) {
    console.error('Error fetching petition:', error);
    res.status(500).json({ error: 'Failed to fetch petition' });
  }
});

// POST /api/petitions - Create a new petition
router.post('/', async (req, res) => {
  try {
    const { title, description, category, targetVotes, creatorId } = req.body;

    // Validate petition data
    const validation = validatePetitionData({ title, description, category, targetVotes });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(', ') });
    }

    // Verify user exists
    const user = await User.findById(creatorId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const petition = new Petition({
      title,
      description,
      category,
      targetVotes: targetVotes || 1000,
      creator: creatorId
    });

    await petition.save();

    // Populate creator info before sending response
    await petition.populate('creator', 'username firstName lastName');

    res.status(201).json(petition);
  } catch (error) {
    console.error('Error creating petition:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create petition' });
  }
});

// PUT /api/petitions/:id - Update a petition
router.put('/:id', async (req, res) => {
  try {
    const { title, description, category, targetVotes, isActive } = req.body;

    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ error: 'Petition not found' });
    }

    // Update fields if provided
    if (title !== undefined) petition.title = title;
    if (description !== undefined) petition.description = description;
    if (category !== undefined) petition.category = category;
    if (targetVotes !== undefined) petition.targetVotes = targetVotes;
    if (isActive !== undefined) petition.isActive = isActive;

    await petition.save();
    await petition.populate('creator', 'username firstName lastName');

    res.json(petition);
  } catch (error) {
    console.error('Error updating petition:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update petition' });
  }
});

// DELETE /api/petitions/:id - Delete a petition (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ error: 'Petition not found' });
    }

    // Soft delete by setting isActive to false
    petition.isActive = false;
    await petition.save();

    res.json({ message: 'Petition deleted successfully' });
  } catch (error) {
    console.error('Error deleting petition:', error);
    res.status(500).json({ error: 'Failed to delete petition' });
  }
});

// GET /api/petitions/:id/votes - Get votes for a specific petition
router.get('/:id/votes', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const votes = await Vote.find({ petition: req.params.id })
      .populate('user', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vote.countDocuments({ petition: req.params.id });

    res.json({
      votes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// POST /api/petitions/:id/vote - Cast a vote for a petition
router.post('/:id/vote', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify petition exists and is active
    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ error: 'Petition not found' });
    }
    if (!petition.isActive) {
      return res.status(400).json({ error: 'Cannot vote on inactive petition' });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ user: userId, petition: req.params.id });
    if (existingVote) {
      return res.status(400).json({ error: 'User has already voted on this petition' });
    }

    // Create vote
    const vote = new Vote({
      user: userId,
      petition: req.params.id
    });

    await vote.save();

    // Update petition vote count
    petition.voteCount += 1;
    await petition.save();

    res.status(201).json({ 
      message: 'Vote cast successfully',
      voteCount: petition.voteCount
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User has already voted on this petition' });
    }
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// DELETE /api/petitions/:id/vote - Remove a vote (if needed)
router.delete('/:id/vote', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const vote = await Vote.findOneAndDelete({ user: userId, petition: req.params.id });
    
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    // Update petition vote count
    const petition = await Petition.findById(req.params.id);
    if (petition) {
      petition.voteCount = Math.max(0, petition.voteCount - 1);
      await petition.save();
    }

    res.json({ 
      message: 'Vote removed successfully',
      voteCount: petition ? petition.voteCount : 0
    });
  } catch (error) {
    console.error('Error removing vote:', error);
    res.status(500).json({ error: 'Failed to remove vote' });
  }
});

// GET /api/petitions/trending - Get trending petitions
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10, timeFrame = 'week' } = req.query;
    
    const trendingPetitions = await getTrendingPetitions(parseInt(limit), timeFrame);
    
    res.json(trendingPetitions);
  } catch (error) {
    console.error('Error fetching trending petitions:', error);
    res.status(500).json({ error: 'Failed to fetch trending petitions' });
  }
});

// GET /api/petitions/:id/stats - Get detailed statistics for a petition
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await getPetitionStats(req.params.id);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching petition stats:', error);
    if (error.message === 'Petition not found') {
      return res.status(404).json({ error: 'Petition not found' });
    }
    res.status(500).json({ error: 'Failed to fetch petition stats' });
  }
});

module.exports = router;
