const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const Petition = require('../models/Petition');
const Vote = require('../models/Vote');
const Vigor = require('../models/Vigor');
const PetitionMetrics = require('../models/PetitionMetrics');
const Jurisdiction = require('../models/Jurisdiction');
const GoverningBody = require('../models/GoverningBody');
const Office = require('../models/Office');
const Position = require('../models/Position');
const PositionTerm = require('../models/PositionTerm');
const Legislation = require('../models/Legislation');
const Media = require('../models/Media');
const Taxonomy = require('../models/Taxonomy');

/**
 * Migration utility for transitioning from old data model to new refactored model
 */
class MigrationManager {
  constructor() {
    this.migrationLog = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    this.migrationLog.push(`[${timestamp}] ${message}`);
    console.log(`[${timestamp}] ${message}`);
  }

  async createDefaultRoles() {
    this.log('Creating default roles...');
    
    const defaultRoles = [
      {
        name: 'user',
        scopes: ['users:read', 'petitions:read', 'votes:read', 'vigor:read', 'media:read', 'gov:read'],
        description: 'Basic user with read access'
      },
      {
        name: 'moderator',
        scopes: ['users:read', 'petitions:read', 'petitions:write', 'votes:read', 'vigor:read', 'media:read', 'media:write', 'gov:read'],
        description: 'Moderator with content management access'
      },
      {
        name: 'admin',
        scopes: ['users:read', 'users:write', 'petitions:read', 'petitions:write', 'votes:read', 'vigor:read', 'media:read', 'media:write', 'gov:read', 'gov:write', 'roles:assign'],
        description: 'Administrator with full access'
      },
      {
        name: 'developer',
        scopes: ['users:read', 'petitions:read', 'votes:read', 'vigor:read', 'media:read', 'gov:read', 'analytics:read'],
        description: 'Developer with analytics access'
      }
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        await Role.create(roleData);
        this.log(`Created role: ${roleData.name}`);
      } else {
        this.log(`Role already exists: ${roleData.name}`);
      }
    }
  }

  async createDefaultTaxonomy() {
    this.log('Creating default taxonomy...');
    
    const defaultCategories = [
      { name: 'Environment', slug: 'environment', type: 'category' },
      { name: 'Education', slug: 'education', type: 'category' },
      { name: 'Healthcare', slug: 'healthcare', type: 'category' },
      { name: 'Economy', slug: 'economy', type: 'category' },
      { name: 'Civil Rights', slug: 'civil-rights', type: 'category' },
      { name: 'Foreign Policy', slug: 'foreign-policy', type: 'category' },
      { name: 'Other', slug: 'other', type: 'category' }
    ];

    for (const categoryData of defaultCategories) {
      const existingCategory = await Taxonomy.findOne({ slug: categoryData.slug });
      if (!existingCategory) {
        await Taxonomy.create(categoryData);
        this.log(`Created category: ${categoryData.name}`);
      } else {
        this.log(`Category already exists: ${categoryData.name}`);
      }
    }
  }

  async migrateUsers() {
    this.log('Migrating users to new model...');
    
    // Get default user role
    const userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      throw new Error('Default user role not found');
    }

    // Find users that need migration (those with old role strings)
    const usersToMigrate = await User.find({
      $or: [
        { roles: { $exists: false } },
        { roles: { $type: 'string' } },
        { roles: { $type: 'array', $elemMatch: { $type: 'string' } } }
      ]
    });

    this.log(`Found ${usersToMigrate.length} users to migrate`);

    for (const user of usersToMigrate) {
      try {
        // Convert old role strings to role references
        if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
          const roleStrings = user.roles.filter(role => typeof role === 'string');
          if (roleStrings.length > 0) {
            // Map old role names to new role references
            const roleMap = {
              'User': 'user',
              'Admin': 'admin',
              'Moderator': 'moderator',
              'Developer': 'developer'
            };

            const newRoleIds = [];
            for (const roleString of roleStrings) {
              const mappedRoleName = roleMap[roleString] || 'user';
              const role = await Role.findOne({ name: mappedRoleName });
              if (role) {
                newRoleIds.push(role._id);
              }
            }

            if (newRoleIds.length === 0) {
              newRoleIds.push(userRole._id);
            }

            user.roles = newRoleIds;
            await user.save();
            this.log(`Migrated user: ${user.username}`);
          }
        } else {
          // No roles, assign default user role
          user.roles = [userRole._id];
          await user.save();
          this.log(`Assigned default role to user: ${user.username}`);
        }
      } catch (error) {
        this.log(`Error migrating user ${user.username}: ${error.message}`);
      }
    }
  }

  async migratePetitions() {
    this.log('Migrating petitions to new model...');
    
    // Find petitions that need migration (those with old category strings)
    const petitionsToMigrate = await Petition.find({
      $or: [
        { categoryId: { $exists: false } },
        { category: { $exists: true } }
      ]
    });

    this.log(`Found ${petitionsToMigrate.length} petitions to migrate`);

    // Get category mapping
    const categoryMap = {};
    const categories = await Taxonomy.find({ type: 'category' });
    for (const category of categories) {
      categoryMap[category.name.toLowerCase()] = category._id;
    }

    for (const petition of petitionsToMigrate) {
      try {
        // Convert old category string to categoryId
        if (petition.category && !petition.categoryId) {
          const categoryName = petition.category.toLowerCase();
          if (categoryMap[categoryName]) {
            petition.categoryId = categoryMap[categoryName];
            petition.category = undefined; // Remove old field
            await petition.save();
            this.log(`Migrated petition: ${petition.title}`);
          } else {
            // Use 'other' category as fallback
            const otherCategory = await Taxonomy.findOne({ slug: 'other' });
            if (otherCategory) {
              petition.categoryId = otherCategory._id;
              petition.category = undefined;
              await petition.save();
              this.log(`Migrated petition to 'other' category: ${petition.title}`);
            }
          }
        }
      } catch (error) {
        this.log(`Error migrating petition ${petition.title}: ${error.message}`);
      }
    }
  }

  async createPetitionMetrics() {
    this.log('Creating petition metrics...');
    
    const petitions = await Petition.find({});
    
    for (const petition of petitions) {
      try {
        // Check if metrics already exist
        const existingMetrics = await PetitionMetrics.findOne({ petitionId: petition._id });
        if (existingMetrics) {
          continue;
        }

        // Calculate metrics from existing data
        const voteCount = await Vote.countDocuments({ petition: petition._id, isActive: true });
        
        // Get vigor total from votes
        const votes = await Vote.find({ petition: petition._id });
        const voteIds = votes.map(v => v._id);
        const vigorData = await Vigor.aggregate([
          { $match: { vote: { $in: voteIds }, isActive: true } },
          { $group: { _id: null, totalVigor: { $sum: '$vigorAmount' }, vigorCount: { $sum: 1 } } }
        ]);

        const totalVigor = vigorData.length > 0 ? vigorData[0].totalVigor : 0;
        const vigorCount = vigorData.length > 0 ? vigorData[0].vigorCount : 0;

        // Create metrics
        await PetitionMetrics.create({
          petitionId: petition._id,
          voteCount,
          vigorCount,
          totalVigor,
          trendingScore: 0 // Will be calculated by worker
        });

        this.log(`Created metrics for petition: ${petition.title}`);
      } catch (error) {
        this.log(`Error creating metrics for petition ${petition.title}: ${error.message}`);
      }
    }
  }

  async runMigration() {
    try {
      this.log('Starting migration...');
      
      await this.createDefaultRoles();
      await this.createDefaultTaxonomy();
      await this.migrateUsers();
      await this.migratePetitions();
      await this.createPetitionMetrics();
      
      this.log('Migration completed successfully!');
      this.log(`Migration log: ${this.migrationLog.length} entries`);
      
      return {
        success: true,
        log: this.migrationLog
      };
    } catch (error) {
      this.log(`Migration failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        log: this.migrationLog
      };
    }
  }
}

module.exports = MigrationManager;
