const Petition = require('../models/Petition');
const Vote = require('../models/Vote');

/**
 * Update vote count for a petition
 * @param {string} petitionId - The petition ID
 * @returns {Promise<number>} - The updated vote count
 */
const updatePetitionVoteCount = async (petitionId) => {
  try {
    const voteCount = await Vote.countDocuments({ petition: petitionId });
    await Petition.findByIdAndUpdate(petitionId, { voteCount });
    return voteCount;
  } catch (error) {
    console.error('Error updating petition vote count:', error);
    throw error;
  }
};

/**
 * Get petition statistics
 * @param {string} petitionId - The petition ID
 * @returns {Promise<Object>} - Petition statistics
 */
const getPetitionStats = async (petitionId) => {
  try {
    const petition = await Petition.findById(petitionId);
    if (!petition) {
      throw new Error('Petition not found');
    }

    const totalVotes = await Vote.countDocuments({ petition: petitionId });
    const recentVotes = await Vote.countDocuments({ 
      petition: petitionId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    const progressPercentage = Math.min((totalVotes / petition.targetVotes) * 100, 100);

    return {
      totalVotes,
      recentVotes,
      targetVotes: petition.targetVotes,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      isTargetReached: totalVotes >= petition.targetVotes
    };
  } catch (error) {
    console.error('Error getting petition stats:', error);
    throw error;
  }
};

/**
 * Get trending petitions
 * @param {number} limit - Number of petitions to return
 * @param {string} timeFrame - Time frame for trending (day, week, month)
 * @returns {Promise<Array>} - Trending petitions
 */
const getTrendingPetitions = async (limit = 10, timeFrame = 'week') => {
  try {
    const timeFrames = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    };

    const cutoffDate = new Date(Date.now() - timeFrames[timeFrame]);

    // Get petitions with most votes in the specified time frame
    const trendingPetitions = await Vote.aggregate([
      {
        $match: {
          createdAt: { $gte: cutoffDate }
        }
      },
      {
        $group: {
          _id: '$petition',
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
        $match: {
          'petition.isActive': true
        }
      },
      {
        $project: {
          _id: '$petition._id',
          title: '$petition.title',
          description: '$petition.description',
          category: '$petition.category',
          voteCount: '$voteCount',
          targetVotes: '$petition.targetVotes',
          createdAt: '$petition.createdAt'
        }
      }
    ]);

    return trendingPetitions;
  } catch (error) {
    console.error('Error getting trending petitions:', error);
    throw error;
  }
};

/**
 * Validate petition data
 * @param {Object} petitionData - The petition data to validate
 * @returns {Object} - Validation result
 */
const validatePetitionData = (petitionData) => {
  const errors = [];

  if (!petitionData.title || petitionData.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }

  if (!petitionData.description || petitionData.description.trim().length < 20) {
    errors.push('Description must be at least 20 characters long');
  }

  if (!petitionData.category) {
    errors.push('Category is required');
  }

  const validCategories = ['environment', 'education', 'healthcare', 'economy', 'civil-rights', 'foreign-policy', 'other'];
  if (petitionData.category && !validCategories.includes(petitionData.category)) {
    errors.push('Invalid category');
  }

  if (petitionData.targetVotes && (petitionData.targetVotes < 1 || !Number.isInteger(petitionData.targetVotes))) {
    errors.push('Target votes must be a positive integer');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  updatePetitionVoteCount,
  getPetitionStats,
  getTrendingPetitions,
  validatePetitionData
};
