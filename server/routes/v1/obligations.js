const express = require('express');
const router = express.Router();
const { 
  Obligation, 
  Promise, 
  Petition, 
  ObligationDispositions, 
  PromiseDispositions, 
  PetitionDispositions 
} = require('../../models/Obligations');
const { Jurisdiction, GoverningBody, Legislation } = require('../../models/Government');
const Vote = require('../../models/Vote');
const User = require('../../models/User');
const { getTrendingPetitions, getPetitionStats, validatePetitionData } = require('../../utils/petitionUtils');

// GET /v1/obligations - Get all obligations with optional type filtering
router.get('/', async (req, res) => {
  try {
    const { 
      type,           // Filter by obligation type (promise, petition, etc.)
      category,       // Filter by category
      status,         // Filter by status
      creator,        // Filter by creator ID
      jurisdiction,   // Filter by jurisdiction ID
      governingBody,  // Filter by governing body ID
      legislation,    // Filter by legislation ID
      isActive,       // Filter by active status
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Type filtering - if specified, filter by obligation type
    if (type) {
      filter.obligationType = type;
    }
    
    // Common obligation fields
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (creator) filter.creator = creator;
    if (jurisdiction) filter.jurisdiction = jurisdiction;
    if (governingBody) filter.governingBody = governingBody;
    if (legislation) filter.legislation = legislation;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get all dispositions for claims summary
    const dispositions = [...ObligationDispositions, ...PromiseDispositions, ...PetitionDispositions];
    
    // Query obligations with population
    const obligations = await Obligation.find(filter)
      .populate('creator', 'username firstName lastName')
      .populate('jurisdiction', 'name slug level')
      .populate('governingBody', 'name slug branch')
      .populate('legislation', 'title bill_number status')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Obligation.countDocuments(filter);

    // Generate claims summary for each obligation
    const obligationsWithClaims = await Promise.all(
      obligations.map(async (obligation) => {
        const obligationObj = obligation.toObject();
        
        // Get claims for this obligation
        const Claim = require('../../models/Claims/Claim');
        const claims = await Claim.find({ obligation: obligation._id });
        
        // Generate claims summary
        const claimsSummary = generateClaimsSummary(claims, dispositions);
        obligationObj.claimsSummary = claimsSummary;
        
        return obligationObj;
      })
    );

    // Get type distribution for mixed queries
    let typeDistribution = null;
    if (!type) {
      typeDistribution = await Obligation.aggregate([
        { $group: { _id: '$obligationType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    }

    res.json({
      obligations: obligationsWithClaims,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
        types: typeDistribution ? typeDistribution.map(t => ({ type: t._id, count: t.count })) : undefined,
        filteredBy: type ? type : 'all'
      }
    });
  } catch (error) {
    console.error('Error fetching obligations:', error);
    res.status(500).json({ error: 'Failed to fetch obligations' });
  }
});

// GET /v1/obligations/trending - Get trending obligations (mixed or by type)
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10, timeFrame = 'week', type } = req.query;
    
    let trendingObligations;
    
    if (type === 'petition') {
      // Use existing petition trending logic
      trendingObligations = await getTrendingPetitions(parseInt(limit), timeFrame);
    } else {
      // For mixed types or other types, implement generic trending
      trendingObligations = await getTrendingObligations(parseInt(limit), timeFrame, type);
    }
    
    res.json(trendingObligations);
  } catch (error) {
    console.error('Error fetching trending obligations:', error);
    res.status(500).json({ error: 'Failed to fetch trending obligations' });
  }
});

// GET /v1/obligations/stats - Get obligation statistics
router.get('/stats', async (req, res) => {
  try {
    const { type } = req.query;
    
    const filter = {};
    if (type) filter.obligationType = type;
    
    const totalObligations = await Obligation.countDocuments(filter);
    const activeObligations = await Obligation.countDocuments({ ...filter, isActive: true });
    
    // Get type distribution
    const typeDistribution = await Obligation.aggregate([
      { $match: filter },
      { $group: { _id: '$obligationType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get status distribution
    const statusDistribution = await Obligation.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      total: totalObligations,
      active: activeObligations,
      typeDistribution,
      statusDistribution
    });
  } catch (error) {
    console.error('Error fetching obligation stats:', error);
    res.status(500).json({ error: 'Failed to fetch obligation statistics' });
  }
});

// GET /v1/obligations/:id - Get a specific obligation by ID
router.get('/:id', async (req, res) => {
  try {
    const obligation = await Obligation.findById(req.params.id)
      .populate('creator', 'username firstName lastName')
      .populate('jurisdiction', 'name slug level path')
      .populate('governingBody', 'name slug branch entity_type')
      .populate('legislation', 'title bill_number status introduced_date');

    if (!obligation) {
      return res.status(404).json({ error: 'Obligation not found' });
    }

    res.json(obligation);
  } catch (error) {
    console.error('Error fetching obligation:', error);
    res.status(500).json({ error: 'Failed to fetch obligation' });
  }
});

// POST /v1/obligations - Create a new obligation
router.post('/', async (req, res) => {
  try {
    const { obligationType, ...obligationData } = req.body;

    if (!obligationType) {
      return res.status(400).json({ error: 'Obligation type is required' });
    }

    let newObligation;

    // Create the appropriate obligation type
    switch (obligationType) {
      case 'petition':
        // Validate petition data
        const validation = validatePetitionData(obligationData);
        if (!validation.isValid) {
          return res.status(400).json({ error: validation.errors.join(', ') });
        }
        newObligation = new Petition(obligationData);
        break;
        
      case 'promise':
        newObligation = new Promise(obligationData);
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid obligation type' });
    }

    await newObligation.save();

    // Populate references before sending response
    await newObligation.populate('creator', 'username firstName lastName');
    await newObligation.populate('jurisdiction', 'name slug level');
    await newObligation.populate('governingBody', 'name slug branch');
    await newObligation.populate('legislation', 'title bill_number status');

    res.status(201).json(newObligation);
  } catch (error) {
    console.error('Error creating obligation:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create obligation' });
  }
});

// PUT /v1/obligations/:id - Update an obligation
router.put('/:id', async (req, res) => {
  try {
    const obligation = await Obligation.findById(req.params.id);
    if (!obligation) {
      return res.status(404).json({ error: 'Obligation not found' });
    }

    // Update fields (excluding obligationType which shouldn't change)
    const { obligationType, ...updateData } = req.body;
    
    Object.assign(obligation, updateData);
    await obligation.save();

    // Populate references before sending response
    await obligation.populate('creator', 'username firstName lastName');
    await obligation.populate('jurisdiction', 'name slug level');
    await obligation.populate('governingBody', 'name slug branch');
    await obligation.populate('legislation', 'title bill_number status');

    res.json(obligation);
  } catch (error) {
    console.error('Error updating obligation:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update obligation' });
  }
});

// DELETE /v1/obligations/:id - Delete an obligation (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const obligation = await Obligation.findById(req.params.id);
    if (!obligation) {
      return res.status(404).json({ error: 'Obligation not found' });
    }

    // Soft delete by setting isActive to false
    obligation.isActive = false;
    await obligation.save();

    res.json({ message: 'Obligation deleted successfully' });
  } catch (error) {
    console.error('Error deleting obligation:', error);
    res.status(500).json({ error: 'Failed to delete obligation' });
  }
});

// POST /v1/obligations/:id/vigor - Add vigor to an obligation
router.post('/:id/vigor', async (req, res) => {
  try {
    const { id } = req.params;
    const { vigorType, vigorAmount, description } = req.body;
    
    // Verify obligation exists
    const obligation = await Obligation.findById(id);
    if (!obligation) {
      return res.status(404).json({ error: 'Obligation not found' });
    }

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Create new vigor entry
    const Vigor = require('../../models/Vigor');
    const vigor = new Vigor({
      user: req.user._id,
      entity: id,
      entityType: 'obligation',
      vigorType: vigorType || 'support',
      vigorAmount: vigorAmount || 1,
      description: description || '',
      createdAt: new Date()
    });

    await vigor.save();

    res.status(201).json({ 
      message: 'Vigor added successfully',
      data: vigor 
    });
  } catch (error) {
    console.error('Error adding vigor:', error);
    res.status(500).json({ error: 'Failed to add vigor' });
  }
});

// POST /v1/obligations/:id/votes - Vote on an obligation
router.post('/:id/votes', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify obligation exists
    const obligation = await Obligation.findById(id);
    if (!obligation) {
      return res.status(404).json({ error: 'Obligation not found' });
    }

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({ 
      user: req.user._id, 
      entity: id, 
      entityType: 'obligation' 
    });

    if (existingVote) {
      return res.status(409).json({ 
        error: 'User has already voted on this obligation',
        voteId: existingVote._id 
      });
    }

    // Create new vote
    const vote = new Vote({
      user: req.user._id,
      entity: id,
      entityType: 'obligation',
      voteType: 'support', // Default vote type for obligations
      createdAt: new Date()
    });

    await vote.save();

    res.status(201).json({ 
      message: 'Vote recorded successfully',
      data: vote 
    });
  } catch (error) {
    console.error('Error creating vote:', error);
    res.status(500).json({ error: 'Failed to create vote' });
  }
});

// GET /v1/obligations/:id/claims - Get detailed claims for an obligation
router.get('/:id/claims', async (req, res) => {
  try {
    const { 
      disposition, 
      attribute, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Verify obligation exists
    const obligation = await Obligation.findById(req.params.id);
    if (!obligation) {
      return res.status(404).json({ error: 'Obligation not found' });
    }

    // Build filter for claims
    const filter = { obligation: req.params.id };
    if (disposition) filter.disposition = disposition;
    if (attribute) filter.obligationAttribute = attribute;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get claims with population
    const Claim = require('../../models/Claims/Claim');
    const claims = await Claim.find(filter)
      .populate('creator', 'username firstName lastName')
      .populate('evidence', 'title description')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Claim.countDocuments(filter);

    res.json({
      claims,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
        obligation: {
          id: obligation._id,
          title: obligation.title,
          obligationType: obligation.obligationType
        }
      }
    });
  } catch (error) {
    console.error('Error fetching obligation claims:', error);
    res.status(500).json({ error: 'Failed to fetch obligation claims' });
  }
});

// Helper function to generate claims summary
function generateClaimsSummary(claims, dispositions) {
  if (!claims || claims.length === 0) {
    return {
      totalClaims: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  const summary = {
    totalClaims: claims.length,
    lastUpdated: new Date().toISOString()
  };

  // Group claims by obligation attribute and disposition
  const attributeBreakdown = {};
  
  claims.forEach(claim => {
    const attribute = claim.obligationAttribute;
    const disposition = claim.disposition;
    
    if (!attributeBreakdown[attribute]) {
      attributeBreakdown[attribute] = {};
      // Initialize all dispositions with 0
      dispositions.forEach(disp => {
        attributeBreakdown[attribute][disp] = 0;
      });
    }
    
    if (attributeBreakdown[attribute][disposition] !== undefined) {
      attributeBreakdown[attribute][disposition]++;
    }
  });

  // Only include attributes that have claims
  Object.keys(attributeBreakdown).forEach(attribute => {
    const hasClaims = dispositions.some(disp => attributeBreakdown[attribute][disp] > 0);
    if (!hasClaims) {
      delete attributeBreakdown[attribute];
    }
  });

  summary.attributeBreakdown = attributeBreakdown;
  
  return summary;
}

// Helper function for generic trending obligations
async function getTrendingObligations(limit, timeFrame, type) {
  try {
    const filter = {};
    if (type) filter.obligationType = type;
    
    // For now, return basic trending by creation date
    // This can be enhanced with more sophisticated trending algorithms
    const trendingObligations = await Obligation.find(filter)
      .populate('creator', 'username firstName lastName')
      .populate('jurisdiction', 'name slug level')
      .populate('governingBody', 'name slug branch')
      .sort({ createdAt: -1 })
      .limit(limit);

    return trendingObligations;
  } catch (error) {
    console.error('Error getting trending obligations:', error);
    throw error;
  }
}

module.exports = router;
