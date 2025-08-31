const { Types } = require('mongoose');
const { 
  Media,
  Jurisdiction, 
  GoverningBody, 
  Office, 
  Position, 
  Election,
  Legislation,
  GovernmentVote,
  Committee,
  District,
  ContactInfo,
  CONSTANTS 
} = require('../models/Government');

// ------------------------------
// Path Management Utilities
// ------------------------------

/**
 * Generate a materialized path for hierarchical entities
 * @param {string} slug - The current entity's slug
 * @param {string} parentPath - The parent's path (optional)
 * @returns {string} The complete materialized path
 */
function generatePath(slug, parentPath = '') {
  return parentPath ? `${parentPath}/${slug}` : `/${slug}`;
}

/**
 * Calculate depth from a materialized path
 * @param {string} path - The materialized path
 * @returns {number} The depth level
 */
function calculateDepth(path) {
  if (!path || path === '/') return 0;
  return path.split('/').filter(segment => segment.length > 0).length;
}

/**
 * Get all ancestors of a jurisdiction by path
 * @param {string} path - The materialized path
 * @returns {Promise<Array>} Array of ancestor jurisdictions
 */
async function getAncestors(path) {
  if (!path || path === '/') return [];
  
  const pathSegments = path.split('/').filter(segment => segment.length > 0);
  const ancestorPaths = [];
  
  for (let i = 1; i < pathSegments.length; i++) {
    ancestorPaths.push('/' + pathSegments.slice(0, i).join('/'));
  }
  
  return await Jurisdiction.find({ path: { $in: ancestorPaths } }).sort({ depth: 1 });
}

/**
 * Get all descendants of a jurisdiction
 * @param {string} path - The materialized path
 * @returns {Promise<Array>} Array of descendant jurisdictions
 */
async function getDescendants(path) {
  const regex = new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`);
  return await Jurisdiction.find({ path: regex }).sort({ depth: 1 });
}

// ------------------------------
// Jurisdiction Utilities
// ------------------------------

/**
 * Create a new jurisdiction with proper path and depth
 * @param {Object} jurisdictionData - The jurisdiction data
 * @returns {Promise<Object>} The created jurisdiction
 */
async function createJurisdiction(jurisdictionData) {
  const { parent, slug, ...otherData } = jurisdictionData;
  
  let parentPath = '';
  let parentDepth = 0;
  
  if (parent) {
    const parentJurisdiction = await Jurisdiction.findById(parent);
    if (!parentJurisdiction) {
      throw new Error('Parent jurisdiction not found');
    }
    parentPath = parentJurisdiction.path;
    parentDepth = parentJurisdiction.depth;
  }
  
  const path = generatePath(slug, parentPath);
  const depth = parentDepth + 1;
  
  const jurisdiction = new Jurisdiction({
    ...otherData,
    slug,
    parent,
    path,
    depth
  });
  
  return await jurisdiction.save();
}

/**
 * Get jurisdiction hierarchy tree
 * @param {string} jurisdictionId - The jurisdiction ID
 * @returns {Promise<Object>} The jurisdiction with its hierarchy
 */
async function getJurisdictionHierarchy(jurisdictionId) {
  const jurisdiction = await Jurisdiction.findById(jurisdictionId);
  if (!jurisdiction) return null;
  
  const ancestors = await getAncestors(jurisdiction.path);
  const descendants = await getDescendants(jurisdiction.path);
  
  return {
    jurisdiction,
    ancestors,
    descendants
  };
}

// ------------------------------
// Governing Body Utilities
// ------------------------------

/**
 * Create a governing body with proper path and depth
 * @param {Object} bodyData - The governing body data
 * @returns {Promise<Object>} The created governing body
 */
async function createGoverningBody(bodyData) {
  const { parent, slug, jurisdiction, ...otherData } = bodyData;
  
  // Verify jurisdiction exists
  const jurisdictionDoc = await Jurisdiction.findById(jurisdiction);
  if (!jurisdictionDoc) {
    throw new Error('Jurisdiction not found');
  }
  
  let parentPath = '';
  let parentDepth = 0;
  
  if (parent) {
    const parentBody = await GoverningBody.findById(parent);
    if (!parentBody) {
      throw new Error('Parent governing body not found');
    }
    parentPath = parentBody.path;
    parentDepth = parentBody.depth;
  }
  
  const path = generatePath(slug, parentPath);
  const depth = parentDepth + 1;
  
  const governingBody = new GoverningBody({
    ...otherData,
    slug,
    parent,
    path,
    depth,
    jurisdiction
  });
  
  return await governingBody.save();
}

/**
 * Get all governing bodies for a jurisdiction
 * @param {string} jurisdictionId - The jurisdiction ID
 * @param {string} branch - Optional branch filter
 * @returns {Promise<Array>} Array of governing bodies
 */
async function getGoverningBodies(jurisdictionId, branch = null) {
  const query = { jurisdiction: jurisdictionId };
  if (branch) query.branch = branch;
  
  return await GoverningBody.find(query).sort({ depth: 1, name: 1 });
}

// ------------------------------
// Office and Position Utilities
// ------------------------------

/**
 * Get current office holders for a jurisdiction
 * @param {string} jurisdictionId - The jurisdiction ID
 * @param {string} officeType - Optional office type filter
 * @returns {Promise<Array>} Array of current positions
 */
async function getCurrentOfficeHolders(jurisdictionId, officeType = null) {
  const query = {
    'office.jurisdiction': jurisdictionId,
    is_current: true
  };
  
  if (officeType) {
    query['office.office_type'] = officeType;
  }
  
  return await Position.find(query)
    .populate('office')
    .populate('person', 'firstName lastName email avatar')
    .sort({ 'office.office_type': 1, 'office.name': 1 });
}

/**
 * Get office history for a person
 * @param {string} personId - The person's User ID
 * @returns {Promise<Array>} Array of positions held
 */
async function getPersonOfficeHistory(personId) {
  return await Position.find({ person: personId })
    .populate('office')
    .populate('office.governing_body')
    .populate('office.jurisdiction')
    .sort({ term_start: -1 });
}

/**
 * Get current positions for a person
 * @param {string} personId - The person's User ID
 * @returns {Promise<Array>} Array of current positions
 */
async function getPersonCurrentPositions(personId) {
  return await Position.find({ 
    person: personId, 
    is_current: true 
  })
    .populate('office')
    .populate('office.governing_body')
    .populate('office.jurisdiction');
}

// ------------------------------
// Election Utilities
// ------------------------------

/**
 * Get upcoming elections for a jurisdiction
 * @param {string} jurisdictionId - The jurisdiction ID
 * @param {Date} fromDate - Start date (defaults to now)
 * @returns {Promise<Array>} Array of upcoming elections
 */
async function getUpcomingElections(jurisdictionId, fromDate = new Date()) {
  return await Election.find({
    jurisdiction: jurisdictionId,
    election_date: { $gte: fromDate }
  })
    .populate('office')
    .populate('candidates.person', 'firstName lastName email avatar')
    .sort({ election_date: 1 });
}

/**
 * Get election results for an office
 * @param {string} officeId - The office ID
 * @param {Date} fromDate - Start date (optional)
 * @returns {Promise<Array>} Array of election results
 */
async function getElectionResults(officeId, fromDate = null) {
  const query = { office: officeId };
  if (fromDate) {
    query.election_date = { $gte: fromDate };
  }
  
  return await Election.find(query)
    .populate('candidates.person', 'firstName lastName email avatar')
    .sort({ election_date: -1 });
}

// ------------------------------
// Legislation Utilities
// ------------------------------

/**
 * Get recent legislation for a jurisdiction
 * @param {string} jurisdictionId - The jurisdiction ID
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} Array of recent legislation
 */
async function getRecentLegislation(jurisdictionId, limit = 10) {
  return await Legislation.find({ jurisdiction: jurisdictionId })
    .populate('governing_body')
    .populate('sponsors', 'firstName lastName email avatar')
    .populate('cosponsors', 'firstName lastName email avatar')
    .sort({ introduced_date: -1 })
    .limit(limit);
}

/**
 * Get legislation by status
 * @param {string} jurisdictionId - The jurisdiction ID
 * @param {string} status - The legislation status
 * @returns {Promise<Array>} Array of legislation
 */
async function getLegislationByStatus(jurisdictionId, status) {
  return await Legislation.find({ 
    jurisdiction: jurisdictionId, 
    status 
  })
    .populate('governing_body')
    .populate('sponsors', 'firstName lastName email avatar')
    .sort({ introduced_date: -1 });
}

// ------------------------------
// Vote Utilities
// ------------------------------

/**
 * Get voting record for a person
 * @param {string} personId - The person's User ID
 * @param {Date} fromDate - Start date (optional)
 * @returns {Promise<Array>} Array of votes
 */
async function getVotingRecord(personId, fromDate = null) {
  const query = { person: personId };
  if (fromDate) {
    query.vote_date = { $gte: fromDate };
  }
  
  return await GovernmentVote.find(query)
    .populate('legislation')
    .populate('governing_body')
    .sort({ vote_date: -1 });
}

/**
 * Get vote breakdown for legislation
 * @param {string} legislationId - The legislation ID
 * @returns {Promise<Object>} Vote breakdown
 */
async function getVoteBreakdown(legislationId) {
  const votes = await GovernmentVote.find({ legislation: legislationId })
    .populate('person', 'firstName lastName email avatar');
  
  const breakdown = {
    yes: [],
    no: [],
    abstain: [],
    absent: [],
    present: []
  };
  
  votes.forEach(vote => {
    breakdown[vote.vote_position].push(vote.person);
  });
  
  return {
    total: votes.length,
    breakdown,
    percentages: {
      yes: (breakdown.yes.length / votes.length) * 100,
      no: (breakdown.no.length / votes.length) * 100,
      abstain: (breakdown.abstain.length / votes.length) * 100,
      absent: (breakdown.absent.length / votes.length) * 100,
      present: (breakdown.present.length / votes.length) * 100
    }
  };
}

// ------------------------------
// Committee Utilities
// ------------------------------

/**
 * Get committees for a governing body
 * @param {string} governingBodyId - The governing body ID
 * @returns {Promise<Array>} Array of committees
 */
async function getCommittees(governingBodyId) {
  return await Committee.find({ governing_body: governingBodyId })
    .populate('chair', 'firstName lastName email avatar')
    .populate('vice_chair', 'firstName lastName email avatar')
    .populate('members', 'firstName lastName email avatar')
    .sort({ name: 1 });
}

/**
 * Get committee memberships for a person
 * @param {string} personId - The person's User ID
 * @returns {Promise<Array>} Array of committee memberships
 */
async function getCommitteeMemberships(personId) {
  return await Committee.find({
    $or: [
      { chair: personId },
      { vice_chair: personId },
      { members: personId }
    ]
  })
    .populate('governing_body')
    .populate('jurisdiction')
    .sort({ name: 1 });
}

// ------------------------------
// District Utilities
// ------------------------------

/**
 * Get districts for a jurisdiction
 * @param {string} jurisdictionId - The jurisdiction ID
 * @param {string} districtType - Optional district type filter
 * @returns {Promise<Array>} Array of districts
 */
async function getDistricts(jurisdictionId, districtType = null) {
  const query = { jurisdiction: jurisdictionId };
  if (districtType) query.district_type = districtType;
  
  return await District.find(query).sort({ district_type: 1, district_number: 1 });
}

// ------------------------------
// Contact Information Utilities
// ------------------------------

/**
 * Get contact information for an entity
 * @param {string} entityType - The entity type
 * @param {string} entityId - The entity ID
 * @returns {Promise<Object>} Contact information
 */
async function getContactInfo(entityType, entityId) {
  return await ContactInfo.findOne({ entity_type: entityType, entity_id: entityId });
}

/**
 * Create or update contact information
 * @param {string} entityType - The entity type
 * @param {string} entityId - The entity ID
 * @param {Object} contactData - The contact data
 * @returns {Promise<Object>} The contact information
 */
async function upsertContactInfo(entityType, entityId, contactData) {
  return await ContactInfo.findOneAndUpdate(
    { entity_type: entityType, entity_id: entityId },
    contactData,
    { upsert: true, new: true }
  );
}

// ------------------------------
// Search and Query Utilities
// ------------------------------

/**
 * Search government entities
 * @param {string} query - Search query
 * @param {Array} entityTypes - Array of entity types to search
 * @param {number} limit - Number of results to return
 * @returns {Promise<Object>} Search results
 */
async function searchGovernmentEntities(query, entityTypes = ['jurisdiction', 'governing_body', 'office'], limit = 20) {
  const results = {};
  
  if (entityTypes.includes('jurisdiction')) {
    results.jurisdictions = await Jurisdiction.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { slug: { $regex: query, $options: 'i' } }
      ]
    }).limit(limit);
  }
  
  if (entityTypes.includes('governing_body')) {
    results.governingBodies = await GoverningBody.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { slug: { $regex: query, $options: 'i' } }
      ]
    }).populate('jurisdiction').limit(limit);
  }
  
  if (entityTypes.includes('office')) {
    results.offices = await Office.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { slug: { $regex: query, $options: 'i' } }
      ]
    }).populate('governing_body').populate('jurisdiction').limit(limit);
  }
  
  return results;
}

// ------------------------------
// Validation Utilities
// ------------------------------

/**
 * Validate jurisdiction data
 * @param {Object} data - The jurisdiction data
 * @returns {Object} Validation result
 */
function validateJurisdictionData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }
  
  if (!CONSTANTS.LEVELS.includes(data.level)) {
    errors.push(`Level must be one of: ${CONSTANTS.LEVELS.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate governing body data
 * @param {Object} data - The governing body data
 * @returns {Object} Validation result
 */
function validateGoverningBodyData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }
  
  if (!data.jurisdiction) {
    errors.push('Jurisdiction is required');
  }
  
  if (!CONSTANTS.BRANCHES.includes(data.branch)) {
    errors.push(`Branch must be one of: ${CONSTANTS.BRANCHES.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ------------------------------
// Export all utilities
// ------------------------------
module.exports = {
  // Path management
  generatePath,
  calculateDepth,
  getAncestors,
  getDescendants,
  
  // Jurisdiction utilities
  createJurisdiction,
  getJurisdictionHierarchy,
  
  // Governing body utilities
  createGoverningBody,
  getGoverningBodies,
  
  // Office and position utilities
  getCurrentOfficeHolders,
  getPersonOfficeHistory,
  getPersonCurrentPositions,
  
  // Election utilities
  getUpcomingElections,
  getElectionResults,
  
  // Legislation utilities
  getRecentLegislation,
  getLegislationByStatus,
  
  // Vote utilities
  getVotingRecord,
  getVoteBreakdown,
  
  // Committee utilities
  getCommittees,
  getCommitteeMemberships,
  
  // District utilities
  getDistricts,
  
  // Contact information utilities
  getContactInfo,
  upsertContactInfo,
  
  // Search utilities
  searchGovernmentEntities,
  
  // Validation utilities
  validateJurisdictionData,
  validateGoverningBodyData,
  
  // Constants
  CONSTANTS
};
