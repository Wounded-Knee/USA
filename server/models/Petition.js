const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 2000
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  voteCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: true,
    enum: ['environment', 'education', 'healthcare', 'economy', 'civil-rights', 'foreign-policy', 'other'],
    default: 'other'
  },
  // Government entity references
  jurisdiction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
    required: true
  },
  governingBody: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GoverningBody'
  },
  legislation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Legislation'
  },
  targetVotes: {
    type: Number,
    default: 1000,
    min: 1
  },
  totalVigor: {
    type: Number,
    default: 0,
    min: 0
  },
  vigorThreshold: {
    type: Number,
    default: 500,
    min: 0
  },
  notificationThreshold: {
    type: Number,
    default: 1000,
    min: 0
  },
  vigorReducedThreshold: {
    type: Number,
    default: 750,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
petitionSchema.index({ creator: 1, createdAt: -1 });
petitionSchema.index({ category: 1, isActive: 1 });
petitionSchema.index({ voteCount: -1, createdAt: -1 });
// New indexes for government entity queries
petitionSchema.index({ jurisdiction: 1, isActive: 1 });
petitionSchema.index({ governingBody: 1, isActive: 1 });
petitionSchema.index({ legislation: 1, isActive: 1 });
petitionSchema.index({ jurisdiction: 1, category: 1 });

module.exports = mongoose.model('Petition', petitionSchema);
