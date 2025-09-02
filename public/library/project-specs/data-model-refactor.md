# Data Model Refactor Implementation

## Overview

This document outlines the implementation of the comprehensive data model refactor that addresses the core relationship constraints and improves data consistency.

## Key Changes Implemented

### 1. Core Relationship Model

✅ **User** creates **Petition**
✅ **User** casts exactly one **Vote** per **Petition** (enforced by unique compound index)
✅ **Vigor** always points to **Vote** and **User** (with validation that vigor.user matches vote.user)
✅ **Position** references **Office** and **User** (via PositionTerm)
✅ **PositionTerm** records time slices for clean history

### 2. New Models Created

#### User Model (`server/models/User.js`)
- Replaced role strings with Role references
- Implemented `authProviders` array for OAuth and local auth
- Added proper indexing for common queries
- Compound unique index for auth providers

#### Role Model (`server/models/Role.js`)
- New model for role-based access control
- Includes scopes for fine-grained permissions
- Supports role hierarchy and descriptions

#### Petition Model (`server/models/Petition.js`)
- Removed mutable counters (`voteCount`, `totalVigor`)
- Added `snapshot` structure for optional cached counts
- References `categoryId` instead of string category
- Added proper indexing for performance

#### PetitionMetrics Model (`server/models/PetitionMetrics.js`)
- Materialized view for analytics counts
- Single source of truth for vote and vigor statistics
- Supports trending score calculations

#### Vote Model (`server/models/Vote.js`)
- Unique bridge between User and Petition
- Enforces one vote per user per petition
- Includes signing statement and active status

#### Vigor Model (`server/models/Vigor.js`)
- Always attached to a Vote, never directly to Petition
- Pre-validation hook ensures vigor.user matches vote.user
- Supports multiple vigor types (steps, calories, duration, etc.)

#### Government Hierarchy Models
- **Jurisdiction**: Materialized path via `ancestors` array
- **GoverningBody**: Slug unique within jurisdiction
- **Office**: Slug unique within governing body
- **Position**: Represents the seat (separate from office holder)
- **PositionTerm**: Records time slices with overlap prevention

#### Legislation Model (`server/models/Legislation.js`)
- Uniqueness per governing body and bill number
- Comprehensive status tracking
- Proper indexing for legislative queries

#### Media Model (`server/models/Media.js`)
- Single polymorphic reference via `entityType` and `entityId`
- Supports all entity types (User, Petition, Government entities)
- Proper indexing for media queries

#### Taxonomy Model (`server/models/Taxonomy.js`)
- Controlled categories and tags
- Supports hierarchical organization
- Replaces hardcoded category strings

### 3. Validation and Constraints

✅ **Votes**: Unique compound index `(user, petition)` blocks duplicates
✅ **Vigor**: Pre-validate hook verifies `vigor.user === vote.user`
✅ **PositionTerm**: Constraint prevents overlapping terms for same position
✅ **Slugs**: Unique within parent scope (jurisdiction, governing body, office)

### 4. Index Strategy

- **Common list views**: jurisdiction + status + createdAt
- **Vote queries**: user + createdAt, petition + createdAt
- **Vigor queries**: vote + createdAt, user + createdAt
- **Media queries**: entityType + entityId + createdAt
- **Government queries**: parent + slug uniqueness

### 5. Migration Tools

#### MigrationManager (`server/utils/migration.js`)
- Creates default roles and taxonomy
- Migrates users from old role strings to role references
- Migrates petitions from category strings to categoryId references
- Creates initial PetitionMetrics from existing data

#### Migration Script (`server/scripts/run-migration.js`)
- Executable script for running migrations
- Available via `npm run migrate`
- Comprehensive logging and error handling

## Migration Steps

### Phase 1: Schema Updates
1. ✅ Update all models with new schemas
2. ✅ Add new models (Role, PetitionMetrics, PositionTerm, etc.)
3. ✅ Remove old fields and references

### Phase 2: Data Migration
1. ✅ Create default roles and taxonomy
2. ✅ Migrate users to new role structure
3. ✅ Migrate petitions to new category structure
4. ✅ Create initial metrics from existing data

### Phase 3: API Updates (Next Steps)
1. 🔄 Update API routes to use new models
2. 🔄 Implement new validation schemas
3. 🔄 Update response formats
4. 🔄 Add new endpoints for PositionTerm management

### Phase 4: Frontend Updates (Next Steps)
1. 🔄 Update components to use new data structures
2. 🔄 Implement new form validations
3. 🔄 Update display logic for new relationships
4. 🔄 Add new UI for PositionTerm management

## Benefits of the Refactor

### Data Consistency
- **Single source of truth** for all counts via PetitionMetrics
- **Enforced relationships** prevent orphaned data
- **Validation hooks** ensure data integrity

### Performance
- **Proper indexing** for common query patterns
- **Materialized views** for analytics
- **Eliminated counter drift** issues

### Scalability
- **Clean separation** of concerns
- **Flexible auth system** with OAuth support
- **Hierarchical government data** with materialized paths

### Maintainability
- **Clear relationship model** easier to understand
- **Consistent patterns** across all models
- **Migration tools** for future schema changes

## Next Steps

1. **Test the migration** with existing data
2. **Update API routes** to use new models
3. **Update frontend components** for new data structures
4. **Implement worker processes** for metrics updates
5. **Add comprehensive testing** for new relationships

## Running the Migration

```bash
# Run the migration script
npm run migrate

# Check the logs for any issues
# Verify data integrity after migration
```

## Rollback Plan

If issues arise during migration:
1. **Stop the application** immediately
2. **Restore from database backup**
3. **Review migration logs** for specific issues
4. **Fix the migration script** and retry
5. **Test with a copy** of production data first

## Conclusion

This refactor establishes a solid foundation for the application's data model with:
- **Clear relationships** that prevent data inconsistencies
- **Proper indexing** for optimal query performance
- **Flexible architecture** that supports future growth
- **Migration tools** for safe transitions

The new model enforces the business rules while maintaining flexibility for future enhancements.
