const mongoose = require('mongoose');
const { Schema } = mongoose;

const Taxonomy = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true, 
    unique: true 
  },
  type: { 
    type: String, 
    enum: ['category', 'tag', 'topic'], 
    required: true, 
    index: true 
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Taxonomy', 
    index: true 
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

// Indexes for common queries
Taxonomy.index({ type: 1, isActive: 1 });
Taxonomy.index({ parent: 1, isActive: 1 });
Taxonomy.index({ slug: 1, type: 1 });

module.exports = mongoose.model('Taxonomy', Taxonomy);
