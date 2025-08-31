const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');

const { 
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

const {
  createJurisdiction,
  getJurisdictionHierarchy,
  createGoverningBody,
  getGoverningBodies,
  getCurrentOfficeHolders,
  getPersonOfficeHistory,
  getPersonCurrentPositions,
  getUpcomingElections,
  getElectionResults,
  getRecentLegislation,
  getLegislationByStatus,
  getVotingRecord,
  getVoteBreakdown,
  getCommittees,
  getCommitteeMemberships,
  getDistricts,
  getContactInfo,
  upsertContactInfo,
  searchGovernmentEntities,
  validateJurisdictionData,
  validateGoverningBodyData
} = require('../utils/governmentUtils');

// ------------------------------
// Jurisdiction Routes
// ------------------------------

// Get all jurisdictions
router.get('/jurisdictions', async (req, res) => {
  try {
    const { level, parent, limit = 50, skip = 0 } = req.query;
    const query = {};
    
    if (level) query.level = level;
    if (parent) query.parent = parent;
    
    const jurisdictions = await Jurisdiction.find(query)
      .populate('parent', 'name slug')
      .sort({ depth: 1, name: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Jurisdiction.countDocuments(query);
    
    res.json({
      jurisdictions,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get jurisdiction by ID
router.get('/jurisdictions/:id', async (req, res) => {
  try {
    const jurisdiction = await Jurisdiction.findById(req.params.id)
      .populate('parent', 'name slug path');
    
    if (!jurisdiction) {
      return res.status(404).json({ error: 'Jurisdiction not found' });
    }
    
    const hierarchy = await getJurisdictionHierarchy(req.params.id);
    
    res.json({
      jurisdiction,
      hierarchy
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new jurisdiction
router.post('/jurisdictions', async (req, res) => {
  try {
    const validation = validateJurisdictionData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    const jurisdiction = await createJurisdiction(req.body);
    res.status(201).json(jurisdiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update jurisdiction
router.put('/jurisdictions/:id', async (req, res) => {
  try {
    const jurisdiction = await Jurisdiction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!jurisdiction) {
      return res.status(404).json({ error: 'Jurisdiction not found' });
    }
    
    res.json(jurisdiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete jurisdiction
router.delete('/jurisdictions/:id', async (req, res) => {
  try {
    const jurisdiction = await Jurisdiction.findByIdAndDelete(req.params.id);
    
    if (!jurisdiction) {
      return res.status(404).json({ error: 'Jurisdiction not found' });
    }
    
    res.json({ message: 'Jurisdiction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Governing Body Routes
// ------------------------------

// Get governing bodies
router.get('/governing-bodies', async (req, res) => {
  try {
    const { jurisdiction, branch, limit = 50, skip = 0 } = req.query;
    const query = {};
    
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (branch) query.branch = branch;
    
    const governingBodies = await GoverningBody.find(query)
      .populate('jurisdiction', 'name slug')
      .populate('parent', 'name slug')
      .sort({ depth: 1, name: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await GoverningBody.countDocuments(query);
    
    res.json({
      governingBodies,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get governing body by ID
router.get('/governing-bodies/:id', async (req, res) => {
  try {
    const governingBody = await GoverningBody.findById(req.params.id)
      .populate('jurisdiction', 'name slug')
      .populate('parent', 'name slug');
    
    if (!governingBody) {
      return res.status(404).json({ error: 'Governing body not found' });
    }
    
    res.json(governingBody);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create governing body
router.post('/governing-bodies', async (req, res) => {
  try {
    const validation = validateGoverningBodyData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    const governingBody = await createGoverningBody(req.body);
    res.status(201).json(governingBody);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update governing body
router.put('/governing-bodies/:id', async (req, res) => {
  try {
    const governingBody = await GoverningBody.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!governingBody) {
      return res.status(404).json({ error: 'Governing body not found' });
    }
    
    res.json(governingBody);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete governing body
router.delete('/governing-bodies/:id', async (req, res) => {
  try {
    const governingBody = await GoverningBody.findByIdAndDelete(req.params.id);
    
    if (!governingBody) {
      return res.status(404).json({ error: 'Governing body not found' });
    }
    
    res.json({ message: 'Governing body deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Office Routes
// ------------------------------

// Get offices
router.get('/offices', async (req, res) => {
  try {
    const { jurisdiction, governing_body, office_type, limit = 50, skip = 0 } = req.query;
    const query = {};
    
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (governing_body) query.governing_body = governing_body;
    if (office_type) query.office_type = office_type;
    
    const offices = await Office.find(query)
      .populate('jurisdiction', 'name slug')
      .populate('governing_body', 'name slug')
      .sort({ office_type: 1, name: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Office.countDocuments(query);
    
    res.json({
      offices,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get office by ID
router.get('/offices/:id', async (req, res) => {
  try {
    const office = await Office.findById(req.params.id)
      .populate('jurisdiction', 'name slug')
      .populate('governing_body', 'name slug');
    
    if (!office) {
      return res.status(404).json({ error: 'Office not found' });
    }
    
    res.json(office);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create office
router.post('/offices', async (req, res) => {
  try {
    const office = new Office(req.body);
    await office.save();
    res.status(201).json(office);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update office
router.put('/offices/:id', async (req, res) => {
  try {
    const office = await Office.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!office) {
      return res.status(404).json({ error: 'Office not found' });
    }
    
    res.json(office);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete office
router.delete('/offices/:id', async (req, res) => {
  try {
    const office = await Office.findByIdAndDelete(req.params.id);
    
    if (!office) {
      return res.status(404).json({ error: 'Office not found' });
    }
    
    res.json({ message: 'Office deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Position Routes
// ------------------------------

// Get positions
router.get('/positions', async (req, res) => {
  try {
    const { office, person, is_current, limit = 50, skip = 0 } = req.query;
    const query = {};
    
    if (office) query.office = office;
    if (person) query.person = person;
    if (is_current !== undefined) query.is_current = is_current === 'true';
    
    const positions = await Position.find(query)
      .populate('office')
      .populate('person', 'firstName lastName email avatar')
      .sort({ term_start: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Position.countDocuments(query);
    
    res.json({
      positions,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current office holders for jurisdiction
router.get('/positions/current/:jurisdictionId', async (req, res) => {
  try {
    const { office_type } = req.query;
    const positions = await getCurrentOfficeHolders(req.params.jurisdictionId, office_type);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get person's office history
router.get('/positions/person/:personId', async (req, res) => {
  try {
    const positions = await getPersonOfficeHistory(req.params.personId);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create position
router.post('/positions', async (req, res) => {
  try {
    const position = new Position(req.body);
    await position.save();
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update position
router.put('/positions/:id', async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete position
router.delete('/positions/:id', async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Election Routes
// ------------------------------

// Get elections
router.get('/elections', async (req, res) => {
  try {
    const { office, jurisdiction, election_type, limit = 50, skip = 0 } = req.query;
    const query = {};
    
    if (office) query.office = office;
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (election_type) query.election_type = election_type;
    
    const elections = await Election.find(query)
      .populate('office')
      .populate('jurisdiction', 'name slug')
      .populate('candidates.person', 'firstName lastName email avatar')
      .sort({ election_date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Election.countDocuments(query);
    
    res.json({
      elections,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming elections
router.get('/elections/upcoming/:jurisdictionId', async (req, res) => {
  try {
    const { from_date } = req.query;
    const fromDate = from_date ? new Date(from_date) : new Date();
    const elections = await getUpcomingElections(req.params.jurisdictionId, fromDate);
    res.json(elections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get election results for office
router.get('/elections/results/:officeId', async (req, res) => {
  try {
    const { from_date } = req.query;
    const fromDate = from_date ? new Date(from_date) : null;
    const results = await getElectionResults(req.params.officeId, fromDate);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create election
router.post('/elections', async (req, res) => {
  try {
    const election = new Election(req.body);
    await election.save();
    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update election
router.put('/elections/:id', async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    res.json(election);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete election
router.delete('/elections/:id', async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Legislation Routes
// ------------------------------

// Get legislation
router.get('/legislation', async (req, res) => {
  try {
    const { jurisdiction, governing_body, status, legislation_type, limit = 50, skip = 0 } = req.query;
    const query = {};
    
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (governing_body) query.governing_body = governing_body;
    if (status) query.status = status;
    if (legislation_type) query.legislation_type = legislation_type;
    
    const legislation = await Legislation.find(query)
      .populate('jurisdiction', 'name slug')
      .populate('governing_body', 'name slug')
      .populate('sponsors', 'firstName lastName email avatar')
      .populate('cosponsors', 'firstName lastName email avatar')
      .sort({ introduced_date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Legislation.countDocuments(query);
    
    res.json({
      legislation,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent legislation
router.get('/legislation/recent/:jurisdictionId', async (req, res) => {
  try {
    const { limit } = req.query;
    const legislation = await getRecentLegislation(req.params.jurisdictionId, parseInt(limit) || 10);
    res.json(legislation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get legislation by status
router.get('/legislation/status/:jurisdictionId/:status', async (req, res) => {
  try {
    const legislation = await getLegislationByStatus(req.params.jurisdictionId, req.params.status);
    res.json(legislation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create legislation
router.post('/legislation', async (req, res) => {
  try {
    const legislation = new Legislation(req.body);
    await legislation.save();
    res.status(201).json(legislation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update legislation
router.put('/legislation/:id', async (req, res) => {
  try {
    const legislation = await Legislation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!legislation) {
      return res.status(404).json({ error: 'Legislation not found' });
    }
    
    res.json(legislation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete legislation
router.delete('/legislation/:id', async (req, res) => {
  try {
    const legislation = await Legislation.findByIdAndDelete(req.params.id);
    
    if (!legislation) {
      return res.status(404).json({ error: 'Legislation not found' });
    }
    
    res.json({ message: 'Legislation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Vote Routes
// ------------------------------

// Get votes
router.get('/votes', async (req, res) => {
  try {
    const { legislation, person, governing_body, vote_position, limit = 50, skip = 0 } = req.query;
    const query = {};
    
    if (legislation) query.legislation = legislation;
    if (person) query.person = person;
    if (governing_body) query.governing_body = governing_body;
    if (vote_position) query.vote_position = vote_position;
    
    const votes = await GovernmentVote.find(query)
      .populate('legislation', 'title bill_number')
      .populate('person', 'firstName lastName email avatar')
      .populate('governing_body', 'name slug')
      .sort({ vote_date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await GovernmentVote.countDocuments(query);
    
    res.json({
      votes,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get voting record for person
router.get('/votes/person/:personId', async (req, res) => {
  try {
    const { from_date } = req.query;
    const fromDate = from_date ? new Date(from_date) : null;
    const votes = await getVotingRecord(req.params.personId, fromDate);
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vote breakdown for legislation
router.get('/votes/breakdown/:legislationId', async (req, res) => {
  try {
    const breakdown = await getVoteBreakdown(req.params.legislationId);
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create vote
router.post('/votes', async (req, res) => {
  try {
    const vote = new GovernmentVote(req.body);
    await vote.save();
    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update vote
router.put('/votes/:id', async (req, res) => {
  try {
    const vote = await GovernmentVote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }
    
    res.json(vote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete vote
router.delete('/votes/:id', async (req, res) => {
  try {
    const vote = await GovernmentVote.findByIdAndDelete(req.params.id);
    
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }
    
    res.json({ message: 'Vote deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Committee Routes
// ------------------------------

// Get committees
router.get('/committees', async (req, res) => {
  try {
    const { governing_body, jurisdiction, committee_type, limit = 50, skip = 0 } = req.query;
    const query = {};
    
    if (governing_body) query.governing_body = governing_body;
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (committee_type) query.committee_type = committee_type;
    
    const committees = await Committee.find(query)
      .populate('governing_body', 'name slug')
      .populate('jurisdiction', 'name slug')
      .populate('chair', 'firstName lastName email avatar')
      .populate('vice_chair', 'firstName lastName email avatar')
      .populate('members', 'firstName lastName email avatar')
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Committee.countDocuments(query);
    
    res.json({
      committees,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get committees for governing body
router.get('/committees/governing-body/:governingBodyId', async (req, res) => {
  try {
    const committees = await getCommittees(req.params.governingBodyId);
    res.json(committees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get committee memberships for person
router.get('/committees/person/:personId', async (req, res) => {
  try {
    const memberships = await getCommitteeMemberships(req.params.personId);
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create committee
router.post('/committees', async (req, res) => {
  try {
    const committee = new Committee(req.body);
    await committee.save();
    res.status(201).json(committee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update committee
router.put('/committees/:id', async (req, res) => {
  try {
    const committee = await Committee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!committee) {
      return res.status(404).json({ error: 'Committee not found' });
    }
    
    res.json(committee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete committee
router.delete('/committees/:id', async (req, res) => {
  try {
    const committee = await Committee.findByIdAndDelete(req.params.id);
    
    if (!committee) {
      return res.status(404).json({ error: 'Committee not found' });
    }
    
    res.json({ message: 'Committee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// District Routes
// ------------------------------

// Get districts
router.get('/districts', async (req, res) => {
  try {
    const { jurisdiction, district_type, limit = 50, skip = 0 } = req.query;
    const query = {};
    
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (district_type) query.district_type = district_type;
    
    const districts = await District.find(query)
      .populate('jurisdiction', 'name slug')
      .sort({ district_type: 1, district_number: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await District.countDocuments(query);
    
    res.json({
      districts,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get districts for jurisdiction
router.get('/districts/jurisdiction/:jurisdictionId', async (req, res) => {
  try {
    const { district_type } = req.query;
    const districts = await getDistricts(req.params.jurisdictionId, district_type);
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create district
router.post('/districts', async (req, res) => {
  try {
    const district = new District(req.body);
    await district.save();
    res.status(201).json(district);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update district
router.put('/districts/:id', async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }
    
    res.json(district);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete district
router.delete('/districts/:id', async (req, res) => {
  try {
    const district = await District.findByIdAndDelete(req.params.id);
    
    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }
    
    res.json({ message: 'District deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Contact Information Routes
// ------------------------------

// Get contact information
router.get('/contact-info/:entityType/:entityId', async (req, res) => {
  try {
    const contactInfo = await getContactInfo(req.params.entityType, req.params.entityId);
    
    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact information not found' });
    }
    
    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update contact information
router.post('/contact-info/:entityType/:entityId', async (req, res) => {
  try {
    const contactInfo = await upsertContactInfo(req.params.entityType, req.params.entityId, req.body);
    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete contact information
router.delete('/contact-info/:entityType/:entityId', async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOneAndDelete({
      entity_type: req.params.entityType,
      entity_id: req.params.entityId
    });
    
    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact information not found' });
    }
    
    res.json({ message: 'Contact information deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Search Routes
// ------------------------------

// Search government entities
router.get('/search', async (req, res) => {
  try {
    const { q, entity_types, limit } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const entityTypes = entity_types ? entity_types.split(',') : ['jurisdiction', 'governing_body', 'office'];
    const searchLimit = parseInt(limit) || 20;
    
    const results = await searchGovernmentEntities(q, entityTypes, searchLimit);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Constants Routes
// ------------------------------

// Get all constants
router.get('/constants', async (req, res) => {
  try {
    res.json(CONSTANTS);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific constant
router.get('/constants/:constant', async (req, res) => {
  try {
    const constant = req.params.constant.toUpperCase();
    
    if (!CONSTANTS[constant]) {
      return res.status(404).json({ error: 'Constant not found' });
    }
    
    res.json({ [constant]: CONSTANTS[constant] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
