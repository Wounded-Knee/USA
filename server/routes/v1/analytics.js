const express = require('express');
const User = require('../../models/User');
const Petition = require('../../models/Petition');
const Vote = require('../../models/Vote');
const Vigor = require('../../models/Vigor');
const PetitionMetrics = require('../../models/PetitionMetrics');
const { verifyToken, requireScope } = require('../../middleware/authorization');
const { generalLimiter, securityHeaders } = require('../../middleware/security');
const { success, error } = require('../../utils/response');

const router = express.Router();

// Apply security headers to all analytics routes
router.use(securityHeaders);

// GET /v1/analytics/platform
router.get('/platform',
  verifyToken,
  requireScope('analytics:read'),
  generalLimiter,
  async (req, res) => {
    try {
      // Get total counts
      const totalUsers = await User.countDocuments({ isActive: true });
      const totalPetitions = await Petition.countDocuments({ status: 'active' });
      
      // Get totals from PetitionMetrics
      const metricsTotals = await PetitionMetrics.aggregate([
        {
          $group: {
            _id: null,
            totalVotes: { $sum: '$voteCount' },
            totalVigor: { $sum: '$vigorCount' },
            totalVigorAmount: { $sum: '$totalVigor' }
          }
        }
      ]);
      
      const totalVotes = metricsTotals[0]?.totalVotes || 0;
      const totalVigor = metricsTotals[0]?.totalVigor || 0;
      const totalVigorAmount = metricsTotals[0]?.totalVigorAmount || 0;
      
      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = await User.countDocuments({
        isActive: true,
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      const recentPetitions = await Petition.countDocuments({
        isActive: true,
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      const recentVotes = await Vote.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      return success(res, {
        totals: {
          users: totalUsers,
          petitions: totalPetitions,
          votes: totalVotes,
          vigor: totalVigor,
          vigorAmount: totalVigorAmount,
        },
        recentActivity: {
          users: recentUsers,
          petitions: recentPetitions,
          votes: recentVotes,
        },
        period: '30 days',
      });
      
    } catch (err) {
      console.error('Get platform analytics error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get platform analytics',
        status: 500,
        detail: 'Failed to retrieve platform statistics',
      });
    }
  }
);

// GET /v1/analytics/votes
router.get('/votes',
  verifyToken,
  requireScope('analytics:read'),
  generalLimiter,
  async (req, res) => {
    try {
      // Get category statistics
      const categoryStats = await Petition.aggregate([
        {
          $lookup: {
            from: 'petitionmetrics',
            localField: '_id',
            foreignField: 'petitionId',
            as: 'metrics'
          }
        },
        {
          $group: {
            _id: '$categoryId',
            totalPetitions: { $sum: 1 },
            totalVotes: { $sum: { $ifNull: [{ $arrayElemAt: ['$metrics.voteCount', 0] }, 0] } },
            avgVotes: { $avg: { $ifNull: [{ $arrayElemAt: ['$metrics.voteCount', 0] }, 0] } }
          }
        },
        {
          $sort: { totalVotes: -1 }
        }
      ]);
      
      // Get top petitions by votes
      const topPetitions = await Petition.find({ isActive: true })
        .sort({ voteCount: -1 })
        .limit(10)
        .populate('creator', 'username firstName lastName')
        .select('title voteCount category creator');
      
      // Get recent votes
      const recentVotes = await Vote.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('user', 'username firstName lastName')
        .populate('petition', 'title')
        .select('user petition createdAt');
      
      return success(res, {
        categoryStats,
        topPetitions,
        recentVotes,
      });
      
    } catch (err) {
      console.error('Get vote analytics error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get vote analytics',
        status: 500,
        detail: 'Failed to retrieve vote statistics',
      });
    }
  }
);

// GET /v1/analytics/petitions/trending
router.get('/petitions/trending',
  verifyToken,
  requireScope('analytics:read'),
  generalLimiter,
  async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      
      // Calculate trending score based on recent activity
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Get petitions with recent votes
      const trendingPetitions = await Vote.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: '$petition',
            recentVotes: { $sum: 1 }
          }
        },
        {
          $sort: { recentVotes: -1 }
        },
        {
          $limit: parseInt(limit)
        },
        {
          $lookup: {
            from: 'petitions',
            localField: '_id',
            foreignField: '_id',
            as: 'petition'
          }
        },
        {
          $unwind: '$petition'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'petition.creator',
            foreignField: '_id',
            as: 'creator'
          }
        },
        {
          $unwind: '$creator'
        },
        {
          $project: {
            _id: '$petition._id',
            title: '$petition.title',
            category: '$petition.category',
            voteCount: '$petition.voteCount',
            recentVotes: '$recentVotes',
            creator: {
              _id: '$creator._id',
              username: '$creator.username',
              firstName: '$creator.firstName',
              lastName: '$creator.lastName'
            }
          }
        }
      ]);
      
      return success(res, trendingPetitions);
      
    } catch (err) {
      console.error('Get trending petitions error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get trending petitions',
        status: 500,
        detail: 'Failed to retrieve trending petitions',
      });
    }
  }
);

// GET /v1/analytics/vigor
router.get('/vigor',
  verifyToken,
  requireScope('analytics:read'),
  generalLimiter,
  async (req, res) => {
    try {
      // Get vigor type statistics
      const vigorTypeStats = await Vigor.aggregate([
        {
          $group: {
            _id: '$vigorType',
            count: { $sum: 1 },
            totalAmount: { $sum: '$vigorAmount' },
            avgAmount: { $avg: '$vigorAmount' }
          }
        },
        {
          $sort: { totalAmount: -1 }
        }
      ]);
      
      // Get top vigor contributors
      const topContributors = await Vigor.aggregate([
        {
          $group: {
            _id: '$user',
            totalVigor: { $sum: '$vigorAmount' },
            contributions: { $sum: 1 }
          }
        },
        {
          $sort: { totalVigor: -1 }
        },
        {
          $limit: 10
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            _id: '$user._id',
            username: '$user.username',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            totalVigor: '$totalVigor',
            contributions: '$contributions'
          }
        }
      ]);
      
      // Get recent vigor contributions
      const recentVigor = await Vigor.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('user', 'username firstName lastName')
        .populate('petition', 'title')
        .select('user petition vigorType vigorAmount createdAt');
      
      return success(res, {
        vigorTypeStats,
        topContributors,
        recentVigor,
      });
      
    } catch (err) {
      console.error('Get vigor analytics error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get vigor analytics',
        status: 500,
        detail: 'Failed to retrieve vigor statistics',
      });
    }
  }
);

module.exports = router;

