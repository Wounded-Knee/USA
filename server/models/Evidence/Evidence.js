const mongoose = require('mongoose');
const { Schema } = mongoose;

/*
    A piece of evidence that supports a claim or an obligation.

    It may be a document, a video, an image, a sound, a link to a webpage, a reference to a social media post such as an x.com tweet, a facebook post, an instagram video, or a piece of information.

    Metadata about the evidence such as the source, the date of the evidence, and the type of evidence should be supported.

    This is a base schema for all types of evidence. Other schemas will inherit from this schema. This schema will be generic and will contain only the data that all evidence types should have.
*/

const EvidenceSchema = new Schema({
  // Basic evidence information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  
  description: {
    type: String,
    maxlength: 1000,
    trim: true
  },
    
  relationship: {
    type: String,
    enum: ['primary', 'secondary', 'corroborating', 'contradicting', 'contextual'],
    default: 'primary',
    index: true
  },
  
  // Evidence metadata
  dateCollected: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  dateCreated: {
    type: Date,
    index: true
  },
  
  location: {
    type: String,
    maxlength: 200
  },
  
  language: {
    type: String,
    maxlength: 50,
    default: 'en'
  },
  
  // Relationships
  relatedEvidence: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  }],
  
  // Media references (links to Media model)
  mediaReferences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],

  // Tags and categorization
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  
  // Creator and ownership
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for common queries
EvidenceSchema.index({ relationship: 1, createdAt: -1 });
EvidenceSchema.index({ dateCollected: 1, createdAt: -1 });
EvidenceSchema.index({ creator: 1, createdAt: -1 });
EvidenceSchema.index({ tags: 1, createdAt: -1 });

// Text search index
EvidenceSchema.index({ 
  title: 'text', 
  description: 'text'
});

// Virtual for evidence age
EvidenceSchema.virtual('evidenceAge').get(function() {
  const date = this.dateCreated || this.dateCollected || this.createdAt;
  return Date.now() - date.getTime();
});

// Virtual for days since collection
EvidenceSchema.virtual('daysSinceCollected').get(function() {
  return Math.ceil((Date.now() - this.dateCollected.getTime()) / (1000 * 60 * 60 * 24));
});

// Set virtuals when converting to JSON
EvidenceSchema.set('toJSON', { virtuals: true });
EvidenceSchema.set('toObject', { virtuals: true });

// Static method to find evidence by relationship
EvidenceSchema.statics.findByRelationship = function(relationship) {
  return this.find({ relationship });
};

// Static method to find evidence by creator
EvidenceSchema.statics.findByCreator = function(creatorId) {
  return this.find({ creator: creatorId });
};

// Static method to find evidence by tags
EvidenceSchema.statics.findByTags = function(tags) {
  return this.find({ tags: { $in: tags } });
};

module.exports = mongoose.model('Evidence', EvidenceSchema);
