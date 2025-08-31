# Government Entity Relationships - Visual Diagram

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GOVERNMENT ENTITY RELATIONSHIPS                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   JURISDICTION  │    │ GOVERNING BODY  │    │     DISTRICT    │
│                 │    │                 │    │                 │
│ • name          │    │ • name          │    │ • name          │
│ • slug          │    │ • slug          │    │ • slug          │
│ • level         │    │ • branch        │    │ • district_type │
│ • parent        │    │ • jurisdiction  │    │ • jurisdiction  │
│ • path          │    │ • parent        │    │ • district_num  │
│ • depth         │    │ • path          │    │ • boundaries    │
│ • identifiers   │    │ • depth         │    │ • population    │
│ • metadata      │    │ • identifiers   │    │ • identifiers   │
│ • media         │    │ • metadata      │    │ • metadata      │
│ • contact_info  │    │ • media         │    │                 │
└─────────────────┘    │ • contact_info  │    └─────────────────┘
         │              └─────────────────┘              │
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼────────┐    ┌──────────▼──────────┐
            │     OFFICE     │    │      COMMITTEE      │
            │                │    │                     │
            │ • name         │    │ • name              │
            │ • slug         │    │ • slug              │
            │ • office_type  │    │ • governing_body    │
            │ • governing_body│   │ • jurisdiction      │
            │ • jurisdiction │    │ • committee_type    │
            │ • district     │    │ • chair             │
            │ • constituency │    │ • vice_chair        │
            │ • selection_method│ │ • members           │
            │ • term_length  │    │ • identifiers       │
            │ • term_limit   │    │ • metadata          │
            │ • salary       │    │                     │
            │ • identifiers  │    └─────────────────────┘
            │ • metadata     │              │
            │ • media        │              │
            └────────────────┘              │
                    │                       │
                    │                       │
            ┌───────▼────────┐    ┌─────────▼──────────┐
            │    POSITION    │    │    LEGISLATION     │
            │                │    │                    │
            │ • office       │    │ • title            │
            │ • person       │    │ • bill_number      │
            │ • election     │    │ • governing_body   │
            │ • term_start   │    │ • jurisdiction     │
            │ • term_end     │    │ • committees       │
            │ • is_current   │    │ • legislation_type │
            │ • party        │    │ • status           │
            │ • status       │    │ • introduced_date  │
            │ • identifiers  │    │ • sponsors         │
            │ • metadata     │    │ • cosponsors       │
            │ • media        │    │ • summary          │
            └────────────────┘    │ • full_text        │
                    │              │ • identifiers      │
                    │              │ • metadata         │
                    │              └────────────────────┘
                    │                       │
                    │                       │
            ┌───────▼────────┐    ┌─────────▼──────────┐
            │ GOVERNMENT VOTE│    │     ELECTION       │
            │                │    │                    │
            │ • legislation  │    │ • office           │
            │ • person       │    │ • jurisdiction     │
            │ • position     │    │ • district         │
            │ • governing_body│   │ • election_date    │
            │ • vote_date    │    │ • election_type    │
            │ • vote_position│    │ • is_partisan      │
            │ • identifiers  │    │ • status           │
            │ • metadata     │    │ • candidates       │
            └────────────────┘    │ • total_votes_cast │
                                  │ • voter_turnout    │
                                  │ • identifiers      │
                                  │ • metadata         │
                                  └────────────────────┘
```

## Hierarchical Structure Examples

### 1. Jurisdiction Hierarchy
```
USA (federal)
├── California (state)
│   ├── San Mateo County (county)
│   │   ├── San Francisco (municipal)
│   │   │   ├── District 1 (ward)
│   │   │   └── District 2 (ward)
│   │   └── Redwood City (municipal)
│   └── Los Angeles County (county)
│       ├── Los Angeles (municipal)
│       └── Beverly Hills (municipal)
└── New York (state)
    ├── New York County (county)
    │   └── New York City (municipal)
    └── Westchester County (county)
```

### 2. Governing Body Hierarchy
```
US Congress (federal legislative)
├── US Senate (federal legislative)
│   ├── Senate Judiciary Committee (standing)
│   ├── Senate Finance Committee (standing)
│   └── Senate Intelligence Committee (select)
└── US House of Representatives (federal legislative)
    ├── House Judiciary Committee (standing)
    ├── House Ways and Means Committee (standing)
    └── House Intelligence Committee (select)
```

### 3. Office Assignment Patterns
```
Jurisdiction: California
├── Governing Body: California Legislature
│   ├── Office: State Senator (District 1)
│   │   └── Position: John Doe (2023-2027)
│   └── Office: State Senator (District 2)
│       └── Position: Jane Smith (2023-2027)
├── Governing Body: California Executive
│   ├── Office: Governor
│   │   └── Position: Governor Johnson (2023-2027)
│   └── Office: Lieutenant Governor
│       └── Position: Lt. Gov. Brown (2023-2027)
└── Direct Jurisdiction Office: State Treasurer
    └── Position: Treasurer Davis (2023-2027)
```

## Relationship Flow Diagrams

### 1. Legislative Process Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ LEGISLATION │───▶│  COMMITTEE  │───▶│ GOVERNING   │───▶│ GOVERNMENT  │
│             │    │             │    │    BODY     │    │    VOTE     │
│ • Introduced│    │ • Assigned  │    │ • Scheduled │    │ • Recorded  │
│ • Sponsored │    │ • Reviewed  │    │ • Debated   │    │ • Counted   │
│ • Drafted   │    │ • Reported  │    │ • Voted     │    │ • Results   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 2. Election Process Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   OFFICE    │───▶│  ELECTION   │───▶│  POSITION   │───▶│ GOVERNMENT  │
│             │    │             │    │             │    │    VOTE     │
│ • Created   │    │ • Scheduled │    │ • Filled    │    │ • Cast      │
│ • Defined   │    │ • Candidates│    │ • Term Start│    │ • Tracked   │
│ • District  │    │ • Results   │    │ • Current   │    │ • History   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 3. Media Association Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    MEDIA    │◄───│   ENTITY    │◄───│     USER    │
│             │    │             │    │             │
│ • Uploaded  │    │ • Jurisdiction│   │ • Authenticated│
│ • Associated│    │ • Governing Body│ │ • Authorized │
│ • Categorized│   │ • Office     │   │ • Uploaded   │
│ • Stored    │    │ • Position   │   │ • Managed    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Data Access Patterns

### 1. Hierarchy Navigation
```
User Request: "Show me California's government structure"
↓
Query: Jurisdiction.find({ slug: 'california' })
↓
Populate: GoverningBody, District, Office
↓
Result: Complete California government hierarchy
```

### 2. Current Office Holders
```
User Request: "Who represents me in Congress?"
↓
Query: Position.find({ 
  'office.district': userDistrict,
  is_current: true 
})
↓
Populate: Office, Person, District
↓
Result: Current representatives for user's district
```

### 3. Voting Records
```
User Request: "How did my senator vote on recent bills?"
↓
Query: GovernmentVote.find({ 
  person: senatorId,
  vote_date: { $gte: startDate }
})
↓
Populate: Legislation, Position
↓
Result: Senator's recent voting record
```

## Integration Points

### 1. User System Integration
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     USER    │───▶│  POSITION   │───▶│    OFFICE   │
│             │    │             │    │             │
│ • Profile   │    │ • Current   │    │ • Government│
│ • Auth      │    │ • History   │    │ • District  │
│ • Roles     │    │ • Terms     │    │ • Jurisdiction│
└─────────────┘    └─────────────┘    └─────────────┘
```

### 2. Petition System Integration
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PETITION  │───▶│ JURISDICTION│───▶│    OFFICE   │
│             │    │             │    │             │
│ • Target    │    │ • Level     │    │ • Type      │
│ • Scope     │    │ • Authority │    │ • Holder    │
│ • Delivery  │    │ • Structure │    │ • Contact   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 3. Voting System Integration
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ PUBLIC VOTE │───▶│ LEGISLATION │───▶│ GOVERNMENT  │
│             │    │             │    │    VOTE     │
│ • Petition  │    │ • Bill      │    │ • Official  │
│ • Support   │    │ • Status    │    │ • Record    │
│ • Results   │    │ • Process   │    │ • History   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Performance Optimization

### 1. Indexing Strategy
```
Primary Indexes:
├── Jurisdiction: { parent: 1, slug: 1 }
├── GoverningBody: { jurisdiction: 1, parent: 1, slug: 1 }
├── Office: { governing_body: 1, slug: 1 } OR { jurisdiction: 1, slug: 1 }
├── Position: { office: 1, person: 1, term_start: 1 }
└── Election: { office: 1, election_date: 1 }

Query Indexes:
├── Jurisdiction: { level: 1 }, { path: 1 }
├── GoverningBody: { branch: 1 }, { path: 1 }
├── Position: { person: 1, is_current: 1 }
├── GovernmentVote: { person: 1, vote_date: 1 }
└── Legislation: { status: 1, introduced_date: 1 }
```

### 2. Population Strategy
```
Efficient Population:
├── Selective Fields: Only populate required fields
├── Nested Population: Handle complex relationship chains
├── Pagination: Limit results for large datasets
└── Caching: Cache frequently accessed hierarchies
```

This visual representation shows the comprehensive structure and relationships within the Government Entity system, providing a clear understanding of how different entities connect and interact within the database.
