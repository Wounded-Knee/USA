const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Petition = require('../models/Petition');
const User = require('../models/User');

// GET /api/votes/user/:userId - Get all votes by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Verify user exists
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const votes = await Vote.find({ user: req.params.userId })
      .populate('petition', 'title description category voteCount isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vote.countDocuments({ user: req.params.userId });

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
    console.error('Error fetching user votes:', error);
    res.status(500).json({ error: 'Failed to fetch user votes' });
  }
});

// GET /api/votes/stats - Get voting statistics
router.get('/stats', async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();
    const totalPetitions = await Petition.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });

    // Get most voted petitions
    const topPetitions = await Petition.find({ isActive: true })
      .sort({ voteCount: -1 })
      .limit(5)
      .populate('creator', 'username firstName lastName');

    // Get recent votes
    const recentVotes = await Vote.find()
      .populate('user', 'username firstName lastName')
      .populate('petition', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalVotes,
      totalPetitions,
      totalUsers,
      topPetitions,
      recentVotes
    });
  } catch (error) {
    console.error('Error fetching vote statistics:', error);
    res.status(500).json({ error: 'Failed to fetch vote statistics' });
  }
});

// GET /api/votes/check/:petitionId/:userId - Check if user has voted on a petition
router.get('/check/:petitionId/:userId', async (req, res) => {
  try {
    const vote = await Vote.findOne({ 
      petition: req.params.petitionId, 
      user: req.params.userId 
    });

    res.json({ hasVoted: !!vote });
  } catch (error) {
    console.error('Error checking vote status:', error);
    res.status(500).json({ error: 'Failed to check vote status' });
  }
});

// GET /api/votes/user/:userId/vote/:petitionId - Get specific vote by user and petition
router.get('/user/:userId/vote/:petitionId', async (req, res) => {
  try {
    const vote = await Vote.findOne({ 
      petition: req.params.petitionId, 
      user: req.params.userId 
    });

    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    res.json({ vote });
  } catch (error) {
    console.error('Error fetching vote:', error);
    res.status(500).json({ error: 'Failed to fetch vote' });
  }
});

// GET /api/votes/category-stats - Get voting statistics by category
router.get('/category-stats', async (req, res) => {
  try {
    const categoryStats = await Petition.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          totalPetitions: { $sum: 1 },
          totalVotes: { $sum: '$voteCount' },
          avgVotes: { $avg: '$voteCount' }
        }
      },
      { $sort: { totalVotes: -1 } }
    ]);

    res.json(categoryStats);
  } catch (error) {
    console.error('Error fetching category statistics:', error);
    res.status(500).json({ error: 'Failed to fetch category statistics' });
  }
});

module.exports = router;
