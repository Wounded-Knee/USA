const mongoose = require('mongoose');
const Vigor = require('../models/Vigor');
const Vote = require('../models/Vote');
const Petition = require('../models/Petition');
const User = require('../models/User');
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

// Check vigor state
const checkVigorState = async () => {
  try {
    console.log('🔍 Checking vigor state...\n');

    // Total counts
    const totalVotes = await Vote.countDocuments();
    const votesWithVigor = await Vote.countDocuments({ totalVigor: { $gt: 0 } });
    const totalVigor = await Vigor.countDocuments();

    console.log('📊 Overall Statistics:');
    console.log(`Total Votes: ${totalVotes}`);
    console.log(`Votes with Vigor: ${votesWithVigor} (${Math.round((votesWithVigor / totalVotes) * 100)}%)`);
    console.log(`Total Vigor Contributions: ${totalVigor}`);

    // Vigor by type
    const vigorByType = await Vigor.aggregate([
      { $group: { _id: '$vigorType', count: { $sum: 1 }, total: { $sum: '$vigorAmount' }, avg: { $avg: '$vigorAmount' } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n🎯 Vigor by Type:');
    vigorByType.forEach(type => {
      console.log(`  ${type._id}: ${type.count} contributions, ${type.total} total vigor, ${Math.round(type.avg)} avg`);
    });

    // Top petitions by vigor
    const topPetitions = await Vigor.aggregate([
      { $lookup: { from: 'petitions', localField: 'petition', foreignField: '_id', as: 'petition' } },
      { $unwind: '$petition' },
      { $group: { _id: '$petition.title', count: { $sum: 1 }, total: { $sum: '$vigorAmount' }, avg: { $avg: '$vigorAmount' } } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);

    console.log('\n🏆 Top Petitions by Vigor:');
    topPetitions.forEach((petition, index) => {
      console.log(`  ${index + 1}. ${petition._id}`);
      console.log(`     ${petition.total} total vigor (${petition.count} contributions, ${Math.round(petition.avg)} avg)`);
    });

    // Vigor distribution
    const vigorDistribution = await Vigor.aggregate([
      { $group: { _id: null, min: { $min: '$vigorAmount' }, max: { $max: '$vigorAmount' }, avg: { $avg: '$vigorAmount' } } }
    ]);

    if (vigorDistribution.length > 0) {
      const stats = vigorDistribution[0];
      console.log('\n📈 Vigor Distribution:');
      console.log(`  Min: ${stats.min}`);
      console.log(`  Max: ${stats.max}`);
      console.log(`  Average: ${Math.round(stats.avg)}`);
    }

    // Recent vigor activity
    const recentVigor = await Vigor.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('petition', 'title')
      .populate('user', 'username');

    console.log('\n🕒 Recent Vigor Activity:');
    recentVigor.forEach(vigor => {
      console.log(`  ${vigor.vigorType} vigor (${vigor.vigorAmount} points) on "${vigor.petition.title}" by ${vigor.user.username}`);
    });

    // Check petition thresholds
    const petitionsWithVigor = await Petition.find({ totalVigor: { $gt: 0 } }).sort({ totalVigor: -1 });
    
    console.log('\n🎯 Petition Threshold Analysis:');
    petitionsWithVigor.forEach(petition => {
      const thresholdReduction = Math.round((1 - petition.vigorReducedThreshold / petition.notificationThreshold) * 100);
      console.log(`  ${petition.title}:`);
      console.log(`    ${petition.totalVigor} vigor → ${thresholdReduction}% threshold reduction`);
      console.log(`    Notification threshold: ${petition.notificationThreshold} → ${petition.vigorReducedThreshold}`);
    });

  } catch (error) {
    console.error('❌ Error checking vigor state:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await checkVigorState();
  console.log('\n🏁 Vigor check completed');
  process.exit(0);
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { checkVigorState };
