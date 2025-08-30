const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate votes from the same user on the same petition
voteSchema.index({ user: 1, petition: 1 }, { unique: true });

// Index for querying votes by petition
voteSchema.index({ petition: 1, createdAt: -1 });

// Index for querying votes by user
voteSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Vote', voteSchema);
