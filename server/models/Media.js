const mongoose = require('mongoose');
const { Schema } = mongoose;

const Media = new Schema({
  filename: { 
    type: String, 
    required: true 
  },
  originalName: { 
    type: String, 
    required: true 
  },
  mediaType: { 
    type: String, 
    enum: ['image', 'document', 'video'], 
    required: true, 
    index: true 
  },
  bytes: { 
    type: Number, 
    required: true 
  },
  mime: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    maxlength: 500 
  },
  isPrimary: { 
    type: Boolean, 
    default: false, 
    index: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  entityType: { 
    type: String, 
    enum: ['User', 'Petition', 'Jurisdiction', 'GoverningBody', 'Office', 'Position', 'Legislation'], 
    required: true, 
    index: true 
  },
  entityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    index: true 
  },
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  }
}, { 
  timestamps: true 
});

// Indexes for common queries
Media.index({ entityType: 1, entityId: 1, createdAt: -1 });
Media.index({ uploadedBy: 1, createdAt: -1 });
Media.index({ mediaType: 1, isActive: 1 });
Media.index({ isPrimary: 1, entityType: 1, entityId: 1 });

module.exports = mongoose.model('Media', Media);

