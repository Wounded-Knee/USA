const mongoose = require('mongoose');
const Identity = require('../models/Identity');
require('dotenv').config();

async function checkIdentities() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    // Count total identities
    const total = await Identity.countDocuments();
    console.log(`📊 Total identities in database: ${total}`);

    if (total > 0) {
      // Get top-level categories
      const topLevel = await Identity.find({ level: 0 }).select('id name slug abbr color');
      console.log(`\n🏛️ Top-level categories (${topLevel.length}):`);
      topLevel.forEach(identity => {
        console.log(`  - ${identity.name} (${identity.abbr}) - ${identity.color}`);
      });

      // Get some sample identities
      const samples = await Identity.find().limit(5).select('id name level parentId');
      console.log(`\n📝 Sample identities:`);
      samples.forEach(identity => {
        console.log(`  - ID ${identity.id}: ${identity.name} (Level ${identity.level}, Parent: ${identity.parentId || 'None'})`);
      });

      // Check hierarchy
      const partisan = await Identity.findOne({ slug: 'partisan' });
      if (partisan) {
        const democrats = await Identity.find({ path: { $in: [partisan.id] } }).select('id name level');
        console.log(`\n🔵 Democrats (${democrats.length}):`);
        democrats.forEach(d => {
          console.log(`  - ${d.name} (Level ${d.level})`);
        });
      }
    } else {
      console.log('❌ No identities found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run if this script is executed directly
if (require.main === module) {
  checkIdentities();
}

module.exports = checkIdentities;
