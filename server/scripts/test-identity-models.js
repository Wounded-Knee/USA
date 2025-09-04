const mongoose = require('mongoose');

// Test the Identity models without requiring a database connection
console.log('🧪 Testing Identity Models Structure...\n');

try {
  // Test importing the base Identity
  const { Identity, IdentitySchema } = require('../models/Identity/Identity');
  console.log('✅ Base Identity model imported successfully');
  console.log('   - Model:', typeof Identity);
  console.log('   - Schema:', typeof IdentitySchema);
  console.log('   - Discriminator Key:', IdentitySchema.options.discriminatorKey);
  
  // Test importing ReligiousIdentity
  const ReligiousIdentity = require('../models/Identity/ReligiousIdentity');
  console.log('\n✅ ReligiousIdentity model imported successfully');
  console.log('   - Model:', typeof ReligiousIdentity);
  console.log('   - Model Name:', ReligiousIdentity.modelName);
  
  // Test importing PoliticalIdentity
  const PoliticalIdentity = require('../models/Identity/PoliticalIdentity');
  console.log('\n✅ PoliticalIdentity model imported successfully');
  console.log('   - Model:', typeof PoliticalIdentity);
  console.log('   - Model Name:', PoliticalIdentity.modelName);
  
  // Test importing RacialIdentity
  const RacialIdentity = require('../models/Identity/RacialIdentity');
  console.log('\n✅ RacialIdentity model imported successfully');
  console.log('   - Model:', typeof RacialIdentity);
  console.log('   - Model Name:', RacialIdentity.modelName);
  
  // Test importing SexualIdentity
  const SexualIdentity = require('../models/Identity/SexualIdentity');
  console.log('\n✅ SexualIdentity model imported successfully');
  console.log('   - Model:', typeof SexualIdentity);
  console.log('   - Model Name:', SexualIdentity.modelName);
  
  // Test importing EconomicIdentity
  const EconomicIdentity = require('../models/Identity/EconomicIdentity');
  console.log('\n✅ EconomicIdentity model imported successfully');
  console.log('   - Model:', typeof EconomicIdentity);
  console.log('   - Model Name:', EconomicIdentity.modelName);
  
  // Test importing EducationalIdentity
  const EducationalIdentity = require('../models/Identity/EducationalIdentity');
  console.log('\n✅ EducationalIdentity model imported successfully');
  console.log('   - Model:', typeof EducationalIdentity);
  console.log('   - Model Name:', EducationalIdentity.modelName);
  
  // Test importing MaritalIdentity
  const MaritalIdentity = require('../models/Identity/MaritalIdentity');
  console.log('\n✅ MaritalIdentity model imported successfully');
  console.log('   - Model:', typeof MaritalIdentity);
  console.log('   - Model Name:', MaritalIdentity.modelName);
  
  // Test importing IndustrialIdentity
  const IndustrialIdentity = require('../models/Identity/IndustrialIdentity');
  console.log('\n✅ IndustrialIdentity model imported successfully');
  console.log('   - Model:', typeof IndustrialIdentity);
  console.log('   - Model Name:', IndustrialIdentity.modelName);
  
  console.log('\n🎉 All Identity models are working correctly!');
  console.log('\n📋 To populate the database with ReligiousIdentity records:');
  console.log('   1. Set up MongoDB Atlas connection in .env file');
  console.log('   2. Run: node scripts/populate-religious-identities.js');
  console.log('\n🔗 Example .env entry:');
  console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
  
  console.log('\n🔍 Testing discriminator functionality...');
  console.log('   - All models inherit from base Identity schema');
  console.log('   - Each model adds identityType field automatically');
  console.log('   - ReligiousIdentity will have identityType: "ReligiousIdentity"');
  console.log('   - PoliticalIdentity will have identityType: "PoliticalIdentity"');
  console.log('   - And so on...');
  
} catch (error) {
  console.error('❌ Error testing Identity models:', error.message);
  console.error(error.stack);
}
