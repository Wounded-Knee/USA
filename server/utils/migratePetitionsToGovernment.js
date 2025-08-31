const mongoose = require('mongoose');
const Petition = require('../models/Petition');
const { Jurisdiction } = require('../models/Government');

/**
 * Migration script to link existing petitions to government entities
 * This script will:
 * 1. Create a default federal jurisdiction if it doesn't exist
 * 2. Link all existing petitions to the federal jurisdiction
 * 3. Update petition data to include government entity references
 */
const migratePetitionsToGovernment = async () => {
  try {
    console.log('Starting petition to government entity migration...');

    // Step 1: Create default federal jurisdiction if it doesn't exist
    let federalJurisdiction = await Jurisdiction.findOne({ slug: 'usa' });
    
    if (!federalJurisdiction) {
      console.log('Creating default federal jurisdiction...');
      federalJurisdiction = new Jurisdiction({
        name: 'United States of America',
        slug: 'usa',
        level: 'federal',
        entity_type: 'jurisdiction',
        path: '/usa',
        depth: 0
      });
      await federalJurisdiction.save();
      console.log('Created federal jurisdiction:', federalJurisdiction._id);
    } else {
      console.log('Federal jurisdiction already exists:', federalJurisdiction._id);
    }

    // Step 2: Find all petitions without jurisdiction
    const petitionsWithoutJurisdiction = await Petition.find({ 
      jurisdiction: { $exists: false } 
    });

    console.log(`Found ${petitionsWithoutJurisdiction.length} petitions without jurisdiction`);

    if (petitionsWithoutJurisdiction.length === 0) {
      console.log('No petitions need migration. Exiting...');
      return;
    }

    // Step 3: Update all petitions to link to federal jurisdiction
    const updatePromises = petitionsWithoutJurisdiction.map(petition => {
      return Petition.findByIdAndUpdate(
        petition._id,
        { 
          jurisdiction: federalJurisdiction._id,
          $setOnInsert: { createdAt: petition.createdAt }
        },
        { 
          new: true,
          upsert: false
        }
      );
    });

    await Promise.all(updatePromises);
    console.log(`Successfully migrated ${petitionsWithoutJurisdiction.length} petitions to federal jurisdiction`);

    // Step 4: Verify migration
    const totalPetitions = await Petition.countDocuments();
    const petitionsWithJurisdiction = await Petition.countDocuments({ jurisdiction: { $exists: true } });
    
    console.log(`Migration verification:`);
    console.log(`- Total petitions: ${totalPetitions}`);
    console.log(`- Petitions with jurisdiction: ${petitionsWithJurisdiction}`);
    console.log(`- Migration success rate: ${((petitionsWithJurisdiction / totalPetitions) * 100).toFixed(2)}%`);

    console.log('Petition migration completed successfully!');
  } catch (error) {
    console.error('Error during petition migration:', error);
    throw error;
  }
};

/**
 * Helper function to create state jurisdictions
 * This can be used to create more specific jurisdictions later
 */
const createStateJurisdictions = async () => {
  const states = [
    { name: 'California', slug: 'california', level: 'state' },
    { name: 'New York', slug: 'new-york', level: 'state' },
    { name: 'Texas', slug: 'texas', level: 'state' },
    { name: 'Florida', slug: 'florida', level: 'state' },
    { name: 'Illinois', slug: 'illinois', level: 'state' }
  ];

  const federalJurisdiction = await Jurisdiction.findOne({ slug: 'usa' });
  if (!federalJurisdiction) {
    throw new Error('Federal jurisdiction not found. Run migration first.');
  }

  for (const state of states) {
    const existingState = await Jurisdiction.findOne({ slug: state.slug });
    if (!existingState) {
      const newState = new Jurisdiction({
        name: state.name,
        slug: state.slug,
        level: state.level,
        entity_type: 'jurisdiction',
        parent: federalJurisdiction._id,
        path: `/usa/${state.slug}`,
        depth: 1
      });
      await newState.save();
      console.log(`Created state jurisdiction: ${state.name}`);
    }
  }
};

// Export for use in other scripts
module.exports = {
  migratePetitionsToGovernment,
  createStateJurisdictions
};

// Run migration if this script is executed directly
if (require.main === module) {
  // Load environment variables
  require('dotenv').config();
  
  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/usa';
  
  console.log('Connecting to MongoDB...');
  console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return migratePetitionsToGovernment();
    })
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
