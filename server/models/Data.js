const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['user', 'system', 'analytics', 'other']
  },
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
dataSchema.index({ type: 1, category: 1 });
dataSchema.index({ tags: 1 });
dataSchema.index({ createdBy: 1 });
dataSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Data', dataSchema);
