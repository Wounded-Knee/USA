const express = require('express');
const router = express.Router();
const { Obligation } = require('../../models/Obligations');
const Vote = require('../../models/Vote');
const User = require('../../models/User');
const Vigor = require('../../models/Vigor');
const Capital = require('../../models/Capital');
const { verifyToken, requireScope } = require('../../middleware/authorization');
const { generalLimiter, securityHeaders } = require('../../middleware/security');
const { success, error } = require('../../utils/response');

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
      const totalVotes = await Vote.countDocuments();
      const totalVigor = await Vigor.countDocuments();
      const totalVigorAmount = await Vigor.aggregate([
        {
          $group: {
            _id: null,
            totalVigorAmount: { $sum: '$vigorAmount' }
          }
        }
      ]);
      
      const vigorAmount = totalVigorAmount[0]?.totalVigorAmount || 0;
      
      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = await User.countDocuments({
        isActive: true,
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      const recentInitiatives = await Obligation.countDocuments({
        isActive: true,
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      const recentVotes = await Vote.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      return success(res, {
        totals: {
          users: totalUsers,
          votes: totalVotes,
          vigor: totalVigor,
          vigorAmount: vigorAmount,
        },
        recentActivity: {
          users: recentUsers,
          initiatives: recentInitiatives,
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
      const categoryStats = await Obligation.aggregate([
        {
          $group: {
            _id: '$categoryId',
            totalInitiatives: { $sum: 1 },
            totalVotes: { $sum: '$voteCount' },
            avgVotes: { $avg: '$voteCount' }
          }
        },
        {
          $sort: { totalVotes: -1 }
        }
      ]);
      
      // Get top initiatives by votes
      const topInitiatives = await Obligation.find({ isActive: true })
        .sort({ voteCount: -1 })
        .limit(10)
        .populate('creator', 'username firstName lastName')
        .select('title voteCount category creator');
      
      // Get recent votes
      const recentVotes = await Vote.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('user', 'username firstName lastName')
        .populate('obligation', 'title')
        .select('user obligation createdAt');
      
      return success(res, {
        categoryStats,
        topInitiatives,
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

