require('dotenv').config();
const { connectDB } = require('./database');
const { Position, Office } = require('../models/Government');
const User = require('../models/User');

// ------------------------------
// Sample Position Data
// ------------------------------

const samplePositions = [
  {
    officeSlug: 'us-president',
    username: 'joelkramer',
    term_start: '2021-01-20',
    term_end: '2025-01-20',
    party: 'Democratic',
    status: 'active',
    is_current: true
  },
  {
    officeSlug: 'us-vice-president',
    username: 'joelkramer',
    term_start: '2021-01-20',
    term_end: '2025-01-20',
    party: 'Democratic',
    status: 'active',
    is_current: true
  },
  {
    officeSlug: 'us-senator',
    username: 'joelkramer',
    term_start: '2021-01-03',
    term_end: '2027-01-03',
    party: 'Democratic',
    status: 'active',
    is_current: true
  },
  {
    officeSlug: 'us-representative',
    username: 'joelkramer',
    term_start: '2023-01-03',
    term_end: '2025-01-03',
    party: 'Democratic',
    status: 'active',
    is_current: true
  },
  {
    officeSlug: 'ca-governor',
    username: 'joelkramer',
    term_start: '2023-01-02',
    term_end: '2027-01-02',
    party: 'Democratic',
    status: 'active',
    is_current: true
  },
  {
    officeSlug: 'ca-state-senator',
    username: 'joelkramer',
    term_start: '2022-12-05',
    term_end: '2026-12-05',
    party: 'Democratic',
    status: 'active',
    is_current: true
  },
  {
    officeSlug: 'ca-assembly-member',
    username: 'joelkramer',
    term_start: '2022-12-05',
    term_end: '2024-12-05',
    party: 'Democratic',
    status: 'active',
    is_current: true
  }
];

// ------------------------------
// Seed Function
// ------------------------------

async function seedPositions() {
  try {
    console.log('🚀 Starting position seeding...');
    
    // Connect to database
    await connectDB();
    
    // Check if positions already exist for the main offices
    const mainOfficeSlugs = ['us-president', 'us-vice-president', 'us-senator', 'us-representative', 'ca-governor'];
    const mainOffices = await Office.find({ slug: { $in: mainOfficeSlugs } });
    const existingMainPositions = await Position.find({ 
      office: { $in: mainOffices.map(o => o._id) },
      is_current: true 
    });
    
    if (existingMainPositions.length >= mainOfficeSlugs.length) {
      console.log('⚠️ Main office positions already exist. Skipping seeding.');
      return;
    }
    
    // Get all offices
    const offices = await Office.find({});
    console.log(`📊 Found ${offices.length} offices`);
    
    // Get or create Joel Kramer user
    let joelKramer = await User.findOne({ username: 'joelkramer' });
    if (!joelKramer) {
      console.log('Creating Joel Kramer user...');
      joelKramer = new User({
        username: 'joelkramer',
        email: 'joel.kramer@example.com',
        firstName: 'Joel',
        lastName: 'Kramer',
        password: 'tempPassword123',
        authMethod: 'local',
        roles: ['Developer'],
        isActive: true,
        emailVerified: true
      });
      await joelKramer.save();
      console.log('✅ Created Joel Kramer user');
    } else {
      console.log('✅ Found existing Joel Kramer user');
    }
    
    // Create positions for each office
    let createdCount = 0;
    for (const positionData of samplePositions) {
      const office = offices.find(o => o.slug === positionData.officeSlug);
      
      if (office) {
        const position = new Position({
          office: office._id,
          person: joelKramer._id,
          term_start: new Date(positionData.term_start),
          term_end: new Date(positionData.term_end),
          party: positionData.party,
          status: positionData.status,
          is_current: positionData.is_current
        });
        
        await position.save();
        console.log(`✅ Created position: ${office.name} - ${joelKramer.firstName} ${joelKramer.lastName}`);
        createdCount++;
      } else {
        console.log(`⚠️ Office not found: ${positionData.officeSlug}`);
      }
    }
    
    console.log(`🎉 Position seeding completed! Created ${createdCount} positions`);
    
  } catch (error) {
    console.error('❌ Error seeding positions:', error);
    throw error;
  }
}

// ------------------------------
// Export and Run
// ------------------------------

module.exports = { seedPositions };

// Run if called directly
if (require.main === module) {
  seedPositions()
    .then(() => {
      console.log('✅ Position seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Position seeding failed:', error);
      process.exit(1);
    });
}
