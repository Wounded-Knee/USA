const mongoose = require('mongoose');
const { Schema } = mongoose;

const Identity = new Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true, 
    index: true 
  },
  parentId: { 
    type: Number, 
    default: null, 
    index: true 
  },
  name: { 
    type: String, 
    required: true, 
    maxlength: 100, 
    index: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    maxlength: 100, 
    index: true 
  },
  abbr: { 
    type: String, 
    required: true, 
    maxlength: 20, 
    index: true 
  },
  color: { 
    type: String, 
    required: true, 
    maxlength: 7, 
    validate: {
      validator: function(v) {
        return /^#[0-9A-F]{6}$/i.test(v);
      },
      message: 'Color must be a valid hex color code'
    }
  },
  description: { 
    type: String, 
    required: true, 
    maxlength: 500 
  },
  level: { 
    type: Number, 
    default: 0, 
    index: true 
  },
  path: { 
    type: [Number], 
    default: [] 
  },
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  }
}, { 
  timestamps: true 
});

// Indexes for efficient querying
Identity.index({ parentId: 1, isActive: 1 });
Identity.index({ level: 1, isActive: 1 });
Identity.index({ slug: 1, isActive: 1 });
Identity.index({ abbr: 1, isActive: 1 });

// Virtual for children
Identity.virtual('children', {
  ref: 'Identity',
  localField: 'id',
  foreignField: 'parentId'
});

// Virtual for parent
Identity.virtual('parent', {
  ref: 'Identity',
  localField: 'parentId',
  foreignField: 'id'
});

// Ensure virtuals are serialized
Identity.set('toJSON', { virtuals: true });
Identity.set('toObject', { virtuals: true });

module.exports = mongoose.model('Identity', Identity);
