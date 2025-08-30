const express = require('express');
const router = express.Router();
const Vigor = require('../models/Vigor');
const Vote = require('../models/Vote');
const Petition = require('../models/Petition');
const { 
  calculateVigorAmount, 
  updatePetitionVigor, 
  shouldTriggerNotification,
  getPetitionVigorStats,
  validateVigorActivity 
} = require('../utils/vigorUtils');

// POST /api/vigor/contribute - Contribute vigor to a vote
router.post('/contribute', async (req, res) => {
  try {
    const { 
      userId, 
      voteId, 
      vigorType, 
      activityData, 
      signingStatement 
    } = req.body;

    // Validate required fields
    if (!userId || !voteId || !vigorType || !activityData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate vigor activity data
    const validation = validateVigorActivity(vigorType, activityData);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(', ') });
    }

    // Verify vote exists and belongs to user
    const vote = await Vote.findById(voteId).populate('petition');
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }
    if (vote.user.toString() !== userId) {
      return res.status(403).json({ error: 'Vote does not belong to user' });
    }

    // Calculate vigor amount
    const vigorAmount = calculateVigorAmount(vigorType, activityData);

    // Create vigor record
    const vigor = new Vigor({
      user: userId,
      vote: voteId,
      petition: vote.petition._id,
      vigorType,
      vigorAmount,
      activityData,
      signingStatement
    });

    await vigor.save();

    // Update vote with vigor totals
    vote.totalVigor += vigorAmount;
    vote.vigorCount += 1;
    if (signingStatement) {
      vote.signingStatement = signingStatement;
    }
    await vote.save();

    // Update petition vigor totals
    const petitionStats = await updatePetitionVigor(vote.petition._id);

    // Check if notification should be triggered
    const shouldNotify = await shouldTriggerNotification(vote.petition._id);

    res.status(201).json({
      vigor,
      vote: {
        totalVigor: vote.totalVigor,
        vigorCount: vote.vigorCount
      },
      petition: petitionStats,
      shouldNotify
    });

  } catch (error) {
    console.error('Error contributing vigor:', error);
    res.status(500).json({ error: 'Failed to contribute vigor' });
  }
});

// GET /api/vigor/petition/:id - Get vigor statistics for a petition
router.get('/petition/:id', async (req, res) => {
  try {
    const petitionId = req.params.id;
    
    // Verify petition exists
    const petition = await Petition.findById(petitionId);
    if (!petition) {
      return res.status(404).json({ error: 'Petition not found' });
    }

    console.log('Fetching vigor stats for petition:', petitionId);
    const vigorStats = await getPetitionVigorStats(petitionId);
    console.log('Vigor stats result:', vigorStats);
    
    res.json({
      petition: {
        totalVigor: petition.totalVigor,
        vigorThreshold: petition.vigorThreshold,
        notificationThreshold: petition.notificationThreshold,
        vigorReducedThreshold: petition.vigorReducedThreshold
      },
      vigorStats
    });

  } catch (error) {
    console.error('Error fetching vigor stats:', error);
    res.status(500).json({ error: 'Failed to fetch vigor statistics' });
  }
});

// GET /api/vigor/user/:userId - Get user's vigor contributions
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vigorContributions = await Vigor.find({ user: req.params.userId, isActive: true })
      .populate('petition', 'title category')
      .populate('vote')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vigor.countDocuments({ user: req.params.userId, isActive: true });

    // Calculate user's total vigor across all petitions
    const totalVigor = await Vigor.aggregate([
      { $match: { user: req.params.userId, isActive: true } },
      { $group: { _id: null, totalVigor: { $sum: '$vigorAmount' } } }
    ]);

    res.json({
      vigorContributions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      totalVigor: totalVigor.length > 0 ? totalVigor[0].totalVigor : 0
    });

  } catch (error) {
    console.error('Error fetching user vigor:', error);
    res.status(500).json({ error: 'Failed to fetch user vigor contributions' });
  }
});

// GET /api/vigor/vote/:voteId - Get vigor for a specific vote
router.get('/vote/:voteId', async (req, res) => {
  try {
    const vigorContributions = await Vigor.find({ 
      vote: req.params.voteId, 
      isActive: true 
    })
    .populate('user', 'username firstName lastName')
    .sort({ createdAt: -1 });

    const totalVigor = vigorContributions.reduce((sum, vigor) => sum + vigor.vigorAmount, 0);

    res.json({
      vigorContributions,
      totalVigor,
      vigorCount: vigorContributions.length
    });

  } catch (error) {
    console.error('Error fetching vote vigor:', error);
    res.status(500).json({ error: 'Failed to fetch vote vigor' });
  }
});

// DELETE /api/vigor/:id - Remove vigor contribution (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body;

    const vigor = await Vigor.findById(req.params.id);
    if (!vigor) {
      return res.status(404).json({ error: 'Vigor contribution not found' });
    }

    // Verify user owns this vigor contribution
    if (vigor.user.toString() !== userId) {
      return res.status(403).json({ error: 'Vigor contribution does not belong to user' });
    }

    // Soft delete
    vigor.isActive = false;
    await vigor.save();

    // Update vote vigor totals
    const vote = await Vote.findById(vigor.vote);
    if (vote) {
      vote.totalVigor = Math.max(0, vote.totalVigor - vigor.vigorAmount);
      vote.vigorCount = Math.max(0, vote.vigorCount - 1);
      await vote.save();
    }

    // Update petition vigor totals
    await updatePetitionVigor(vigor.petition);

    res.json({ message: 'Vigor contribution removed successfully' });

  } catch (error) {
    console.error('Error removing vigor contribution:', error);
    res.status(500).json({ error: 'Failed to remove vigor contribution' });
  }
});

// GET /api/vigor/leaderboard - Get top vigor contributors
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, timeFrame = 'all' } = req.query;
    
    let dateFilter = {};
    if (timeFrame === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (timeFrame === 'month') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const leaderboard = await Vigor.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      { 
        $group: { 
          _id: '$user',
          totalVigor: { $sum: '$vigorAmount' },
          vigorCount: { $sum: 1 },
          vigorContributions: { $push: { vigorAmount: '$vigorAmount', petition: '$petition' } }
        }
      },
      { $sort: { totalVigor: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $addFields: {
          topPetition: {
            $let: {
              vars: {
                maxVigor: { $max: '$vigorContributions.vigorAmount' }
              },
              in: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$vigorContributions',
                      cond: { $eq: ['$$this.vigorAmount', '$$maxVigor'] }
                    }
                  },
                  0
                ]
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'petitions',
          localField: 'topPetition.petition',
          foreignField: '_id',
          as: 'topPetitionDetails'
        }
      },
      { $unwind: '$topPetitionDetails' },
      {
        $project: {
          _id: 1,
          totalVigor: 1,
          vigorCount: 1,
          'user.username': 1,
          'user.firstName': 1,
          'user.lastName': 1,
          topPetition: {
            vigorAmount: '$topPetition.vigorAmount',
            petitionTitle: '$topPetitionDetails.title',
            petitionId: '$topPetitionDetails._id'
          }
        }
      }
    ]);

    res.json(leaderboard);

  } catch (error) {
    console.error('Error fetching vigor leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch vigor leaderboard' });
  }
});

module.exports = router;
