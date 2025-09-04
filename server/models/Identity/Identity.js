const mongoose = require('mongoose');
const { Schema } = mongoose;

const IdentitySchema = new Schema({
  id: { // The unique identifier for this identity in the taxonomy
    type: Number, 
    required: true, 
    unique: true, 
    index: true 
  },
  parentId: { // The parent identity of this identity in the taxonomy
    type: Number, 
    default: null, 
    index: true 
  },
  populationEstimate: {
    year: { // The year of the population estimate
      type: Number,
      required: true
    },
    source: { // The source of the population estimate
      type: String,
      required: true
    },
    estimate: { // The estimated number of people who identify with this identity in the USA in 2025
      type: Number,
      required: true
    }
  },
  name: { // The name of the identity
    type: String, 
    required: true, 
    maxlength: 100, 
    index: true 
  },
  slug: { // The slug of the identity
    type: String, 
    required: true, 
    unique: true, 
    maxlength: 100, 
    index: true 
  },
  abbr: { // The abbreviation of the identity
    type: String, 
    required: true, 
    maxlength: 20, 
    index: true 
  },
  description: { // The description of the identity
    type: String, 
    required: true, 
    maxlength: 500 
  },
  isActive: { // True if the identity is active, false if it is soft deleted
    type: Boolean, 
    default: true, 
    index: true 
  }
}, { 
  timestamps: true,
  discriminatorKey: 'identityType' // This enables polymorphic inheritance
});

// Indexes for efficient querying
IdentitySchema.index({ parentId: 1, isActive: 1 });
IdentitySchema.index({ slug: 1, isActive: 1 });
IdentitySchema.index({ abbr: 1, isActive: 1 });

// Virtual for children
IdentitySchema.virtual('children', {
  ref: 'Identity',
  localField: 'id',
  foreignField: 'parentId'
});

// Virtual for parent
IdentitySchema.virtual('parent', {
  ref: 'Identity',
  localField: 'parentId',
  foreignField: 'id'
});

// Ensure virtuals are serialized
IdentitySchema.set('toJSON', { virtuals: true });
IdentitySchema.set('toObject', { virtuals: true });

// Create and export the base Identity model
const Identity = mongoose.model('Identity', IdentitySchema);

// Export both the model and schema for use in discriminators
module.exports = { Identity, IdentitySchema };
