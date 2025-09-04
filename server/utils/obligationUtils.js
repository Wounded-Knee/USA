const { Obligation } = require('../models/Obligations');
const mongoose = require('mongoose');



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

    return {
      status: obligation.status,
      createdAt: obligation.createdAt,
      updatedAt: obligation.updatedAt,
      categoryId: obligation.categoryId,
      boundPartyType: obligation.boundPartyType,
      bindingPartyType: obligation.bindingPartyType,
      dueDate: obligation.dueDate
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

    // Get recent obligations by creation date
    const trendingObligations = await Obligation.find(matchFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('creator', 'username firstName lastName');

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



  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  getObligationStats,
  getTrendingObligations,
  validateObligationData
};

