# Database Schema - Refactored v1

## Overview

This document describes the refactored database schema for the USA application, which has been completely redesigned for better data consistency, performance, and maintainability.

## Core Design Principles

1. **Single Source of Truth**: All metrics come from materialized views, not embedded counters
2. **Enforced Relationships**: Clear parent-child relationships with validation
3. **Clean History**: Time-sliced records for historical data
4. **Performance**: Proper indexing and efficient query patterns
5. **Scalability**: Support for large datasets and high concurrency

## Database Models

### User Model

The central user entity with role-based access control.

```javascript
const User = new Schema({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, minlength: 8, select: false }, // present only for local auth
  firstName: { type: String, required: true, maxlength: 50 },
  lastName: { type: String, required: true, maxlength: 50 },
  roles: [{ type: ObjectId, ref: 'Role', index: true }],
  isActive: { type: Boolean, default: true, index: true },
  lastLogin: { type: Date, index: true },
  profile: {
    bio: { type: String, maxlength: 500 },
    location: { type: String, maxlength: 100 },
    website: { type: String, maxlength: 200 }
  },
  authProviders: { type: [AuthProvider], default: [] }
}, { timestamps: true });
```

**Key Features:**
- Role references instead of role strings
- OAuth provider support via `authProviders` array
- Profile information in nested object
- Proper indexing for common queries

**Indexes:**
- `{ username: 1 }` (unique)
- `{ email: 1 }` (unique)
- `{ 'authProviders.provider': 1, 'authProviders.providerUserId': 1 }` (unique, sparse)
- `{ isActive: 1, roles: 1 }`
- `{ email: 1, isActive: 1 }`

### Role Model

Defines user roles and their associated scopes.

```javascript
const Role = new Schema({
  name: { type: String, unique: true, required: true },
  scopes: [{ type: String, required: true }],
  description: { type: String, maxlength: 500 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

**Default Roles:**
- **user**: Basic read access (`users:read`, `petitions:read`, `votes:read`, etc.)
- **moderator**: Content management (`petitions:write`, `media:write`, etc.)
- **admin**: Full system access (`users:write`, `gov:write`, `roles:assign`, etc.)
- **developer**: Analytics access (`analytics:read`)

### Petition Model

Petitions are user-created proposals with government entity references.

```javascript
const Petition = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 5000 },
  categoryId: { type: ObjectId, ref: 'Taxonomy', required: true, index: true },
  creator: { type: ObjectId, ref: 'User', required: true, index: true },
  jurisdiction: { type: ObjectId, ref: 'Jurisdiction', required: true, index: true },
  governingBody: { type: ObjectId, ref: 'GoverningBody', index: true },
  legislation: { type: ObjectId, ref: 'Legislation', index: true },
  status: { type: String, enum: ['draft', 'active', 'closed', 'archived'], default: 'active', index: true },
  tags: [{ type: String, trim: true, maxlength: 50 }],
  snapshot: { // optional cached counts
    voteCount: { type: Number, default: 0 },
    totalVigor: { type: Number, default: 0 }
  }
}, { timestamps: true });
```

**Key Changes from Legacy:**
- `category` → `categoryId` (references Taxonomy)
- `isActive` → `status` (more descriptive states)
- Removed mutable counters (`voteCount`, `totalVigor`)
- Added `snapshot` for optional cached data

**Indexes:**
- `{ creator: 1, createdAt: -1 }`
- `{ jurisdiction: 1, status: 1, createdAt: -1 }`
- `{ 'snapshot.voteCount': -1 }`
- `{ status: 1, createdAt: -1 }`
- `{ title: 'text', description: 'text' }`

### PetitionMetrics Model

Materialized view for petition analytics and trending scores.

```javascript
const PetitionMetrics = new Schema({
  petitionId: { type: ObjectId, ref: 'Petition', unique: true, index: true },
  voteCount: { type: Number, default: 0 },
  vigorCount: { type: Number, default: 0 },
  totalVigor: { type: Number, default: 0 },
  trendingScore: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now, index: true }
}, { versionKey: false });
```

**Purpose:**
- Single source of truth for all petition statistics
- Enables efficient analytics queries
- Supports trending algorithms
- Updated automatically by background workers

**Indexes:**
- `{ petitionId: 1 }` (unique)
- `{ voteCount: -1 }`
- `{ totalVigor: -1 }`
- `{ trendingScore: -1 }`
- `{ updatedAt: -1 }`

### Vote Model

The unique bridge between User and Petition, enforcing one vote per user per petition.

```javascript
const Vote = new Schema({
  user: { type: ObjectId, ref: 'User', required: true, index: true },
  petition: { type: ObjectId, ref: 'Petition', required: true, index: true },
  signingStatement: { type: String, maxlength: 1000 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });
```

**Key Features:**
- Unique compound index `{ user: 1, petition: 1 }`
- Enforces one vote per user per petition
- Supports signing statements
- Active/inactive status for soft deletion

**Indexes:**
- `{ user: 1, petition: 1 }` (unique compound)
- `{ petition: 1, createdAt: -1 }`
- `{ user: 1, createdAt: -1 }`
- `{ isActive: 1, createdAt: -1 }`

### Vigor Model

Vigor contributions are always attached to votes, never directly to petitions.

```javascript
const Vigor = new Schema({
  user: { type: ObjectId, ref: 'User', required: true, index: true },
  vote: { type: ObjectId, ref: 'Vote', required: true, index: true },
  vigorType: { type: String, enum: ['steps', 'calories', 'duration', 'distance', 'workout', 'meditation', 'reading', 'volunteering'], required: true, index: true },
  vigorAmount: { type: Number, min: 0, required: true },
  activity: { type: Schema.Types.Mixed, required: true },
  signingStatement: { type: String, maxlength: 1000 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });
```

**Key Features:**
- Always linked to a Vote (not directly to Petition)
- Pre-validation hook ensures `vigor.user === vote.user`
- Flexible activity data storage
- Multiple vigor types supported

**Indexes:**
- `{ vote: 1, createdAt: -1 }`
- `{ user: 1, createdAt: -1 }`
- `{ vigorType: 1, createdAt: -1 }`
- `{ isActive: 1, createdAt: -1 }`

**Validation Hook:**
```javascript
Vigor.pre('validate', async function(next) {
  // Verify vigor.user matches vote.user
  const vote = await this.model('Vote').findById(this.vote).select('user').lean();
  if (vote.user.toString() !== this.user.toString()) {
    return next(new Error('vigor.user must match vote.user'));
  }
  next();
});
```

### Government Hierarchy Models

#### Jurisdiction
Represents government jurisdictions with hierarchical relationships.

```javascript
const Jurisdiction = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  level: { type: String, enum: ['federal', 'state', 'county', 'city', 'district'], required: true, index: true },
  parent: { type: ObjectId, ref: 'Jurisdiction', index: true },
  ancestors: [{ type: ObjectId, ref: 'Jurisdiction', index: true }],
  isActive: { type: Boolean, default: true, index: true },
  description: { type: String, maxlength: 1000 }
}, { timestamps: true });
```

**Key Features:**
- Materialized path via `ancestors` array
- Hierarchical organization (federal → state → county → city)
- Slug unique within parent scope

#### GoverningBody
Government bodies within jurisdictions (legislatures, executive agencies, courts).

```javascript
const GoverningBody = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  jurisdiction: { type: ObjectId, ref: 'Jurisdiction', required: true, index: true },
  branch: { type: String, enum: ['executive', 'legislative', 'judicial'], required: true },
  entity_type: { type: String, enum: ['council', 'board', 'commission', 'agency', 'department', 'court'], required: true },
  description: { type: String, maxlength: 1000 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });
```

#### Office
Positions within governing bodies (e.g., "Senator", "Mayor").

```javascript
const Office = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  governingBody: { type: ObjectId, ref: 'GoverningBody', required: true, index: true },
  description: { type: String, maxlength: 1000 },
  termLength: { type: Number }, // years
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });
```

#### Position
Represents a specific seat within an office.

```javascript
const Position = new Schema({
  office: { type: ObjectId, ref: 'Office', required: true, index: true },
  title: { type: String, trim: true }, // optional title override
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });
```

#### PositionTerm
Records who held a position and when.

```javascript
const PositionTerm = new Schema({
  position: { type: ObjectId, ref: 'Position', required: true, index: true },
  user: { type: ObjectId, ref: 'User', required: true, index: true }, // the office holder
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date }, // null means current
  isCurrent: { type: Boolean, default: true, index: true }
}, { timestamps: true });
```

**Key Features:**
- Time-sliced records for clean history
- Prevents overlapping terms for same position
- Links office holders (Users) to positions

**Validation Hook:**
```javascript
PositionTerm.pre('save', async function(next) {
  // Prevent overlapping terms for same position
  const overlap = await this.model('PositionTerm').exists({
    position: this.position,
    _id: { $ne: this._id },
    $or: [
      { endDate: null, startDate: { $lte: this.endDate || new Date('9999-12-31') } },
      { endDate: { $gte: this.startDate } }
    ]
  });
  
  if (overlap) {
    return next(new Error('Overlapping terms for position'));
  }
  next();
});
```

### Legislation Model

Tracks legislative bills and their status.

```javascript
const Legislation = new Schema({
  title: { type: String, required: true, trim: true },
  bill_number: { type: String, required: true, trim: true },
  governing_body: { type: ObjectId, ref: 'GoverningBody', required: true, index: true },
  status: { type: String, enum: ['introduced', 'in_committee', 'passed_committee', 'passed_chamber', 'passed_both', 'signed', 'vetoed', 'failed'], required: true, index: true },
  introduced_date: { type: Date, required: true, index: true },
  summary: { type: String, maxlength: 2000 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });
```

**Key Features:**
- Bill number unique within governing body
- Comprehensive status tracking
- Links to governing body for jurisdiction context

### Media Model

Unified media storage for all entity types.

```javascript
const Media = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'document', 'video'], required: true, index: true },
  bytes: { type: Number, required: true },
  mime: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, maxlength: 500 },
  isPrimary: { type: Boolean, default: false, index: true },
  uploadedBy: { type: ObjectId, ref: 'User', required: true, index: true },
  entityType: { type: String, enum: ['User', 'Petition', 'Jurisdiction', 'GoverningBody', 'Office', 'Position', 'Legislation'], required: true, index: true },
  entityId: { type: ObjectId, required: true, index: true },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });
```

**Key Features:**
- Single polymorphic reference via `entityType` and `entityId`
- Supports all entity types
- Primary media designation
- File metadata storage

### Taxonomy Model

Controlled categories and tags for petitions and other entities.

```javascript
const Taxonomy = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true, unique: true },
  type: { type: String, enum: ['category', 'tag', 'topic'], required: true, index: true },
  parent: { type: ObjectId, ref: 'Taxonomy', index: true },
  description: { type: String, maxlength: 1000 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });
```

**Default Categories:**
- Environment, Education, Healthcare, Economy, Civil Rights, Foreign Policy, Other

## Database Relationships

### Core Relationships

```
User (1) ←→ (1) Vote (1) ←→ (1) Petition
  ↓           ↓
  ↓           ↓
  ↓        Vigor
  ↓
PositionTerm (1) ←→ (1) Position (1) ←→ (1) Office (1) ←→ (1) GoverningBody (1) ←→ (1) Jurisdiction
```

### Key Constraints

1. **Vote Uniqueness**: `{ user: 1, petition: 1 }` unique compound index
2. **Vigor Validation**: `vigor.user` must match `vote.user`
3. **Position Term Overlap**: No overlapping terms for same position
4. **Slug Uniqueness**: Unique within parent scope for government entities
5. **Media Polymorphism**: Single reference system for all entity types

## Indexing Strategy

### Performance Indexes

- **Common List Views**: `{ jurisdiction: 1, status: 1, createdAt: -1 }`
- **User Activity**: `{ user: 1, createdAt: -1 }`
- **Petition Discovery**: `{ 'snapshot.voteCount': -1 }`
- **Government Hierarchy**: `{ parent: 1, slug: 1 }` (unique)
- **Media Queries**: `{ entityType: 1, entityId: 1, createdAt: -1 }`

### Unique Constraints

- User: `username`, `email`
- Vote: `{ user: 1, petition: 1 }`
- Jurisdiction: `{ slug: 1, parent: 1 }`
- GoverningBody: `{ jurisdiction: 1, slug: 1 }`
- Office: `{ governingBody: 1, slug: 1 }`
- Legislation: `{ governing_body: 1, bill_number: 1 }`

## Data Consistency

### Metrics Worker System

- **Background Processing**: Updates PetitionMetrics from source data
- **Event-Driven**: Triggers on Vote/Vigor creation/updates
- **Queue-Based**: Handles high concurrency gracefully
- **Automatic**: No manual intervention required

### Validation Hooks

- **Pre-save Validation**: Ensures data integrity before storage
- **Relationship Validation**: Verifies foreign key consistency
- **Business Rule Enforcement**: Prevents invalid data states

## Migration and Setup

### Initial Setup

1. **Create Default Roles**: Run migration script to create standard roles
2. **Create Default Taxonomy**: Set up petition categories
3. **Migrate Existing Data**: Transform old models to new structure
4. **Build Indexes**: Create all required database indexes
5. **Start Metrics Worker**: Begin background processing

### Migration Scripts

- **Role Migration**: Convert role strings to role references
- **Category Migration**: Map old categories to new Taxonomy
- **Metrics Creation**: Generate initial PetitionMetrics from existing data
- **Data Validation**: Verify data integrity after migration

## Performance Considerations

### Query Optimization

- **Aggregation Pipelines**: Use MongoDB aggregation for complex analytics
- **Index Hints**: Leverage compound indexes for common query patterns
- **Field Selection**: Limit returned fields with `fields` parameter
- **Pagination**: Use cursor-based pagination for large datasets

### Caching Strategy

- **Snapshot Data**: Optional cached counts in Petition model
- **Materialized Views**: PetitionMetrics for analytics queries
- **Background Updates**: Worker processes for data consistency

## Security Features

### Data Protection

- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Input sanitization and output encoding
- **Access Control**: Role-based permissions with scopes

### Audit Trail

- **Timestamps**: Automatic `createdAt` and `updatedAt`
- **User Tracking**: `uploadedBy` and ownership fields
- **Soft Deletion**: `isActive` flags for data retention
- **Change Logging**: Track important data modifications

## Future Enhancements

### Planned Features

1. **Advanced Analytics**: Machine learning for trending scores
2. **Real-time Updates**: WebSocket support for live data
3. **Data Export**: Bulk data export capabilities
4. **Advanced Search**: Full-text search with ranking
5. **Data Archiving**: Long-term storage strategies

### Scalability Improvements

1. **Sharding**: Horizontal scaling for large datasets
2. **Read Replicas**: Separate read/write operations
3. **Connection Pooling**: Optimize database connections
4. **Query Optimization**: Advanced indexing strategies

## Conclusion

The refactored database schema provides:

- **Better Data Integrity**: Enforced relationships and validation
- **Improved Performance**: Proper indexing and efficient queries
- **Enhanced Scalability**: Support for large datasets and high concurrency
- **Cleaner Architecture**: Clear separation of concerns
- **Future-Proof Design**: Extensible for new features

This foundation supports the application's growth while maintaining data consistency and performance.

