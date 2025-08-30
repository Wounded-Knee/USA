const mongoose = require('mongoose');

const vigorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vote',
    required: true
  },
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: true
  },
  vigorType: {
    type: String,
    enum: ['shake', 'voice', 'statement'],
    required: true
  },
  vigorAmount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  activityData: {
    // For shake activity
    shakeIntensity: Number,
    shakeDuration: Number,
    shakeCount: Number,
    
    // For voice activity
    voiceConfidence: Number,
    voiceDuration: Number,
    voiceClarity: Number,
    audioRecording: String, // URL to stored audio file
    
    // For statement activity
    statementText: String,
    statementLength: Number,
    statementEmotion: String,
    
    // Common metrics
    completionTime: Number,
    focusScore: Number,
    emotionalIntensity: Number
  },
  signingStatement: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
vigorSchema.index({ user: 1, petition: 1 });
vigorSchema.index({ petition: 1, vigorAmount: -1 });
vigorSchema.index({ createdAt: -1 });
vigorSchema.index({ vigorType: 1, isActive: 1 });

// Virtual for total vigor on a petition
vigorSchema.virtual('totalVigor').get(function() {
  return this.vigorAmount;
});

module.exports = mongoose.model('Vigor', vigorSchema);
