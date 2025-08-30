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

// Enhanced vigor data generation with more realistic patterns
const generateRealisticVigorData = (type, intensity = 'medium') => {
  const intensityMultipliers = {
    low: { min: 0.3, max: 0.6 },
    medium: { min: 0.5, max: 0.8 },
    high: { min: 0.7, max: 1.0 }
  };

  const multiplier = intensityMultipliers[intensity] || intensityMultipliers.medium;

  switch (type) {
    case 'shake':
      return {
        shakeIntensity: Math.floor((Math.random() * 60 + 40) * multiplier.max), // 40-100
        shakeDuration: Math.floor((Math.random() * 20 + 10) * multiplier.max),  // 10-30 seconds
        shakeCount: Math.floor((Math.random() * 30 + 20) * multiplier.max),     // 20-50 shakes
        completionTime: Math.floor((Math.random() * 20 + 10) * multiplier.max),
        focusScore: Math.floor((Math.random() * 30 + 70) * multiplier.max),     // 70-100
        emotionalIntensity: Math.floor((Math.random() * 40 + 60) * multiplier.max) // 60-100
      };
    case 'voice':
      return {
        voiceConfidence: Math.floor((Math.random() * 30 + 70) * multiplier.max), // 70-100
        voiceDuration: Math.floor((Math.random() * 35 + 25) * multiplier.max),   // 25-60 seconds
        voiceClarity: Math.floor((Math.random() * 20 + 80) * multiplier.max),    // 80-100
        completionTime: Math.floor((Math.random() * 35 + 25) * multiplier.max),
        focusScore: Math.floor((Math.random() * 20 + 80) * multiplier.max),      // 80-100
        emotionalIntensity: Math.floor((Math.random() * 30 + 70) * multiplier.max) // 70-100
      };
    case 'statement':
      const emotions = ['passionate', 'angry', 'determined', 'concerned', 'hopeful'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const statementLength = Math.floor((Math.random() * 300 + 200) * multiplier.max); // 200-500 chars
      return {
        statementText: generateRealisticStatement(emotion, statementLength),
        statementLength,
        statementEmotion: emotion,
        completionTime: Math.floor((Math.random() * 90 + 60) * multiplier.max), // 60-150 seconds
        focusScore: Math.floor((Math.random() * 20 + 80) * multiplier.max),     // 80-100
        emotionalIntensity: Math.floor((Math.random() * 30 + 70) * multiplier.max) // 70-100
      };
    default:
      return {};
  }
};

// Generate more realistic statements based on emotion
const generateRealisticStatement = (emotion, length) => {
  const baseStatements = {
    passionate: [
      "I am deeply passionate about this cause and believe it represents a fundamental shift in how we approach this issue. The urgency of this matter cannot be overstated, and I am committed to seeing real change happen.",
      "This initiative speaks to my core values and I feel a strong personal connection to its goals. I'm willing to put in the time and effort to make this vision a reality.",
      "I'm fired up about this petition and ready to fight for what I believe in. This is exactly the kind of change our community needs right now."
    ],
    angry: [
      "I'm absolutely furious about the current state of affairs and something needs to change immediately. This petition represents the frustration that many of us are feeling.",
      "I'm outraged by the lack of action on this issue and demand immediate attention. This is unacceptable and cannot continue.",
      "I'm angry about the injustice I see and this petition gives me hope that we can finally address these problems head-on."
    ],
    determined: [
      "I'm determined to see this through to the end, no matter what obstacles we face. This cause is worth fighting for.",
      "I will not give up on this issue until we see meaningful progress. My commitment to this cause is unwavering.",
      "I'm resolved to make a difference and this petition is the first step toward achieving our goals."
    ],
    concerned: [
      "I'm deeply concerned about the implications of not addressing this issue. We need to take action before it's too late.",
      "This matter worries me greatly and I believe we need to act with urgency. The consequences of inaction are too serious to ignore.",
      "I'm troubled by the current situation and feel compelled to support this initiative. We must address these concerns."
    ],
    hopeful: [
      "I'm hopeful that this petition will lead to positive change and a better future for all of us. This gives me optimism about what we can achieve together.",
      "I believe in the power of collective action and am hopeful that this initiative will make a real difference in people's lives.",
      "This petition represents hope for a better tomorrow and I'm excited to be part of this movement for positive change."
    ]
  };

  const statements = baseStatements[emotion] || baseStatements.passionate;
  let statement = statements[Math.floor(Math.random() * statements.length)];
  
  // Extend statement to match desired length
  while (statement.length < length) {
    statement += " " + statements[Math.floor(Math.random() * statements.length)];
  }
  
  return statement.substring(0, length);
};

// Generate realistic signing statements
const generateRealisticSigningStatement = (petitionCategory) => {
  const categoryStatements = {
    environment: [
      "Our planet's future depends on actions like this. I'm committed to environmental protection.",
      "Climate action cannot wait. This petition represents the urgent change we need.",
      "I care deeply about preserving our natural world for future generations."
    ],
    education: [
      "Education is the foundation of a strong society. This initiative will benefit countless students.",
      "Every child deserves access to quality education. This petition supports that fundamental right.",
      "Investing in education is investing in our future. I strongly support this cause."
    ],
    healthcare: [
      "Healthcare is a human right. This petition will help ensure access for everyone.",
      "I believe everyone deserves quality healthcare regardless of their circumstances.",
      "This healthcare initiative will save lives and improve our community's well-being."
    ],
    economy: [
      "Economic justice is essential for a fair society. This petition addresses important inequalities.",
      "I support policies that create opportunity for all, not just the privileged few.",
      "This economic initiative will strengthen our community and create lasting prosperity."
    ],
    'civil-rights': [
      "Civil rights are the foundation of our democracy. This petition protects essential freedoms.",
      "I stand for equality and justice for all people. This cause is fundamental to our values.",
      "Human rights must be protected and expanded. This petition advances that crucial goal."
    ],
    'foreign-policy': [
      "Our foreign policy should reflect our values of peace and cooperation. This petition supports that vision.",
      "International relations matter for our security and prosperity. This initiative promotes positive engagement.",
      "I believe in diplomacy and peaceful solutions to global challenges."
    ]
  };

  const statements = categoryStatements[petitionCategory] || [
    "I strongly support this initiative and believe it will make a positive impact.",
    "This cause is important to me and I want to see real change happen.",
    "I'm committed to making a difference and this petition is a step in the right direction."
  ];

  return statements[Math.floor(Math.random() * statements.length)];
};

// Advanced vigor seeding with options
const seedVigorAdvanced = async (options = {}) => {
  const {
    petitionId = null,
    percentage = 70,
    intensity = 'medium',
    vigorTypes = ['shake', 'voice', 'statement'],
    maxVigorPerVote = 1
  } = options;

  try {
    console.log('🌱 Starting advanced vigor seeding...');

    // Build query for votes
    let voteQuery = {};
    if (petitionId) {
      voteQuery.petition = petitionId;
      console.log(`🎯 Targeting petition: ${petitionId}`);
    }

    const votes = await Vote.find(voteQuery).populate('petition');
    console.log(`📊 Found ${votes.length} votes to process`);

    let vigorCount = 0;
    let totalVigorPoints = 0;

    for (const vote of votes) {
      // Skip if vote already has vigor
      const existingVigor = await Vigor.findOne({ vote: vote._id });
      if (existingVigor) {
        continue;
      }

      // Randomly decide if this vote should have vigor
      if (Math.random() * 100 > percentage) {
        continue;
      }

      // Determine number of vigor contributions for this vote (1 to maxVigorPerVote)
      const vigorContributions = Math.floor(Math.random() * maxVigorPerVote) + 1;

      for (let i = 0; i < vigorContributions; i++) {
        // Choose random vigor type
        const vigorType = vigorTypes[Math.floor(Math.random() * vigorTypes.length)];
        
        // Generate vigor data
        const activityData = generateRealisticVigorData(vigorType, intensity);
        const vigorAmount = calculateVigorAmount(vigorType, activityData);
        const signingStatement = generateRealisticSigningStatement(vote.petition.category);

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
        totalVigorPoints += vigorAmount;
        vigorCount++;
      }

      // Update vote with vigor totals
      const voteVigor = await Vigor.find({ vote: vote._id });
      const totalVoteVigor = voteVigor.reduce((sum, v) => sum + v.vigorAmount, 0);
      
      vote.totalVigor = totalVoteVigor;
      vote.vigorCount = voteVigor.length;
      vote.signingStatement = voteVigor[0]?.signingStatement || '';
      await vote.save();

      // Update petition vigor totals
      await updatePetitionVigor(vote.petition._id);

      console.log(`✅ Added ${vigorContributions} vigor contributions (${totalVoteVigor} points) to vote ${vote._id}`);
    }

    console.log(`🎉 Successfully seeded ${vigorCount} vigor contributions (${totalVigorPoints} total points)`);
    
    // Display detailed summary
    await displayVigorSummary();

  } catch (error) {
    console.error('❌ Error seeding vigor data:', error);
  }
};

// Display comprehensive vigor summary
const displayVigorSummary = async () => {
  console.log('\n📈 Detailed Vigor Summary:');
  
  // Total vigor
  const totalVigor = await Vigor.aggregate([
    { $group: { _id: null, total: { $sum: '$vigorAmount' } } }
  ]);

  // Vigor by type
  const vigorByType = await Vigor.aggregate([
    { $group: { _id: '$vigorType', count: { $sum: 1 }, total: { $sum: '$vigorAmount' }, avg: { $avg: '$vigorAmount' } } }
  ]);

  // Vigor by petition
  const vigorByPetition = await Vigor.aggregate([
    { $lookup: { from: 'petitions', localField: 'petition', foreignField: '_id', as: 'petition' } },
    { $unwind: '$petition' },
    { $group: { _id: '$petition.title', count: { $sum: 1 }, total: { $sum: '$vigorAmount' } } },
    { $sort: { total: -1 } },
    { $limit: 10 }
  ]);

  console.log(`Total Vigor Points: ${totalVigor[0]?.total || 0}`);
  console.log('\nBy Type:');
  vigorByType.forEach(type => {
    console.log(`  ${type._id}: ${type.count} contributions, ${type.total} total vigor, ${Math.round(type.avg)} avg`);
  });

  console.log('\nTop Petitions by Vigor:');
  vigorByPetition.forEach((petition, index) => {
    console.log(`  ${index + 1}. ${petition._id}: ${petition.total} vigor (${petition.count} contributions)`);
  });
};

// Command line interface
const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--petition':
        options.petitionId = args[++i];
        break;
      case '--percentage':
        options.percentage = parseInt(args[++i]);
        break;
      case '--intensity':
        options.intensity = args[++i];
        break;
      case '--types':
        options.vigorTypes = args[++i].split(',');
        break;
      case '--max-per-vote':
        options.maxVigorPerVote = parseInt(args[++i]);
        break;
      case '--help':
        console.log(`
Usage: node seedVigorAdvanced.js [options]

Options:
  --petition <id>        Target specific petition ID
  --percentage <num>     Percentage of votes to add vigor to (default: 70)
  --intensity <level>    Vigor intensity: low, medium, high (default: medium)
  --types <list>         Comma-separated vigor types: shake,voice,statement
  --max-per-vote <num>   Maximum vigor contributions per vote (default: 1)
  --help                 Show this help message

Examples:
  node seedVigorAdvanced.js
  node seedVigorAdvanced.js --petition 507f1f77bcf86cd799439011
  node seedVigorAdvanced.js --percentage 50 --intensity high
  node seedVigorAdvanced.js --types shake,voice --max-per-vote 3
        `);
        process.exit(0);
    }
  }

  return options;
};

// Main execution
const main = async () => {
  const options = parseArgs();
  
  await connectDB();
  await seedVigorAdvanced(options);
  console.log('🏁 Advanced vigor seeding completed');
  process.exit(0);
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { seedVigorAdvanced, displayVigorSummary };
