const mongoose = require('mongoose');
const { Schema } = mongoose;

const Jurisdiction = new Schema({
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
  level: { 
    type: String, 
    enum: ['federal', 'state', 'county', 'city', 'district'], 
    required: true, 
    index: true 
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Jurisdiction', 
    index: true 
  },
  ancestors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Jurisdiction', 
    index: true 
  }],
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  },
  description: { 
    type: String, 
    maxlength: 1000 
  }
}, { 
  timestamps: true 
});

// Compound unique index: slug unique within parent
Jurisdiction.index({ slug: 1, parent: 1 }, { unique: true });

// Additional indexes for common queries
Jurisdiction.index({ level: 1, isActive: 1 });
Jurisdiction.index({ ancestors: 1, isActive: 1 });

module.exports = mongoose.model('Jurisdiction', Jurisdiction);
