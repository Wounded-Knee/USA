const mongoose = require('mongoose');
const { Schema } = mongoose;

const Vote = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  petition: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Petition', 
    required: true, 
    index: true 
  },
  signingStatement: { 
    type: String, 
    maxlength: 1000 
  },
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  }
}, { 
  timestamps: true 
});

// Unique compound index: one vote per user per petition
Vote.index({ user: 1, petition: 1 }, { unique: true });

// Additional indexes for common queries
Vote.index({ petition: 1, createdAt: -1 });
Vote.index({ user: 1, createdAt: -1 });
Vote.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Vote', Vote);
