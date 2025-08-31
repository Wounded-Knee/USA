# US Government Database System

## Overview

The US Government Database System is a comprehensive MongoDB-based data model that represents the entire structure of the United States government. It provides a normalized, hierarchical representation of jurisdictions, governing bodies, offices, positions, elections, legislation, and more.

## Architecture

### Core Design Principles

1. **Hierarchical Structure**: Uses materialized paths for fast navigation and adjacency lists for flexibility
2. **Normalized Design**: Separates concerns between jurisdictions, governing bodies, and offices
3. **Identifier Support**: Stores standard government identifiers (OCD, FIPS, GEOID)
4. **User Integration**: Leverages existing User model for person references
5. **Extensible**: Supports metadata fields for additional information

### Database Models

#### 1. Jurisdiction
Represents geographic or corporate governing areas (USA, states, counties, cities, districts).

**Key Fields:**
- `name`, `slug`, `level`, `entity_type`
- `parent` (adjacency list), `path` (materialized path), `depth`
- `identifiers` (OCD, FIPS, GEOID)
- `metadata` (extensible)

**Levels:** federal, state, territory, tribal, regional, county, municipal, special_district, school_district, judicial_district, precinct, ward

#### 2. Governing Body
Represents legislative bodies, executive branches, judicial systems, and other governing entities.

**Key Fields:**
- `name`, `slug`, `jurisdiction`, `branch`, `entity_type`
- `parent` (adjacency list), `path` (materialized path), `depth`
- `identifiers`, `metadata`

**Branches:** executive, legislative, judicial, independent, education, elections, administration, law_enforcement, oversight, military, other

#### 3. Office
Represents specific positions or roles within governing bodies.

**Key Fields:**
- `name`, `slug`, `office_type`, `governing_body`, `jurisdiction`
- `constituency`, `selection_method`, `term_length`, `term_limit`
- `salary`, `is_part_time`
- `identifiers`, `metadata`

**Office Types:** president, vice_president, governor, senator, representative, judge, mayor, etc.

#### 4. Position
Represents specific instances of offices with person assignments and terms.

**Key Fields:**
- `office`, `person` (references User model), `term_start`, `term_end`
- `is_current`, `party`, `campaign_funding`
- `identifiers`, `metadata`

#### 5. Election
Represents elections for offices with candidates and results.

**Key Fields:**
- `office`, `jurisdiction`, `election_date`, `election_type`
- `candidates` (array with person, party, votes, etc.)
- `total_votes_cast`, `voter_turnout`
- `identifiers`, `metadata`

#### 6. Legislation
Represents bills, resolutions, and other legislative actions.

**Key Fields:**
- `title`, `bill_number`, `governing_body`, `jurisdiction`
- `legislation_type`, `status`, `introduced_date`
- `sponsors`, `cosponsors` (references User model)
- `summary`, `full_text`
- `identifiers`, `metadata`

#### 7. Vote
Represents individual votes on legislation by governing body members.

**Key Fields:**
- `legislation`, `person` (references User model), `governing_body`
- `vote_date`, `vote_position` (yes, no, abstain, absent, present)
- `identifiers`, `metadata`

#### 8. Committee
Represents committees within governing bodies.

**Key Fields:**
- `name`, `slug`, `governing_body`, `jurisdiction`
- `committee_type`, `is_permanent`
- `chair`, `vice_chair`, `members` (references User model)
- `identifiers`, `metadata`

#### 9. District
Represents electoral districts, wards, and geographic divisions.

**Key Fields:**
- `name`, `slug`, `jurisdiction`, `district_type`, `district_number`
- `boundaries` (GeoJSON), `population`, `area_sq_miles`
- `identifiers`, `metadata`

#### 10. Contact Information
Represents contact details for government entities and officials.

**Key Fields:**
- `entity_type`, `entity_id` (polymorphic reference)
- `address`, `phone`, `fax`, `email`, `website`
- `social_media`, `office_hours`
- `identifiers`, `metadata`

## API Endpoints

### Base URL: `/api/government`

#### Jurisdictions
- `GET /jurisdictions` - List jurisdictions with filtering
- `GET /jurisdictions/:id` - Get jurisdiction with hierarchy
- `POST /jurisdictions` - Create new jurisdiction
- `PUT /jurisdictions/:id` - Update jurisdiction
- `DELETE /jurisdictions/:id` - Delete jurisdiction

#### Governing Bodies
- `GET /governing-bodies` - List governing bodies with filtering
- `GET /governing-bodies/:id` - Get governing body details
- `POST /governing-bodies` - Create new governing body
- `PUT /governing-bodies/:id` - Update governing body
- `DELETE /governing-bodies/:id` - Delete governing body

#### Offices
- `GET /offices` - List offices with filtering
- `GET /offices/:id` - Get office details
- `POST /offices` - Create new office
- `PUT /offices/:id` - Update office
- `DELETE /offices/:id` - Delete office

#### Positions
- `GET /positions` - List positions with filtering
- `GET /positions/current/:jurisdictionId` - Get current office holders
- `GET /positions/person/:personId` - Get person's office history
- `POST /positions` - Create new position
- `PUT /positions/:id` - Update position
- `DELETE /positions/:id` - Delete position

#### Elections
- `GET /elections` - List elections with filtering
- `GET /elections/upcoming/:jurisdictionId` - Get upcoming elections
- `GET /elections/results/:officeId` - Get election results
- `POST /elections` - Create new election
- `PUT /elections/:id` - Update election
- `DELETE /elections/:id` - Delete election

#### Legislation
- `GET /legislation` - List legislation with filtering
- `GET /legislation/recent/:jurisdictionId` - Get recent legislation
- `GET /legislation/status/:jurisdictionId/:status` - Get legislation by status
- `POST /legislation` - Create new legislation
- `PUT /legislation/:id` - Update legislation
- `DELETE /legislation/:id` - Delete legislation

#### Votes
- `GET /votes` - List votes with filtering
- `GET /votes/person/:personId` - Get voting record for person
- `GET /votes/breakdown/:legislationId` - Get vote breakdown
- `POST /votes` - Create new vote
- `PUT /votes/:id` - Update vote
- `DELETE /votes/:id` - Delete vote

#### Committees
- `GET /committees` - List committees with filtering
- `GET /committees/governing-body/:governingBodyId` - Get committees for governing body
- `GET /committees/person/:personId` - Get committee memberships for person
- `POST /committees` - Create new committee
- `PUT /committees/:id` - Update committee
- `DELETE /committees/:id` - Delete committee

#### Districts
- `GET /districts` - List districts with filtering
- `GET /districts/jurisdiction/:jurisdictionId` - Get districts for jurisdiction
- `POST /districts` - Create new district
- `PUT /districts/:id` - Update district
- `DELETE /districts/:id` - Delete district

#### Contact Information
- `GET /contact-info/:entityType/:entityId` - Get contact information
- `POST /contact-info/:entityType/:entityId` - Create/update contact information
- `DELETE /contact-info/:entityType/:entityId` - Delete contact information

#### Search & Utilities
- `GET /search` - Search government entities
- `GET /constants` - Get all constants
- `GET /constants/:constant` - Get specific constant

## Utility Functions

The system includes comprehensive utility functions in `server/utils/governmentUtils.js`:

### Path Management
- `generatePath()` - Generate materialized paths
- `calculateDepth()` - Calculate hierarchy depth
- `getAncestors()` - Get jurisdiction ancestors
- `getDescendants()` - Get jurisdiction descendants

### Data Creation
- `createJurisdiction()` - Create jurisdiction with proper path/depth
- `createGoverningBody()` - Create governing body with validation
- `getJurisdictionHierarchy()` - Get complete hierarchy tree

### Queries
- `getCurrentOfficeHolders()` - Get current office holders
- `getPersonOfficeHistory()` - Get person's office history
- `getUpcomingElections()` - Get upcoming elections
- `getRecentLegislation()` - Get recent legislation
- `getVotingRecord()` - Get person's voting record
- `getVoteBreakdown()` - Get vote breakdown for legislation
- `getCommittees()` - Get committees for governing body
- `getDistricts()` - Get districts for jurisdiction

### Contact & Search
- `getContactInfo()` - Get contact information
- `upsertContactInfo()` - Create/update contact information
- `searchGovernmentEntities()` - Search across entities

### Validation
- `validateJurisdictionData()` - Validate jurisdiction data
- `validateGoverningBodyData()` - Validate governing body data

## Data Seeding

The system includes a comprehensive seeding script (`server/utils/seedGovernment.js`) that creates:

### Initial Data
- **Jurisdictions**: USA, California, San Mateo County, San Francisco
- **Governing Bodies**: US Congress, US Senate, US House, CA Legislature, CA Senate, CA Assembly
- **Offices**: President, Vice President, Senators, Representatives, Governor, State Legislators
- **Districts**: Sample congressional, state senate, and assembly districts
- **Contact Information**: Addresses, phone numbers, websites, social media

### Running the Seeder
```bash
# Run the seeder directly
node server/utils/seedGovernment.js

# Or import and run programmatically
const { seedGovernmentData } = require('./server/utils/seedGovernment');
await seedGovernmentData();
```

## Integration with Existing System

### User Model Integration
- All person references use the existing `User` model
- No separate Person model needed
- Maintains consistency with existing authentication system

### API Integration
- Routes registered in `server/index.js`
- Follows existing API patterns and error handling
- Uses same middleware and authentication as other routes

### Database Integration
- Uses existing MongoDB connection
- Follows existing Mongoose patterns
- Compatible with existing database utilities

## Usage Examples

### Creating a New Jurisdiction
```javascript
const { createJurisdiction } = require('./utils/governmentUtils');

const newJurisdiction = await createJurisdiction({
  name: 'Los Angeles County',
  slug: 'los-angeles-county',
  level: 'county',
  parent: californiaId, // Parent jurisdiction ID
  identifiers: {
    ocd_id: 'ocd-division/country:us/state:ca/county:los_angeles',
    fips: '06037'
  }
});
```

### Getting Current Office Holders
```javascript
const { getCurrentOfficeHolders } = require('./utils/governmentUtils');

const officeHolders = await getCurrentOfficeHolders(californiaId, 'governor');
```

### Searching Government Entities
```javascript
const { searchGovernmentEntities } = require('./utils/governmentUtils');

const results = await searchGovernmentEntities('senate', ['governing_body', 'office']);
```

## Performance Considerations

### Indexing Strategy
- Materialized paths indexed for fast hierarchy queries
- Compound indexes on common query patterns
- Unique indexes on slugs and paths
- Sparse indexes on optional fields

### Query Optimization
- Uses population for related data
- Implements pagination on list endpoints
- Filters at database level
- Caches frequently accessed data

### Scalability
- Hierarchical structure supports unlimited depth
- Normalized design reduces data duplication
- Extensible metadata fields for future requirements
- Modular design allows for easy expansion

## Future Enhancements

### Planned Features
1. **Geographic Integration**: GeoJSON boundaries and spatial queries
2. **Temporal Data**: Historical tracking of changes over time
3. **Advanced Search**: Full-text search with relevance scoring
4. **Data Import**: Bulk import from government data sources
5. **API Rate Limiting**: Protect against abuse
6. **Caching Layer**: Redis integration for performance
7. **Webhooks**: Real-time notifications for data changes
8. **Audit Trail**: Track all data modifications

### Integration Opportunities
1. **Petition System**: Link petitions to specific jurisdictions/offices
2. **Voting System**: Integrate with existing vote tracking
3. **User Profiles**: Show government positions in user profiles
4. **Notification System**: Alert users about relevant government activity
5. **Analytics**: Track engagement with government data

## Security Considerations

### Data Validation
- Input validation on all endpoints
- Schema validation using Mongoose
- Sanitization of user inputs
- Protection against injection attacks

### Access Control
- Authentication required for write operations
- Role-based access control for sensitive data
- Audit logging for all modifications
- Rate limiting on public endpoints

### Data Privacy
- No sensitive personal information stored
- Public data only (government records)
- Compliance with open government laws
- Regular security audits

## Conclusion

The US Government Database System provides a comprehensive, scalable foundation for representing and querying government data. Its hierarchical design, extensive API, and integration with the existing system make it a powerful tool for government transparency and civic engagement applications.

The system is designed to be:
- **Comprehensive**: Covers all aspects of government structure
- **Flexible**: Extensible for future requirements
- **Performant**: Optimized for common query patterns
- **Maintainable**: Well-documented and modular design
- **Secure**: Built with security best practices
