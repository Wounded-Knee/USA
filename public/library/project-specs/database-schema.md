# Database Schema Documentation

## Overview
This document provides comprehensive documentation for the USA Full-Stack Application database schema. The application uses MongoDB with Mongoose ODM for data modeling and validation.

## Database Configuration

### Connection
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Connection String**: `MONGODB_URI` environment variable

### Schema Configuration
```javascript
// Default Mongoose configuration
{
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
```

---

## User Management

### User Schema
```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() { return this.authMethod === 'local'; },
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  authMethod: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: {
    type: String,
    sparse: true
  },
  roles: [{
    type: String,
    enum: ['User', 'Moderator', 'Admin', 'Developer'],
    default: ['User']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profile: {
    bio: {
      type: String,
      maxlength: 500
    },
    location: {
      type: String,
      maxlength: 100
    },
    website: {
      type: String,
      maxlength: 200
    },
    avatar: {
      type: String
    },
    banner: {
      type: String
    }
  }
});
```

### User Methods
```javascript
// Check if user has any of the specified roles
userSchema.methods.hasAnyRole = function(roles) {
  return this.roles.some(role => roles.includes(role));
};

// Check if user has all specified roles
userSchema.methods.hasAllRoles = function(roles) {
  return roles.every(role => this.roles.includes(role));
};

// Get user's full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
```

### User Indexes
```javascript
// Performance indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
```

---

## Petition System

### Petition Schema
```javascript
const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Environment',
      'Healthcare',
      'Education',
      'Transportation',
      'Public Safety',
      'Economic Development',
      'Social Services',
      'Infrastructure',
      'Other'
    ]
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jurisdiction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
    required: true
  },
  governingBody: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GoverningBody'
  },
  legislation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Legislation'
  },
  voteCount: {
    type: Number,
    default: 0
  },
  vigorCount: {
    type: Number,
    default: 0
  },
  totalVigor: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'archived'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  metadata: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    trendingScore: {
      type: Number,
      default: 0
    }
  }
});
```

### Petition Methods
```javascript
// Update vote count
petitionSchema.methods.updateVoteCount = async function() {
  const Vote = mongoose.model('Vote');
  this.voteCount = await Vote.countDocuments({ petition: this._id });
  return this.save();
};

// Update vigor statistics
petitionSchema.methods.updateVigorStats = async function() {
  const Vigor = mongoose.model('Vigor');
  const stats = await Vigor.aggregate([
    { $match: { petition: this._id, isActive: true } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalAmount: { $sum: '$vigorAmount' }
      }
    }
  ]);
  
  if (stats.length > 0) {
    this.vigorCount = stats[0].count;
    this.totalVigor = stats[0].totalAmount;
  } else {
    this.vigorCount = 0;
    this.totalVigor = 0;
  }
  
  return this.save();
};
```

### Petition Indexes
```javascript
petitionSchema.index({ creator: 1 });
petitionSchema.index({ jurisdiction: 1 });
petitionSchema.index({ category: 1 });
petitionSchema.index({ isActive: 1 });
petitionSchema.index({ status: 1 });
petitionSchema.index({ createdAt: -1 });
petitionSchema.index({ voteCount: -1 });
petitionSchema.index({ totalVigor: -1 });
petitionSchema.index({ 'metadata.trendingScore': -1 });
petitionSchema.index({ tags: 1 });
```

---

## Voting System

### Vote Schema
```javascript
const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: true
  },
  vigorCount: {
    type: Number,
    default: 0
  },
  totalVigor: {
    type: Number,
    default: 0
  },
  signingStatement: {
    type: String,
    maxlength: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

### Vote Indexes
```javascript
voteSchema.index({ user: 1, petition: 1 }, { unique: true });
voteSchema.index({ petition: 1 });
voteSchema.index({ user: 1 });
voteSchema.index({ createdAt: -1 });
```

---

## Vigor System

### Vigor Schema
```javascript
const vigorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vote',
    required: true
  },
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: true
  },
  vigorType: {
    type: String,
    required: true,
    enum: [
      'steps',
      'calories',
      'duration',
      'distance',
      'workout',
      'meditation',
      'reading',
      'volunteering'
    ]
  },
  vigorAmount: {
    type: Number,
    required: true,
    min: 0
  },
  activityData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  signingStatement: {
    type: String,
    maxlength: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

### Vigor Indexes
```javascript
vigorSchema.index({ user: 1 });
vigorSchema.index({ petition: 1 });
vigorSchema.index({ vote: 1 });
vigorSchema.index({ vigorType: 1 });
vigorSchema.index({ createdAt: -1 });
vigorSchema.index({ isActive: 1 });
```

---

## Government Data

### Jurisdiction Schema
```javascript
const jurisdictionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['federal', 'state', 'county', 'city', 'district']
  },
  depth: {
    type: Number,
    default: 0
  },
  path: {
    type: String,
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction'
  },
  description: {
    type: String,
    maxlength: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

### Governing Body Schema
```javascript
const governingBodySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  jurisdiction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
    required: true
  },
  branch: {
    type: String,
    required: true,
    enum: ['executive', 'legislative', 'judicial']
  },
  entity_type: {
    type: String,
    required: true,
    enum: ['council', 'board', 'commission', 'agency', 'department', 'court']
  },
  description: {
    type: String,
    maxlength: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

### Office Schema
```javascript
const officeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  governingBody: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GoverningBody',
    required: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  termLength: {
    type: Number // in years
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

### Position Schema
```javascript
const positionSchema = new mongoose.Schema({
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    required: true
  },
  person: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    party: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: 2000
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  isCurrent: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

### Legislation Schema
```javascript
const legislationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  bill_number: {
    type: String,
    required: true,
    trim: true
  },
  governing_body: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GoverningBody',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: [
      'introduced',
      'in_committee',
      'passed_committee',
      'passed_chamber',
      'passed_both',
      'signed',
      'vetoed',
      'failed'
    ]
  },
  introduced_date: {
    type: Date,
    required: true
  },
  summary: {
    type: String,
    maxlength: 2000
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

---

## Media Management

### Media Schema
```javascript
const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  original_name: {
    type: String,
    required: true
  },
  media_type: {
    type: String,
    required: true,
    enum: ['image', 'document', 'video']
  },
  file_size: {
    type: Number,
    required: true
  },
  mime_type: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  is_primary: {
    type: Boolean,
    default: false
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Polymorphic associations
  jurisdiction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction'
  },
  governing_body: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GoverningBody'
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office'
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

---

## Data Management

### Data Schema
```javascript
const dataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    required: true,
    enum: ['dataset', 'report', 'analysis', 'document']
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

---

## Indexes and Performance

### Compound Indexes
```javascript
// User indexes
userSchema.index({ username: 1, isActive: 1 });
userSchema.index({ email: 1, isActive: 1 });

// Petition indexes
petitionSchema.index({ jurisdiction: 1, isActive: 1 });
petitionSchema.index({ category: 1, isActive: 1 });
petitionSchema.index({ creator: 1, createdAt: -1 });
petitionSchema.index({ voteCount: -1, isActive: 1 });
petitionSchema.index({ totalVigor: -1, isActive: 1 });

// Vote indexes
voteSchema.index({ petition: 1, createdAt: -1 });
voteSchema.index({ user: 1, createdAt: -1 });

// Vigor indexes
vigorSchema.index({ petition: 1, vigorType: 1 });
vigorSchema.index({ user: 1, createdAt: -1 });

// Government indexes
jurisdictionSchema.index({ level: 1, isActive: 1 });
governingBodySchema.index({ jurisdiction: 1, branch: 1 });
positionSchema.index({ office: 1, isCurrent: 1 });
legislationSchema.index({ governing_body: 1, status: 1 });
```

### Text Search Indexes
```javascript
// Petition text search
petitionSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

// User text search
userSchema.index({
  username: 'text',
  firstName: 'text',
  lastName: 'text'
});

// Legislation text search
legislationSchema.index({
  title: 'text',
  summary: 'text'
});
```

---

## Data Validation

### Custom Validators
```javascript
// Email validation
const emailValidator = {
  validator: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  message: 'Please provide a valid email address'
};

// URL validation
const urlValidator = {
  validator: function(url) {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  message: 'Please provide a valid URL'
};

// Date range validation
const dateRangeValidator = {
  validator: function(endDate) {
    if (!endDate || !this.startDate) return true;
    return endDate > this.startDate;
  },
  message: 'End date must be after start date'
};
```

---

## Data Relationships

### Virtual Populate
```javascript
// User's petitions
userSchema.virtual('petitions', {
  ref: 'Petition',
  localField: '_id',
  foreignField: 'creator'
});

// Petition's votes
petitionSchema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'petition'
});

// Jurisdiction's governing bodies
jurisdictionSchema.virtual('governingBodies', {
  ref: 'GoverningBody',
  localField: '_id',
  foreignField: 'jurisdiction'
});
```

### Cascade Operations
```javascript
// Remove user's data when user is deleted
userSchema.pre('remove', async function(next) {
  const Petition = mongoose.model('Petition');
  const Vote = mongoose.model('Vote');
  const Vigor = mongoose.model('Vigor');
  
  await Promise.all([
    Petition.updateMany({ creator: this._id }, { isActive: false }),
    Vote.updateMany({ user: this._id }, { isActive: false }),
    Vigor.updateMany({ user: this._id }, { isActive: false })
  ]);
  
  next();
});

// Update petition vote count when vote is added/removed
voteSchema.post('save', async function() {
  const Petition = mongoose.model('Petition');
  await Petition.findByIdAndUpdate(this.petition, { $inc: { voteCount: 1 } });
});

voteSchema.post('remove', async function() {
  const Petition = mongoose.model('Petition');
  await Petition.findByIdAndUpdate(this.petition, { $inc: { voteCount: -1 } });
});
```

---

## Backup and Recovery

### Backup Strategy
```javascript
// Automated backup configuration
const backupConfig = {
  schedule: '0 2 * * *', // Daily at 2 AM
  retention: 30, // Keep 30 days of backups
  compression: true,
  encryption: true
};

// Backup collections
const backupCollections = [
  'users',
  'petitions',
  'votes',
  'vigor',
  'jurisdictions',
  'governingbodies',
  'offices',
  'positions',
  'legislation',
  'media',
  'data'
];
```

### Recovery Procedures
1. **Point-in-time recovery**: Restore to specific timestamp
2. **Collection-level recovery**: Restore specific collections
3. **Data validation**: Verify data integrity after recovery
4. **Index rebuilding**: Rebuild indexes after recovery

---

## Monitoring and Maintenance

### Database Monitoring
```javascript
// Performance monitoring queries
const monitoringQueries = {
  // Slow queries
  slowQueries: `
    db.system.profile.find({
      millis: { $gt: 100 }
    }).sort({ ts: -1 }).limit(10)
  `,
  
  // Index usage
  indexUsage: `
    db.collection.getIndexes()
  `,
  
  // Collection sizes
  collectionSizes: `
    db.runCommand({ collStats: "collection_name" })
  `,
  
  // Connection status
  connections: `
    db.serverStatus().connections
  `
};
```

### Maintenance Tasks
1. **Index optimization**: Analyze and optimize indexes monthly
2. **Data cleanup**: Remove inactive records quarterly
3. **Statistics update**: Update collection statistics weekly
4. **Backup verification**: Test backup restoration monthly

---

## Security Considerations

### Data Protection
- **Encryption at rest**: Enable MongoDB encryption
- **Encryption in transit**: Use TLS/SSL connections
- **Access control**: Implement role-based access
- **Audit logging**: Enable MongoDB audit logs

### Input Validation
- **Schema validation**: Use Mongoose validators
- **Sanitization**: Sanitize user inputs
- **Type checking**: Validate data types
- **Size limits**: Enforce file and data size limits

---

*Last Updated: $(date)*
*Version: 1.0*
*Maintainer: Database Team*
*Next Review: $(date -d '+3 months')*
