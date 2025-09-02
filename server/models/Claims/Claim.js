const mongoose = require('mongoose');
// Import obligation schema structures
const { 
    ObligationSchemaStructure, 
    ObligationDispositions
  } = require('../Obligations');
const { Schema } = mongoose;
const { PromiseSchemaStructure, PromiseDispositions } = require('../Obligations');

/*
This model represents a claim against an obligation or promise.

A claim can be related to an obligation or promise, in which case the disposition would be "Supporting" or "Against" or "Neutral".
The claim can also be a general claim not tied to a specific obligation or promise.

Claims are used to track user positions on various issues and can be aggregated to show community sentiment.
*/

// Get all possible paths from obligation and promise schemas
const obligationPaths = Object.keys(ObligationSchemaStructure);
const promisePaths = Object.keys(PromiseSchemaStructure);

// Combine all paths for comprehensive claim validation
const allPaths = [...new Set([...obligationPaths, ...promisePaths])];

// Filter out internal mongoose fields and keep only relevant attributes
const relevantAttributes = allPaths.filter(path => 
  !path.startsWith('_') && 
  !path.includes('.') && // Exclude nested fields
  !['__v', 'createdAt', 'updatedAt', 'obligationType'].includes(path)
);

// Add some common claimable attributes that might not be in the schema
const commonAttributes = ['status', 'progress', 'completion', 'failure', 'cancellation'];

// Combine and return unique attributes
const claimableAttributes = [...new Set([...relevantAttributes, ...commonAttributes])];

const ClaimSchema = new Schema({
  // Basic claim information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Claim disposition
  disposition: {
    type: String,
    enum: [
        ...ObligationDispositions,
        ...PromiseDispositions
    ],
    required: true,
    index: true
  },
  
  // Evidence that supports this claim
  evidence: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  }],

  // Obligation that this claim is against
  obligation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obligation'
  },

  // Specific obligation attribute that this claim is against
  obligationAttribute: {
    type: String,
    /* Referencing the particular data attribute of the obligation that is being claimed against. This is an enumerated list of data attributes that are present in the obligation data object. */
    enum: claimableAttributes,
    required: true,
    index: true
  },
  
  // Creator
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
ClaimSchema.index({ disposition: 1, createdAt: -1 });
ClaimSchema.index({ creator: 1, createdAt: -1 });
ClaimSchema.index({ obligation: 1, disposition: 1 });
ClaimSchema.index({ obligationAttribute: 1, obligation: 1 });

module.exports = mongoose.model('Claim', ClaimSchema);