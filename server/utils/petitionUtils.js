const Petition = require('../models/Petition');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

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
    // Get petitions with vote counts and vigor information
    const trendingPetitions = await Vote.aggregate([
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
        $lookup: {
          from: 'jurisdictions',
          localField: 'petition.jurisdiction',
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
          localField: 'petition.governingBody',
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
          localField: 'petition.legislation',
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
          foreignField: 'petition',
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
          _id: '$petition._id',
          title: '$petition.title',
          description: '$petition.description',
          category: '$petition.category',
          voteCount: '$voteCount',
          targetVotes: '$petition.targetVotes',
          createdAt: '$petition.createdAt',
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

  // Government entity validation
  if (!petitionData.jurisdiction) {
    errors.push('Jurisdiction is required');
  }

  // Validate that jurisdiction is a valid ObjectId
  if (petitionData.jurisdiction && !mongoose.Types.ObjectId.isValid(petitionData.jurisdiction)) {
    errors.push('Invalid jurisdiction ID');
  }

  // Validate governing body if provided
  if (petitionData.governingBody && !mongoose.Types.ObjectId.isValid(petitionData.governingBody)) {
    errors.push('Invalid governing body ID');
  }

  // Validate legislation if provided
  if (petitionData.legislation && !mongoose.Types.ObjectId.isValid(petitionData.legislation)) {
    errors.push('Invalid legislation ID');
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
