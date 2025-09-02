const mongoose = require('mongoose');
const { Schema } = mongoose;

const GoverningBody = new Schema({
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
  jurisdiction: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Jurisdiction', 
    required: true, 
    index: true 
  },
  branch: { 
    type: String, 
    enum: ['executive', 'legislative', 'judicial'], 
    required: true 
  },
  entity_type: { 
    type: String, 
    enum: ['council', 'board', 'commission', 'agency', 'department', 'court'], 
    required: true 
  },
  description: { 
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

// Compound unique index: slug unique within jurisdiction
GoverningBody.index({ jurisdiction: 1, slug: 1 }, { unique: true });

// Additional indexes for common queries
GoverningBody.index({ branch: 1, isActive: 1 });
GoverningBody.index({ entity_type: 1, isActive: 1 });
GoverningBody.index({ jurisdiction: 1, isActive: 1 });

module.exports = mongoose.model('GoverningBody', GoverningBody);
