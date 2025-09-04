const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Identity, IdentitySchema } = require('./Identity');

// Create EconomicIdentity schema that extends the base Identity schema
const EconomicIdentitySchema = new Schema({  
  // Economic-specific fields
  incomeRange: {
    high: {
      type: Number,
      required: true
    },
    low: {
      type: Number,
      required: true
    },
  }
}, { 
  timestamps: true
});

// Indexes for efficient querying
EconomicIdentitySchema.index({ parentId: 1, isActive: 1 });

// Virtual for economic children
EconomicIdentitySchema.virtual('children', {
  ref: 'EconomicIdentity',
  localField: 'id',
  foreignField: 'parentId'
});

// Virtual for economic parent
EconomicIdentitySchema.virtual('parent', {
  ref: 'EconomicIdentity',
  localField: 'parentId',
  foreignField: 'id'
});

// Ensure virtuals are serialized
EconomicIdentitySchema.set('toJSON', { virtuals: true });
EconomicIdentitySchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure slug uniqueness
EconomicIdentitySchema.pre('save', async function(next) {
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
EconomicIdentitySchema.pre('save', async function(next) {
  if (this.parentId && this.parentId === this.id) {
    const error = new Error('Economic identity cannot be its own parent');
    error.name = 'ValidationError';
    return next(error);
  }
  
  if (this.parentId) {
    const parent = await this.constructor.findOne({ id: this.parentId, isActive: true });
    if (!parent) {
      const error = new Error('Parent economic identity not found');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Create EconomicIdentity as a discriminator of Identity
// This automatically inherits all Identity fields and creates polymorphic behavior
const EconomicIdentity = Identity.discriminator('EconomicIdentity', EconomicIdentitySchema);

module.exports = EconomicIdentity;
