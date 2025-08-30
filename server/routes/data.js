const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

// GET all data (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { type, category, tags, isPublic, limit = 50, page = 1 } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',') };
    if (isPublic !== undefined) filter.isPublic = isPublic === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const data = await Data.find(filter)
      .populate('createdBy', 'username firstName lastName')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Data.countDocuments(filter);

    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/data/platform-stats - Get comprehensive platform statistics
router.get('/platform-stats', async (req, res) => {
  try {
    const User = require('../models/User');
    const Petition = require('../models/Petition');
    const Vote = require('../models/Vote');
    const Vigor = require('../models/Vigor');

    // Get basic counts
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalPetitions = await Petition.countDocuments({ isActive: true });
    const totalVotes = await Vote.countDocuments();
    const totalVigor = await Vigor.countDocuments({ isActive: true });

    // Calculate total vigor amount
    const vigorAmounts = await Vigor.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalAmount: { $sum: '$vigorAmount' } } }
    ]);
    const totalVigorAmount = vigorAmounts.length > 0 ? vigorAmounts[0].totalAmount : 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentVotes = await Vote.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentPetitions = await Petition.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo },
      isActive: true 
    });
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo },
      isActive: true 
    });

    // Get category statistics
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

    // Get top petitions by votes
    const topPetitions = await Petition.find({ isActive: true })
      .sort({ voteCount: -1 })
      .limit(5)
      .populate('creator', 'username firstName lastName')
      .select('title voteCount category createdAt');

    // Get vigor statistics by type
    const vigorTypeStats = await Vigor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$vigorType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$vigorAmount' },
          avgAmount: { $avg: '$vigorAmount' }
        }
      }
    ]);

    // Calculate engagement metrics
    const avgVotesPerPetition = totalPetitions > 0 ? (totalVotes / totalPetitions).toFixed(1) : 0;
    const avgVigorPerVote = totalVotes > 0 ? (totalVigorAmount / totalVotes).toFixed(1) : 0;
    const userEngagementRate = totalUsers > 0 ? ((totalVotes / totalUsers) * 100).toFixed(1) : 0;

    res.json({
      overview: {
        totalUsers,
        totalPetitions,
        totalVotes,
        totalVigor,
        totalVigorAmount: Math.round(totalVigorAmount)
      },
      recentActivity: {
        votes: recentVotes,
        petitions: recentPetitions,
        users: recentUsers
      },
      engagement: {
        avgVotesPerPetition: parseFloat(avgVotesPerPetition),
        avgVigorPerVote: parseFloat(avgVigorPerVote),
        userEngagementRate: parseFloat(userEngagementRate)
      },
      categories: categoryStats,
      topPetitions,
      vigorTypes: vigorTypeStats
    });

  } catch (error) {
    console.error('Error fetching platform statistics:', error);
    res.status(500).json({ error: 'Failed to fetch platform statistics' });
  }
});

// GET single data by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await Data.findById(req.params.id)
      .populate('createdBy', 'username firstName lastName');
    
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new data
router.post('/', async (req, res) => {
  try {
    const { title, description, content, type, category, tags, isPublic, createdBy } = req.body;

    const newData = new Data({
      title,
      description,
      content,
      type,
      category,
      tags: tags || [],
      isPublic: isPublic || false,
      createdBy
    });

    const savedData = await newData.save();
    const populatedData = await Data.findById(savedData._id)
      .populate('createdBy', 'username firstName lastName');

    res.status(201).json(populatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update data
router.put('/:id', async (req, res) => {
  try {
    const { title, description, content, type, category, tags, isPublic } = req.body;

    const updatedData = await Data.findByIdAndUpdate(
      req.params.id,
      { title, description, content, type, category, tags, isPublic },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username firstName lastName');

    if (!updatedData) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE data
router.delete('/:id', async (req, res) => {
  try {
    const data = await Data.findByIdAndDelete(req.params.id);
    
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET data by category
router.get('/category/:category', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const data = await Data.find({ 
      category: req.params.category,
      isPublic: true 
    })
      .populate('createdBy', 'username firstName lastName')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET data by type
router.get('/type/:type', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const data = await Data.find({ 
      type: req.params.type,
      isPublic: true 
    })
      .populate('createdBy', 'username firstName lastName')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
