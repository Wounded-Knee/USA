const mongoose = require('mongoose');
const MigrationManager = require('../utils/migration');
require('dotenv').config();

async function runMigration() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Run migration
    const migrationManager = new MigrationManager();
    const result = await migrationManager.runMigration();

    if (result.success) {
      console.log('\n✅ Migration completed successfully!');
      console.log(`📝 Migration log: ${result.log.length} entries`);
    } else {
      console.error('\n❌ Migration failed!');
      console.error(`Error: ${result.error}`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');

    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('Migration script error:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
