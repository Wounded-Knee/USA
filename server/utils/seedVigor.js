const mongoose = require('mongoose');
const Vigor = require('../models/Vigor');
const Vote = require('../models/Vote');
const Petition = require('../models/Petition');
const { calculateVigorAmount, updatePetitionVigor } = require('./vigorUtils');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Generate random vigor data
const generateVigorData = (type) => {
  switch (type) {
    case 'shake':
      return {
        shakeIntensity: Math.floor(Math.random() * 80) + 20, // 20-100
        shakeDuration: Math.floor(Math.random() * 25) + 5,   // 5-30 seconds
        shakeCount: Math.floor(Math.random() * 40) + 10,     // 10-50 shakes
        completionTime: Math.floor(Math.random() * 25) + 5,
        focusScore: Math.floor(Math.random() * 40) + 60,     // 60-100
        emotionalIntensity: Math.floor(Math.random() * 50) + 50 // 50-100
      };
    case 'voice':
      return {
        voiceConfidence: Math.floor(Math.random() * 40) + 60, // 60-100
        voiceDuration: Math.floor(Math.random() * 45) + 15,   // 15-60 seconds
        voiceClarity: Math.floor(Math.random() * 30) + 70,    // 70-100
        completionTime: Math.floor(Math.random() * 45) + 15,
        focusScore: Math.floor(Math.random() * 30) + 70,      // 70-100
        emotionalIntensity: Math.floor(Math.random() * 40) + 60 // 60-100
      };
    case 'statement':
      const emotions = ['passionate', 'angry', 'determined', 'concerned', 'hopeful'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const statementLength = Math.floor(Math.random() * 400) + 100; // 100-500 chars
      return {
        statementText: `This is a sample statement about the importance of this cause. I believe strongly in this petition and want to express my conviction. ${emotion} statement.`,
        statementLength,
        statementEmotion: emotion,
        completionTime: Math.floor(Math.random() * 120) + 30, // 30-150 seconds
        focusScore: Math.floor(Math.random() * 30) + 70,      // 70-100
        emotionalIntensity: Math.floor(Math.random() * 40) + 60 // 60-100
      };
    default:
      return {};
  }
};

// Generate random signing statements
const generateSigningStatement = () => {
  const statements = [
    "I strongly support this initiative and believe it will make a positive impact on our community.",
    "This cause is important to me and I want to see real change happen.",
    "I'm passionate about this issue and willing to put in the effort to make a difference.",
    "This petition represents the values I believe in and I'm committed to seeing it succeed.",
    "I feel strongly about this matter and want my voice to be heard.",
    "This is a critical issue that needs immediate attention and action.",
    "I'm determined to see this through and will continue to advocate for this cause.",
    "This represents the kind of change I want to see in our society.",
    "I'm hopeful that this petition will lead to meaningful progress.",
    "This issue affects many people and I want to contribute to the solution."
  ];
  return statements[Math.floor(Math.random() * statements.length)];
};

// Seed vigor data for existing votes
const seedVigorData = async () => {
  try {
    console.log('🌱 Starting vigor seeding...');

    // Get all existing votes
    const votes = await Vote.find().populate('petition');
    console.log(`📊 Found ${votes.length} votes to process`);

    let vigorCount = 0;
    const vigorTypes = ['shake', 'voice', 'statement'];

    for (const vote of votes) {
      // Skip if vote already has vigor
      const existingVigor = await Vigor.findOne({ vote: vote._id });
      if (existingVigor) {
        console.log(`⏭️  Vote ${vote._id} already has vigor, skipping...`);
        continue;
      }

      // Randomly decide if this vote should have vigor (70% chance)
      if (Math.random() > 0.7) {
        continue;
      }

      // Choose random vigor type
      const vigorType = vigorTypes[Math.floor(Math.random() * vigorTypes.length)];
      
      // Generate vigor data
      const activityData = generateVigorData(vigorType);
      const vigorAmount = calculateVigorAmount(vigorType, activityData);
      const signingStatement = generateSigningStatement();

      // Create vigor record
      const vigor = new Vigor({
        user: vote.user,
        vote: vote._id,
        petition: vote.petition._id,
        vigorType,
        vigorAmount,
        activityData,
        signingStatement
      });

      await vigor.save();

      // Update vote with vigor totals
      vote.totalVigor = vigorAmount;
      vote.vigorCount = 1;
      vote.signingStatement = signingStatement;
      await vote.save();

      // Update petition vigor totals
      await updatePetitionVigor(vote.petition._id);

      vigorCount++;
      console.log(`✅ Added ${vigorType} vigor (${vigorAmount} points) to vote ${vote._id}`);
    }

    console.log(`🎉 Successfully seeded ${vigorCount} vigor contributions`);
    
    // Display summary
    const totalVigor = await Vigor.aggregate([
      { $group: { _id: null, total: { $sum: '$vigorAmount' } } }
    ]);

    const vigorByType = await Vigor.aggregate([
      { $group: { _id: '$vigorType', count: { $sum: 1 }, total: { $sum: '$vigorAmount' } } }
    ]);

    console.log('\n📈 Vigor Summary:');
    console.log(`Total Vigor Points: ${totalVigor[0]?.total || 0}`);
    console.log('By Type:');
    vigorByType.forEach(type => {
      console.log(`  ${type._id}: ${type.count} contributions, ${type.total} total vigor`);
    });

  } catch (error) {
    console.error('❌ Error seeding vigor data:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedVigorData();
  console.log('🏁 Vigor seeding completed');
  process.exit(0);
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { seedVigorData };
