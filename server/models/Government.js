/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

// ------------------------------
// 1) Shared constants
// ------------------------------
const LEVELS = [
  'federal', 'state', 'territory', 'tribal', 'regional',
  'county', 'municipal', 'special_district', 'school_district',
  'judicial_district', 'precinct', 'ward'
];

const BRANCHES = [
  'executive', 'legislative', 'judicial', 'independent',
  'education', 'elections', 'administration', 'law_enforcement',
  'oversight', 'military', 'other'
];

const ENTITY_TYPES = [
  'jurisdiction', 'body', 'agency', 'department', 'court', 'office',
  'board', 'commission', 'authority', 'corporation', 'committee', 'district'
];

const SELECTION_METHODS = ['elected', 'appointed', 'hybrid', 'career'];

const CONSTITUENCIES = [
  'at_large', 'district', 'ward', 'circuit', 'subcircuit', 'single_member_district'
];

const OFFICE_TYPES = [
  'president', 'vice_president', 'governor', 'lieutenant_governor', 'attorney_general',
  'secretary_of_state', 'controller', 'auditor', 'treasurer', 'mayor', 'city_manager',
  'city_attorney', 'clerk', 'recorder', 'assessor', 'sheriff', 'prosecutor', 'superintendent',
  'general_manager', 'senator', 'representative', 'judge', 'justice', 'commissioner', 'board_member',
  'other'
];

const MEDIA_TYPES = [
  'seal', 'flag', 'headshot', 'logo', 'building', 'document', 'signature', 'other'
];

// ------------------------------
// 2) Media model
// Represents media files associated with government entities
// ------------------------------
const MediaSchema = new Schema({
  filename: { type: String, required: true },
  original_name: { type: String, required: true },
  mime_type: { type: String, required: true },
  size: { type: Number, required: true }, // in bytes
  path: { type: String, required: true }, // file system path
  url: { type: String, required: true }, // public URL
  
  media_type: { type: String, enum: MEDIA_TYPES, required: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  alt_text: { type: String, trim: true },
  
  // Entity references
  jurisdiction: { type: Types.ObjectId, ref: 'Jurisdiction' },
  governing_body: { type: Types.ObjectId, ref: 'GoverningBody' },
  office: { type: Types.ObjectId, ref: 'Office' },
  position: { type: Types.ObjectId, ref: 'Position' },
  
  // Metadata
  width: { type: Number }, // for images
  height: { type: Number }, // for images
  duration: { type: Number }, // for videos/audio in seconds
  
  is_primary: { type: Boolean, default: false }, // primary media for entity
  is_public: { type: Boolean, default: true },
  
  uploaded_by: { type: Types.ObjectId, ref: 'User', required: true },
  
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

MediaSchema.index({ jurisdiction: 1, media_type: 1 });
MediaSchema.index({ governing_body: 1, media_type: 1 });
MediaSchema.index({ office: 1, media_type: 1 });
MediaSchema.index({ position: 1, media_type: 1 });
MediaSchema.index({ uploaded_by: 1 });
MediaSchema.index({ media_type: 1 });

// ------------------------------
// 3) Identifier model
// ------------------------------
const IdentifierSchema = new Schema({
  ocd_id: { type: String, index: true },
  fips: { type: String, index: true },
  geoid: { type: String, index: true },
  ansi: { type: String },
  usgm_id: { type: String },
  other: { type: Map, of: String }
}, { _id: false });

// ------------------------------
// 4) Jurisdiction model
// Represents a governed geographic or corporate area, such as USA, a state, a county, a city, a school district, or a special district.
// ------------------------------
const JurisdictionSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, match: /^[a-z0-9-]+$/ },
  level: { type: String, enum: LEVELS, required: true },
  entity_type: { type: String, enum: ENTITY_TYPES, required: true, default: 'jurisdiction' },

  parent: { type: Types.ObjectId, ref: 'Jurisdiction', default: null }, // adjacency list
  path: { type: String, required: true }, // materialized path like /usa/state/california/county/san-mateo
  depth: { type: Number, required: true, default: 0 },

  // Media references
  media: [{ type: Types.ObjectId, ref: 'Media' }],
  primary_media: { type: Types.ObjectId, ref: 'Media' }, // primary seal/flag

  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

JurisdictionSchema.index({ parent: 1, slug: 1 }, { unique: true });
JurisdictionSchema.index({ path: 1 }, { unique: true });
JurisdictionSchema.index({ level: 1 });

// ------------------------------
// 5) Governing Body model
// Represents a legislative body, executive branch, judicial system, or other governing entity within a jurisdiction.
// ------------------------------
const GoverningBodySchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, match: /^[a-z0-9-]+$/ },
  jurisdiction: { type: Types.ObjectId, ref: 'Jurisdiction', required: true },
  branch: { type: String, enum: BRANCHES, required: true },
  entity_type: { type: String, enum: ENTITY_TYPES, required: true, default: 'body' },

  parent: { type: Types.ObjectId, ref: 'GoverningBody', default: null },
  path: { type: String, required: true },
  depth: { type: Number, required: true, default: 0 },

  // Media references
  media: [{ type: Types.ObjectId, ref: 'Media' }],
  primary_media: { type: Types.ObjectId, ref: 'Media' }, // primary logo/seal

  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

GoverningBodySchema.index({ jurisdiction: 1, parent: 1, slug: 1 }, { unique: true });
GoverningBodySchema.index({ path: 1 }, { unique: true });
GoverningBodySchema.index({ branch: 1 });

// ------------------------------
// 6) District model
// Represents electoral districts, wards, and other geographic divisions.
// ------------------------------
const DistrictSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, match: /^[a-z0-9-]+$/ },
  jurisdiction: { type: Types.ObjectId, ref: 'Jurisdiction', required: true },
  
  district_type: { type: String, enum: ['congressional', 'state_senate', 'state_house', 'county', 'city_council', 'school_board', 'judicial'], required: true },
  district_number: { type: Number },
  
  boundaries: { type: String }, // GeoJSON or other boundary representation
  population: { type: Number },
  area_sq_miles: { type: Number },
  
  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

DistrictSchema.index({ jurisdiction: 1, district_type: 1, district_number: 1 }, { unique: true });
DistrictSchema.index({ district_type: 1 });

// ------------------------------
// 7) Office model
// Represents a specific position or role within a governing body, such as a senator, mayor, or judge.
// ------------------------------
const OfficeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, match: /^[a-z0-9-]+$/ },
  office_type: { type: String, enum: OFFICE_TYPES, required: true },
  
  // Relationship hierarchy - one must be specified
  governing_body: { type: Types.ObjectId, ref: 'GoverningBody' },
  jurisdiction: { type: Types.ObjectId, ref: 'Jurisdiction' },
  
  constituency: { type: String, enum: CONSTITUENCIES, default: 'at_large' },
  district: { type: Types.ObjectId, ref: 'District' }, // Reference to specific district
  
  selection_method: { type: String, enum: SELECTION_METHODS, required: true },
  term_length: { type: Number }, // in months
  term_limit: { type: Number }, // maximum terms
  salary: { type: Number },
  is_part_time: { type: Boolean, default: false },

  // Media references
  media: [{ type: Types.ObjectId, ref: 'Media' }],
  primary_media: { type: Types.ObjectId, ref: 'Media' }, // primary logo/seal

  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

// Custom validation for office relationships
OfficeSchema.pre('validate', function(next) {
  if (!this.governing_body && !this.jurisdiction) {
    return next(new Error('Office must belong to either a governing body or jurisdiction'));
  }
  if (this.governing_body && this.jurisdiction) {
    return next(new Error('Office cannot belong to both governing body and jurisdiction'));
  }
  next();
});

OfficeSchema.index({ governing_body: 1, slug: 1 }, { unique: true, sparse: true });
OfficeSchema.index({ jurisdiction: 1, slug: 1 }, { unique: true, sparse: true });
OfficeSchema.index({ jurisdiction: 1, office_type: 1 });
OfficeSchema.index({ constituency: 1 });
OfficeSchema.index({ district: 1 });

// ------------------------------
// 8) Position model
// Represents a specific instance of an office, including the person holding it and their term.
// ------------------------------
const PositionSchema = new Schema({
  office: { type: Types.ObjectId, ref: 'Office', required: true },
  person: { type: Types.ObjectId, ref: 'User', required: true }, // Using existing User model
  
  // Reference to the election that created this position
  election: { type: Types.ObjectId, ref: 'Election' },
  
  term_start: { type: Date, required: true },
  term_end: { type: Date },
  is_current: { type: Boolean, default: true },
  
  party: { type: String, trim: true },
  campaign_funding: { type: Number },
  
  // Position status
  status: { type: String, enum: ['active', 'inactive', 'resigned', 'removed'], default: 'active' },
  
  // Media references
  media: [{ type: Types.ObjectId, ref: 'Media' }],
  primary_media: { type: Types.ObjectId, ref: 'Media' }, // primary headshot

  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

// Validation: Term dates
PositionSchema.pre('validate', function(next) {
  if (this.term_end && this.term_end <= this.term_start) {
    return next(new Error('Term end date must be after term start date'));
  }
  next();
});

PositionSchema.index({ office: 1, person: 1, term_start: 1 }, { unique: true });
PositionSchema.index({ person: 1, is_current: 1 });
PositionSchema.index({ term_start: 1, term_end: 1 });
PositionSchema.index({ election: 1 });

// ------------------------------
// 9) Election model
// Represents elections for offices, including candidates and results.
// ------------------------------
const ElectionSchema = new Schema({
  office: { type: Types.ObjectId, ref: 'Office', required: true },
  jurisdiction: { type: Types.ObjectId, ref: 'Jurisdiction', required: true },
  district: { type: Types.ObjectId, ref: 'District' }, // Specific district for district-based elections
  
  election_date: { type: Date, required: true },
  election_type: { type: String, enum: ['primary', 'general', 'special', 'runoff'], required: true },
  is_partisan: { type: Boolean, default: true },
  
  // Election status
  status: { type: String, enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'scheduled' },
  
  candidates: [{
    person: { type: Types.ObjectId, ref: 'User', required: true },
    party: { type: String, trim: true },
    is_incumbent: { type: Boolean, default: false },
    votes_received: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    is_winner: { type: Boolean, default: false }
  }],
  
  total_votes_cast: { type: Number, default: 0 },
  voter_turnout: { type: Number, default: 0 }, // percentage
  
  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

// Validation: Election date should be in the past for completed elections
ElectionSchema.pre('validate', function(next) {
  if (this.status === 'completed' && this.election_date > new Date()) {
    return next(new Error('Completed elections cannot have future dates'));
  }
  next();
});

ElectionSchema.index({ office: 1, election_date: 1 }, { unique: true });
ElectionSchema.index({ jurisdiction: 1, election_date: 1 });
ElectionSchema.index({ election_type: 1 });
ElectionSchema.index({ district: 1 });

// ------------------------------
// 10) Legislation model
// Represents bills, resolutions, and other legislative actions.
// ------------------------------
const LegislationSchema = new Schema({
  title: { type: String, required: true, trim: true },
  bill_number: { type: String, required: true, trim: true },
  governing_body: { type: Types.ObjectId, ref: 'GoverningBody', required: true },
  jurisdiction: { type: Types.ObjectId, ref: 'Jurisdiction', required: true },
  
  // Committee assignments
  committees: [{
    committee: { type: Types.ObjectId, ref: 'Committee', required: true },
    assignment_date: { type: Date, default: Date.now },
    status: { type: String, enum: ['assigned', 'reported', 'tabled'], default: 'assigned' }
  }],
  
  legislation_type: { type: String, enum: ['bill', 'resolution', 'amendment', 'proclamation', 'executive_order'], required: true },
  status: { type: String, enum: ['introduced', 'in_committee', 'passed_chamber', 'passed_both', 'signed', 'vetoed', 'failed', 'withdrawn'], required: true },
  
  introduced_date: { type: Date, required: true },
  passed_date: { type: Date },
  effective_date: { type: Date },
  
  sponsors: [{ type: Types.ObjectId, ref: 'User' }], // Using existing User model
  cosponsors: [{ type: Types.ObjectId, ref: 'User' }],
  
  summary: { type: String },
  full_text: { type: String },
  
  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

LegislationSchema.index({ governing_body: 1, bill_number: 1 }, { unique: true });
LegislationSchema.index({ jurisdiction: 1, legislation_type: 1 });
LegislationSchema.index({ status: 1, introduced_date: 1 });

// ------------------------------
// 11) GovernmentVote model
// Represents individual votes on legislation by governing body members.
// ------------------------------
const GovernmentVoteSchema = new Schema({
  legislation: { type: Types.ObjectId, ref: 'Legislation', required: true },
  person: { type: Types.ObjectId, ref: 'User', required: true }, // Using existing User model
  position: { type: Types.ObjectId, ref: 'Position', required: true }, // Reference to position
  governing_body: { type: Types.ObjectId, ref: 'GoverningBody', required: true },
  
  vote_date: { type: Date, required: true },
  vote_position: { type: String, enum: ['yes', 'no', 'abstain', 'absent', 'present'], required: true },
  
  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

GovernmentVoteSchema.index({ legislation: 1, person: 1 }, { unique: true });
GovernmentVoteSchema.index({ person: 1, vote_date: 1 });
GovernmentVoteSchema.index({ vote_position: 1 });
GovernmentVoteSchema.index({ position: 1 });

// ------------------------------
// 12) Committee model
// Represents committees within governing bodies.
// ------------------------------
const CommitteeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, match: /^[a-z0-9-]+$/ },
  governing_body: { type: Types.ObjectId, ref: 'GoverningBody', required: true },
  jurisdiction: { type: Types.ObjectId, ref: 'Jurisdiction', required: true },
  
  committee_type: { type: String, enum: ['standing', 'select', 'joint', 'conference', 'subcommittee'], required: true },
  is_permanent: { type: Boolean, default: true },
  
  chair: { type: Types.ObjectId, ref: 'User' }, // Using existing User model
  vice_chair: { type: Types.ObjectId, ref: 'User' },
  members: [{ type: Types.ObjectId, ref: 'User' }],
  
  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

CommitteeSchema.index({ governing_body: 1, slug: 1 }, { unique: true });
CommitteeSchema.index({ jurisdiction: 1, committee_type: 1 });
CommitteeSchema.index({ chair: 1 });

// ------------------------------
// 13) Contact Information model
// Represents contact details for government entities and officials.
// ------------------------------
const ContactInfoSchema = new Schema({
  entity_type: { type: String, enum: ['jurisdiction', 'governing_body', 'office', 'person'], required: true },
  entity_id: { type: Types.ObjectId, required: true },
  
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true, default: 'USA' }
  },
  
  phone: { type: String, trim: true },
  fax: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  website: { type: String, trim: true },
  
  social_media: {
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true }
  },
  
  office_hours: { type: String, trim: true },
  
  identifiers: { type: IdentifierSchema, default: {} },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });

ContactInfoSchema.index({ entity_type: 1, entity_id: 1 }, { unique: true });
ContactInfoSchema.index({ email: 1 });

// ------------------------------
// Export all models
// ------------------------------
module.exports = {
  Media: mongoose.model('Media', MediaSchema),
  Jurisdiction: mongoose.model('Jurisdiction', JurisdictionSchema),
  GoverningBody: mongoose.model('GoverningBody', GoverningBodySchema),
  District: mongoose.model('District', DistrictSchema),
  Office: mongoose.model('Office', OfficeSchema),
  Position: mongoose.model('Position', PositionSchema),
  Election: mongoose.model('Election', ElectionSchema),
  Legislation: mongoose.model('Legislation', LegislationSchema),
  GovernmentVote: mongoose.model('GovernmentVote', GovernmentVoteSchema),
  Committee: mongoose.model('Committee', CommitteeSchema),
  ContactInfo: mongoose.model('ContactInfo', ContactInfoSchema),
  
  // Constants for use in other parts of the application
  CONSTANTS: {
    LEVELS,
    BRANCHES,
    ENTITY_TYPES,
    SELECTION_METHODS,
    CONSTITUENCIES,
    OFFICE_TYPES,
    MEDIA_TYPES
  }
};
