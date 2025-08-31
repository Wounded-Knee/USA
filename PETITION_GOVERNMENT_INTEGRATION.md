# Petition-Government Entity Integration

This document outlines the changes made to link petitions to government entities, making them more actionable and relevant to actual government decision-making processes.

## Overview

Petitions are now bound to specific government entities, allowing users to:
- Target petitions to specific jurisdictions (federal, state, local)
- Connect petitions to governing bodies that can take action
- Link petitions to relevant legislation
- Filter and organize petitions by government context

## Database Changes

### Petition Model Updates (`server/models/Petition.js`)

Added new fields to the Petition schema:
- `jurisdiction` (required): Reference to a government jurisdiction
- `governingBody` (optional): Reference to a specific governing body
- `legislation` (optional): Reference to related legislation

New indexes added for efficient querying:
- `jurisdiction` + `isActive`
- `governingBody` + `isActive`
- `legislation` + `isActive`
- `jurisdiction` + `category`

### Government Entity Models

The system uses existing government entity models from `server/models/Government.js`:
- **Jurisdiction**: Geographic or corporate areas (USA, states, counties, cities)
- **GoverningBody**: Legislative bodies, executive branches, judicial systems
- **Legislation**: Bills, resolutions, and other legislative actions

## API Changes

### New Endpoints

#### Get Available Jurisdictions
```
GET /api/petitions/jurisdictions
Query params: level, parent
```

#### Get Governing Bodies for Jurisdiction
```
GET /api/petitions/governing-bodies?jurisdiction={jurisdictionId}
```

#### Get Legislation for Governing Body
```
GET /api/petitions/legislation?governingBody={governingBodyId}&status={status}
```

### Updated Endpoints

#### Get Petitions (Enhanced Filtering)
```
GET /api/petitions
New query params: jurisdiction, governingBody, legislation
```

#### Create Petition (Enhanced)
```
POST /api/petitions
New body fields: jurisdiction, governingBody, legislation
```

#### Update Petition (Enhanced)
```
PUT /api/petitions/:id
New body fields: jurisdiction, governingBody, legislation
```

## Frontend Changes

### New Components

#### CreatePetitionForm (`src/app/components/CreatePetitionForm.tsx`)
- Enhanced petition creation form with government entity selection
- Cascading dropdowns: Jurisdiction → Governing Body → Legislation
- Validation for required government entity fields

#### Create Petition Page (`src/app/petitions/create/page.tsx`)
- Dedicated page for petition creation
- Success state with next steps guidance
- Helpful tips for creating effective petitions

### Updated Components

#### Petitions List (`src/app/petitions/page.tsx`)
- Added jurisdiction filtering
- Display government entity information on petition cards
- Color-coded jurisdiction levels

#### Petition Detail (`src/app/petitions/[id]/page.tsx`)
- Government context section showing jurisdiction, governing body, and legislation
- Enhanced visual hierarchy with government entity badges

## Migration and Setup

### Database Migration

#### Migration Script (`server/utils/migratePetitionsToGovernment.js`)
- Links existing petitions to federal jurisdiction
- Creates default federal jurisdiction if needed
- Verifies migration success

#### Government Entity Initialization (`server/utils/initializeGovernmentEntities.js`)
- Creates basic government structure (federal, states, governing bodies)
- Adds sample legislation for testing
- Can be run independently to set up government entities

### Running Migrations

1. **Initialize Government Entities** (run first):
   ```bash
   node server/utils/initializeGovernmentEntities.js
   ```

2. **Migrate Existing Petitions** (run after government entities exist):
   ```bash
   node server/utils/migratePetitionsToGovernment.js
   ```

## Usage Examples

### Creating a Federal Petition
1. Select "United States of America" as jurisdiction
2. Optionally select "United States Congress" as governing body
3. Optionally link to specific legislation like "H.R. 9 - Climate Action Now Act"

### Creating a State Petition
1. Select "California" as jurisdiction
2. Optionally select "California State Legislature" as governing body
3. Target state-specific issues and policies

### Filtering Petitions
- Filter by jurisdiction level (federal, state, local)
- Filter by specific governing body
- Filter by related legislation

## Benefits

1. **Actionability**: Petitions are now connected to entities that can take action
2. **Relevance**: Users can target specific government levels and bodies
3. **Organization**: Petitions can be filtered and organized by government context
4. **Transparency**: Clear indication of which government entity is responsible
5. **Legislation Tracking**: Ability to link petitions to specific bills and laws

## Future Enhancements

1. **Geographic Targeting**: Filter petitions by user's location
2. **Representative Mapping**: Connect petitions to specific elected officials
3. **Legislative Tracking**: Track petition progress through legislative process
4. **Notification System**: Alert users when related legislation is updated
5. **Impact Metrics**: Measure petition effectiveness by government response

## Technical Notes

- All government entity references are validated before saving
- Proper indexing for efficient querying
- Cascading deletes handled appropriately
- Backward compatibility maintained for existing petitions
- Error handling for missing government entities

## Testing

To test the integration:

1. Run the initialization script to create government entities
2. Create a new petition with government entity selection
3. Verify the petition appears with correct government context
4. Test filtering by jurisdiction and governing body
5. Verify the petition detail page shows government information

The system is designed to be robust and handle cases where government entities may not exist or be properly configured.
