const mongoose = require('mongoose');
const { Schema } = mongoose;

const Position = new Schema({
  office: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Office', 
    required: true, 
    index: true 
  },
  title: { 
    type: String, 
    trim: true 
  }, // optional title override
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  }
}, { 
  timestamps: true 
});

// Indexes for common queries
Position.index({ office: 1, isActive: 1 });
Position.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Position', Position);
