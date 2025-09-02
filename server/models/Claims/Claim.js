const mongoose = require('mongoose');
// Import obligation schema structures
const { 
    ObligationSchemaStructure, 
    PromiseSchemaStructure, 
    PetitionSchemaStructure,
    ObligationDispositions,
    PromiseDispositions,
    PetitionDispositions
  } = require('../Obligations');
const { Schema } = mongoose;

/*
This model represents a claim made by a citizen toward various controversies in Whitepine which arise by the aggregation of citizen data en masse. Controversies do not have a distinct presence in the data model, but rather are computed by the aggregation of citizen data. Presence of claims can manifest as a split in aggregate opinion on a matter, and the attraction and collection of further claims (toward both sides of the controversy) can settle the controversy mathematically.

A claim should involve supporting evidence, so a claim links to evidence. A claim can also be related to an obligation, in which case the claim is a claim against the obligation. In this case the claim needs an attribute to signify the disposition of the claim - ie is the claim that the obligation has been met, or that it has been broken?

Claim disposition is not binary, it could be "This obligation was discharged" or "the representative is moving too slowly on this or "the game has changed since they promised this so they should be let off the hook"... disposition should be an enum in order to support aggregation of claims by disposition.

A claim can be related to a petition, in which case the disposition would be "Supporting" or "Against" or "Neutral".

A claim can be related to a promise, in which case the disposition would be "Kept" or "Broken" or "Partially Kept" or "No Action Taken". 

A claim should reference evidence which supports the claim.
*/

// Function to get obligation attributes from schema structures
function getObligationAttributes() {
  // Get all schema paths from the schema structures
  const obligationPaths = Object.keys(ObligationSchemaStructure);
  const promisePaths = Object.keys(PromiseSchemaStructure);
  const petitionPaths = Object.keys(PetitionSchemaStructure);
  
  // Combine all unique paths and filter for relevant attributes
  const allPaths = [...new Set([...obligationPaths, ...promisePaths, ...petitionPaths])];
  
  // Filter out internal mongoose fields and keep only relevant attributes
  const relevantAttributes = allPaths.filter(path => 
    !path.startsWith('_') && 
    !path.includes('.') && // Exclude nested fields
    !['__v', 'createdAt', 'updatedAt', 'obligationType'].includes(path)
  );
  
  // Add some common claimable attributes that might not be in the schema
  const commonAttributes = ['status', 'progress', 'completion', 'failure', 'cancellation'];
  
  // Combine and return unique attributes
  return [...new Set([...relevantAttributes, ...commonAttributes])];
}

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
        ...PromiseDispositions,
        ...PetitionDispositions
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
    /* Referencing the particular data attribute of the obligation that is being claimed against. This is an enumerated list of data attributes that are supported by the obligation. */
    type: String,
    enum: getObligationAttributes(),
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