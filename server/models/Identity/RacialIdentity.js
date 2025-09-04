const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Identity, IdentitySchema } = require('./Identity');

// Create RacialIdentity schema that extends the base Identity schema
const RacialIdentitySchema = new Schema({  
  // Racial-specific fields can be added here if needed in the future
}, { 
  timestamps: true
});

// Indexes for efficient querying
RacialIdentitySchema.index({ parentId: 1, isActive: 1 });

// Virtual for racial children
RacialIdentitySchema.virtual('children', {
  ref: 'RacialIdentity',
  localField: 'id',
  foreignField: 'parentId'
});

// Virtual for racial parent
RacialIdentitySchema.virtual('parent', {
  ref: 'RacialIdentity',
  localField: 'parentId',
  foreignField: 'id'
});

// Ensure virtuals are serialized
RacialIdentitySchema.set('toJSON', { virtuals: true });
RacialIdentitySchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure slug uniqueness
RacialIdentitySchema.pre('save', async function(next) {
  if (this.isModified('slug')) {
    const existing = await this.constructor.findOne({ 
      slug: this.slug, 
      _id: { $ne: this._id } 
    });
    if (existing) {
      const error = new Error('Slug must be unique');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Pre-save middleware to validate parent-child relationships
RacialIdentitySchema.pre('save', async function(next) {
  if (this.parentId && this.parentId === this.id) {
    const error = new Error('Racial identity cannot be its own parent');
    error.name = 'ValidationError';
    return next(error);
  }
  
  if (this.parentId) {
    const parent = await this.constructor.findOne({ id: this.parentId, isActive: true });
    if (!parent) {
      const error = new Error('Parent racial identity not found');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Create RacialIdentity as a discriminator of Identity
// This automatically inherits all Identity fields and creates polymorphic behavior
const RacialIdentity = Identity.discriminator('RacialIdentity', RacialIdentitySchema);

module.exports = RacialIdentity;
