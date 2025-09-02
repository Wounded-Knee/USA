const { Obligation } = require('../models/Obligations');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

/**
 * Update vote count for an obligation
 * @param {string} obligationId - The obligation ID
 * @returns {Promise<number>} - The updated vote count
 */
const updateObligationVoteCount = async (obligationId) => {
  try {
    const voteCount = await Vote.countDocuments({ obligation: obligationId });
    await Obligation.findByIdAndUpdate(obligationId, { voteCount });
    return voteCount;
  } catch (error) {
    console.error('Error updating obligation vote count:', error);
    throw error;
  }
};

/**
 * Get obligation statistics
 * @param {string} obligationId - The obligation ID
 * @returns {Promise<Object>} - Obligation statistics
 */
const getObligationStats = async (obligationId) => {
  try {
    const obligation = await Obligation.findById(obligationId);
    if (!obligation) {
      throw new Error('Obligation not found');
    }

    const totalVotes = await Vote.countDocuments({ obligation: obligationId });
    const recentVotes = await Vote.countDocuments({ 
      obligation: obligationId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    const progressPercentage = Math.min((totalVotes / obligation.targetVotes) * 100, 100);

    return {
      totalVotes,
      recentVotes,
      targetVotes: obligation.targetVotes,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      isTargetReached: totalVotes >= obligation.targetVotes
    };
  } catch (error) {
    console.error('Error getting obligation stats:', error);
    throw error;
  }
};

/**
 * Get trending obligations
 * @param {number} limit - Number of obligations to return
 * @param {string} timeFrame - Time frame for trending (day, week, month)
 * @param {string} type - Optional obligation type filter
 * @returns {Promise<Array>} - Trending obligations
 */
const getTrendingObligations = async (limit = 10, timeFrame = 'week', type = null) => {
  try {
    // Build match filter
    const matchFilter = { isActive: true };
    if (type) {
      matchFilter.obligationType = type;
    }

    // Get obligations with vote counts and vigor information
    const trendingObligations = await Vote.aggregate([
      {
        $group: {
          _id: '$obligation',
          voteCount: { $sum: 1 }
        }
      },
      {
        $sort: { voteCount: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'obligations',
          localField: '_id',
          foreignField: '_id',
          as: 'obligation'
        }
      },
      {
        $unwind: '$obligation'
      },
      {
        $match: matchFilter
      },
      {
        $lookup: {
          from: 'users',
          localField: 'obligation.creator',
          foreignField: '_id',
          as: 'creator'
        }
      },
      {
        $unwind: '$creator'
      },
      {
        $lookup: {
          from: 'jurisdictions',
          localField: 'obligation.jurisdiction',
          foreignField: '_id',
          as: 'jurisdiction'
        }
      },
      {
        $unwind: '$jurisdiction'
      },
      {
        $lookup: {
          from: 'governingbodies',
          localField: 'obligation.governingBody',
          foreignField: '_id',
          as: 'governingBody'
        }
      },
      {
        $unwind: {
          path: '$governingBody',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'legislations',
          localField: 'obligation.legislation',
          foreignField: '_id',
          as: 'legislation'
        }
      },
      {
        $unwind: {
          path: '$legislation',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'vigors',
          localField: '_id',
          foreignField: 'obligation',
          as: 'vigorData'
        }
      },
      {
        $addFields: {
          totalVigor: { $sum: '$vigorData.vigorAmount' },
          vigorCount: { $size: '$vigorData' },
          averageVigor: {
            $cond: [
              { $gt: [{ $size: '$vigorData' }, 0] },
              { $divide: [{ $sum: '$vigorData.vigorAmount' }, { $size: '$vigorData' }] },
              0
            ]
          }
        }
      },
      {
        $project: {
          _id: '$obligation._id',
          title: '$obligation.title',
          description: '$obligation.description',
          category: '$obligation.category',
          voteCount: '$voteCount',
          targetVotes: '$obligation.targetVotes',
          createdAt: '$obligation.createdAt',
          totalVigor: 1,
          vigorCount: 1,
          averageVigor: 1,
          creator: {
            firstName: '$creator.firstName',
            lastName: '$creator.lastName',
            username: '$creator.username'
          },
          jurisdiction: {
            _id: '$jurisdiction._id',
            name: '$jurisdiction.name',
            slug: '$jurisdiction.slug',
            level: '$jurisdiction.level',
            path: '$jurisdiction.path'
          },
          governingBody: {
            _id: '$governingBody._id',
            name: '$governingBody.name',
            slug: '$governingBody.slug',
            branch: '$governingBody.branch',
            entity_type: '$governingBody.entity_type'
          },
          legislation: {
            _id: '$legislation._id',
            title: '$legislation.title',
            bill_number: '$legislation.bill_number',
            status: '$legislation.status'
          }
        }
      }
    ]);

    return trendingObligations;
  } catch (error) {
    console.error('Error getting trending obligations:', error);
    throw error;
  }
};

/**
 * Validate obligation data
 * @param {Object} obligationData - The obligation data to validate
 * @returns {Object} - Validation result
 */
const validateObligationData = (obligationData) => {
  const errors = [];

  if (!obligationData.title || obligationData.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }

  if (!obligationData.description || obligationData.description.trim().length < 20) {
    errors.push('Description must be at least 20 characters long');
  }

  if (!obligationData.category) {
    errors.push('Category is required');
  }

  const validCategories = ['environment', 'education', 'healthcare', 'economy', 'civil-rights', 'foreign-policy', 'other'];
  if (obligationData.category && !validCategories.includes(obligationData.category)) {
    errors.push('Invalid category');
  }

  if (obligationData.targetVotes && (obligationData.targetVotes < 1 || !Number.isInteger(obligationData.targetVotes))) {
    errors.push('Target votes must be a positive integer');
  }

  // Government entity validation
  if (!obligationData.jurisdiction) {
    errors.push('Jurisdiction is required');
  }

  // Validate that jurisdiction is a valid ObjectId
  if (obligationData.jurisdiction && !mongoose.Types.ObjectId.isValid(obligationData.jurisdiction)) {
    errors.push('Invalid jurisdiction ID');
  }

  // Validate governing body if provided
  if (obligationData.governingBody && !mongoose.Types.ObjectId.isValid(obligationData.governingBody)) {
    errors.push('Invalid governing body ID');
  }

  // Validate legislation if provided
  if (obligationData.legislation && !mongoose.Types.ObjectId.isValid(obligationData.legislation)) {
    errors.push('Invalid legislation ID');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  updateObligationVoteCount,
  getObligationStats,
  getTrendingObligations,
  validateObligationData
};

