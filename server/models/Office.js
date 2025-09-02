const mongoose = require('mongoose');
const { Schema } = mongoose;

const Office = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true 
  },
  governingBody: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'GoverningBody', 
    required: true, 
    index: true 
  },
  description: { 
    type: String, 
    maxlength: 1000 
  },
  termLength: { 
    type: Number 
  }, // years
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  }
}, { 
  timestamps: true 
});

// Compound unique index: slug unique within governing body
Office.index({ governingBody: 1, slug: 1 }, { unique: true });

// Additional indexes for common queries
Office.index({ governingBody: 1, isActive: 1 });
Office.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Office', Office);
