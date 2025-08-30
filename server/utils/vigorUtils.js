const Vigor = require('../models/Vigor');
const Vote = require('../models/Vote');
const Petition = require('../models/Petition');
const mongoose = require('mongoose');

// Calculate vigor amount based on activity type and metrics
const calculateVigorAmount = (activityType, activityData) => {
  let vigorAmount = 0;
  
  switch (activityType) {
    case 'shake':
      // Shake vigor based on intensity, duration, and count
      const intensityScore = Math.min(activityData.shakeIntensity || 0, 100) / 100;
      const durationScore = Math.min(activityData.shakeDuration || 0, 30) / 30; // 30 seconds max
      const countScore = Math.min(activityData.shakeCount || 0, 50) / 50; // 50 shakes max
      
      vigorAmount = Math.round((intensityScore * 0.4 + durationScore * 0.3 + countScore * 0.3) * 100);
      break;
      
    case 'voice':
      // Voice vigor based on confidence, duration, and clarity
      const confidenceScore = Math.min(activityData.voiceConfidence || 0, 100) / 100;
      const voiceDurationScore = Math.min(activityData.voiceDuration || 0, 60) / 60; // 60 seconds max
      const clarityScore = Math.min(activityData.voiceClarity || 0, 100) / 100;
      
      vigorAmount = Math.round((confidenceScore * 0.5 + voiceDurationScore * 0.3 + clarityScore * 0.2) * 100);
      break;
      
    case 'statement':
      // Statement vigor based on length, emotion, and focus
      const lengthScore = Math.min(activityData.statementLength || 0, 500) / 500; // 500 chars max
      const emotionScore = getEmotionScore(activityData.statementEmotion || 'neutral');
      const focusScore = Math.min(activityData.focusScore || 0, 100) / 100;
      
      vigorAmount = Math.round((lengthScore * 0.3 + emotionScore * 0.4 + focusScore * 0.3) * 100);
      break;
  }
  
  return Math.max(0, Math.min(100, vigorAmount));
};

// Get emotion score based on emotional intensity
const getEmotionScore = (emotion) => {
  const emotionScores = {
    'passionate': 1.0,
    'angry': 0.9,
    'determined': 0.8,
    'concerned': 0.7,
    'hopeful': 0.6,
    'neutral': 0.5,
    'calm': 0.4,
    'uncertain': 0.3
  };
  
  return emotionScores[emotion] || 0.5;
};

// Update petition vigor totals and thresholds
const updatePetitionVigor = async (petitionId) => {
  try {
    const petition = await Petition.findById(petitionId);
    if (!petition) return;
    
    // Calculate total vigor for this petition
    const vigorStats = await Vigor.aggregate([
      { $match: { petition: petition._id, isActive: true } },
      { $group: { _id: null, totalVigor: { $sum: '$vigorAmount' }, vigorCount: { $sum: 1 } } }
    ]);
    
    const totalVigor = vigorStats.length > 0 ? vigorStats[0].totalVigor : 0;
    const vigorCount = vigorStats.length > 0 ? vigorStats[0].vigorCount : 0;
    
    // Update petition with new vigor totals
    petition.totalVigor = totalVigor;
    
    // Adjust notification threshold based on vigor
    const vigorMultiplier = Math.max(0.5, 1 - (totalVigor / 10000)); // Reduce threshold by up to 50%
    petition.vigorReducedThreshold = Math.round(petition.notificationThreshold * vigorMultiplier);
    
    await petition.save();
    
    return { totalVigor, vigorCount, vigorReducedThreshold: petition.vigorReducedThreshold };
  } catch (error) {
    console.error('Error updating petition vigor:', error);
    throw error;
  }
};

// Check if petition should trigger notification based on vigor
const shouldTriggerNotification = async (petitionId) => {
  try {
    const petition = await Petition.findById(petitionId);
    if (!petition) return false;
    
    // Check if vote count + vigor has reached the reduced threshold
    const effectiveVotes = petition.voteCount + Math.floor(petition.totalVigor / 100);
    return effectiveVotes >= petition.vigorReducedThreshold;
  } catch (error) {
    console.error('Error checking notification trigger:', error);
    return false;
  }
};

// Get vigor statistics for a petition
const getPetitionVigorStats = async (petitionId) => {
  try {
    console.log('Getting vigor stats for petitionId:', petitionId);
    
    // Convert string ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(petitionId);
    
    // First, let's check if there are any vigor records for this petition
    const vigorCount = await Vigor.countDocuments({ petition: objectId, isActive: true });
    console.log('Total vigor records found:', vigorCount);
    
    const vigorStats = await Vigor.aggregate([
      { $match: { petition: objectId, isActive: true } },
      { 
        $group: { 
          _id: '$vigorType',
          count: { $sum: 1 },
          totalVigor: { $sum: '$vigorAmount' },
          avgVigor: { $avg: '$vigorAmount' }
        }
      }
    ]);
    
    const totalStats = await Vigor.aggregate([
      { $match: { petition: objectId, isActive: true } },
      { 
        $group: { 
          _id: null,
          totalVigor: { $sum: '$vigorAmount' },
          vigorCount: { $sum: 1 },
          avgVigor: { $avg: '$vigorAmount' }
        }
      }
    ]);
    
    console.log('Vigor stats by type:', vigorStats);
    console.log('Total stats:', totalStats);
    
    return {
      byType: vigorStats,
      total: totalStats.length > 0 ? totalStats[0] : { totalVigor: 0, vigorCount: 0, avgVigor: 0 }
    };
  } catch (error) {
    console.error('Error getting petition vigor stats:', error);
    throw error;
  }
};

// Validate vigor activity data
const validateVigorActivity = (vigorType, activityData) => {
  const errors = [];
  
  switch (vigorType) {
    case 'shake':
      if (!activityData.shakeIntensity || activityData.shakeIntensity < 0) {
        errors.push('Invalid shake intensity');
      }
      if (!activityData.shakeDuration || activityData.shakeDuration < 1) {
        errors.push('Invalid shake duration');
      }
      break;
      
    case 'voice':
      if (!activityData.voiceConfidence || activityData.voiceConfidence < 0) {
        errors.push('Invalid voice confidence');
      }
      if (!activityData.voiceDuration || activityData.voiceDuration < 1) {
        errors.push('Invalid voice duration');
      }
      break;
      
    case 'statement':
      if (!activityData.statementText || activityData.statementText.length < 10) {
        errors.push('Statement must be at least 10 characters');
      }
      if (!activityData.statementEmotion) {
        errors.push('Statement emotion is required');
      }
      break;
      
    default:
      errors.push('Invalid vigor type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  calculateVigorAmount,
  getEmotionScore,
  updatePetitionVigor,
  shouldTriggerNotification,
  getPetitionVigorStats,
  validateVigorActivity
};
