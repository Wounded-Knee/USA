const mongoose = require('mongoose');
require('dotenv').config();

async function checkDBConnection() {
  try {
    console.log('🔌 Checking database connection...\n');
    
    // Show the connection string (without password)
    const uri = process.env.MONGODB_URI;
    if (uri) {
      const sanitizedUri = uri.replace(/(mongodb\+srv?:\/\/[^:]+:)[^@]+@/, '$1***@');
      console.log(`📋 MONGODB_URI: ${sanitizedUri}`);
      
      // Extract database name from URI
      const dbMatch = uri.match(/mongodb\+srv?:\/\/[^\/]+\/([^?]+)/);
      if (dbMatch) {
        console.log(`📊 Database name from URI: ${dbMatch[1]}`);
      } else {
        console.log(`⚠️ No database name found in URI`);
      }
    } else {
      console.log('❌ MONGODB_URI not set');
      return;
    }
    
    // Connect to database
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Get actual connection details
    const dbName = mongoose.connection.db.databaseName;
    const host = mongoose.connection.host;
    const port = mongoose.connection.port;
    
    console.log(`\n📊 Actual connection details:`);
    console.log(`  Database: ${dbName}`);
    console.log(`  Host: ${host}`);
    console.log(`  Port: ${port}`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📚 Collections in database '${dbName}':`);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check if identities collection exists
    const identitiesCollection = collections.find(col => col.name === 'identities');
    if (identitiesCollection) {
      console.log(`\n✅ Identities collection found`);
      
      // Count documents
      const count = await mongoose.connection.db.collection('identities').countDocuments();
      console.log(`📊 Total identities: ${count}`);
    } else {
      console.log(`\n❌ Identities collection not found`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run if this script is executed directly
if (require.main === module) {
  checkDBConnection();
}

module.exports = checkDBConnection;
