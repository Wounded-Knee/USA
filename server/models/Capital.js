const mongoose = require('mongoose');

const capitalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: true
  },
  vote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vote',
    required: true
  },
  capitalAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  capitalType: {
    type: String,
    enum: ['earned', 'spent', 'bonus'],
    default: 'earned'
  },
  source: {
    type: String,
    enum: ['vigor_activity', 'petition_success', 'community_contribution', 'bonus'],
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
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

// Compound unique index to prevent duplicate capital entries
capitalSchema.index({ user: 1, petition: 1, source: 1 }, { unique: true });

// Index for querying capital by user
capitalSchema.index({ user: 1, createdAt: -1 });

// Index for querying capital by petition
capitalSchema.index({ petition: 1, capitalAmount: -1 });

// Virtual for total capital on a petition
capitalSchema.virtual('totalCapital').get(function() {
  return this.capitalAmount;
});

module.exports = mongoose.model('Capital', capitalSchema);
