const mongoose = require('mongoose');
const { Schema } = mongoose;

const Petition = new Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 200 
  },
  description: { 
    type: String, 
    required: true, 
    maxlength: 5000 
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Taxonomy', 
    required: true, 
    index: true 
  },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  jurisdiction: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Jurisdiction', 
    required: true, 
    index: true 
  },
  governingBody: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'GoverningBody', 
    index: true 
  },
  legislation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Legislation', 
    index: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'closed', 'archived'], 
    default: 'active', 
    index: true 
  },
  tags: [{ 
    type: String, 
    trim: true, 
    maxlength: 50 
  }],
  snapshot: {                     // optional cached counts
    voteCount: { 
      type: Number, 
      default: 0 
    },
    totalVigor: { 
      type: Number, 
      default: 0 
    }
  }
}, { 
  timestamps: true 
});

// Indexes for common queries
Petition.index({ creator: 1, createdAt: -1 });
Petition.index({ jurisdiction: 1, status: 1, createdAt: -1 });
Petition.index({ 'snapshot.voteCount': -1 });
Petition.index({ status: 1, createdAt: -1 });

// Text search index
Petition.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Petition', Petition);
