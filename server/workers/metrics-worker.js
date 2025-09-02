const PetitionMetrics = require('../models/PetitionMetrics');
const Vote = require('../models/Vote');
const Vigor = require('../models/Vigor');

/**
 * Worker process for updating PetitionMetrics
 * This ensures data consistency by updating metrics from the source data
 */
class MetricsWorker {
  constructor() {
    this.isRunning = false;
    this.updateQueue = new Set();
  }

  /**
   * Queue a petition for metrics update
   */
  queueUpdate(petitionId) {
    this.updateQueue.add(petitionId.toString());
    
    if (!this.isRunning) {
      this.processQueue();
    }
  }

  /**
   * Process the update queue
   */
  async processQueue() {
    if (this.isRunning || this.updateQueue.size === 0) {
      return;
    }

    this.isRunning = true;
    const petitionIds = Array.from(this.updateQueue);
    this.updateQueue.clear();

    try {
      for (const petitionId of petitionIds) {
        await this.updatePetitionMetrics(petitionId);
      }
    } catch (error) {
      console.error('Metrics worker error:', error);
    } finally {
      this.isRunning = false;
      
      // Process any new items that were added while processing
      if (this.updateQueue.size > 0) {
        setImmediate(() => this.processQueue());
      }
    }
  }

  /**
   * Update metrics for a specific petition
   */
  async updatePetitionMetrics(petitionId) {
    try {
      // Get vote count
      const voteCount = await Vote.countDocuments({ 
        petition: petitionId, 
        isActive: true 
      });

      // Get vigor statistics
      const votes = await Vote.find({ petition: petitionId });
      const voteIds = votes.map(v => v._id);
      
      const vigorStats = await Vigor.aggregate([
        { 
          $match: { 
            vote: { $in: voteIds }, 
            isActive: true 
          } 
        },
        { 
          $group: { 
            _id: null, 
            totalVigor: { $sum: '$vigorAmount' }, 
            vigorCount: { $sum: 1 } 
          } 
        }
      ]);

      const totalVigor = vigorStats.length > 0 ? vigorStats[0].totalVigor : 0;
      const vigorCount = vigorStats.length > 0 ? vigorStats[0].vigorCount : 0;

      // Calculate trending score (simple algorithm - can be enhanced)
      const trendingScore = this.calculateTrendingScore(voteCount, totalVigor, petitionId);

      // Update or create metrics
      await PetitionMetrics.findOneAndUpdate(
        { petitionId },
        {
          voteCount,
          vigorCount,
          totalVigor,
          trendingScore,
          updatedAt: new Date()
        },
        { 
          upsert: true, 
          new: true 
        }
      );

      console.log(`Updated metrics for petition ${petitionId}: ${voteCount} votes, ${totalVigor} vigor`);
    } catch (error) {
      console.error(`Error updating metrics for petition ${petitionId}:`, error);
    }
  }

  /**
   * Calculate trending score for a petition
   * This is a simple algorithm that can be enhanced
   */
  calculateTrendingScore(voteCount, totalVigor, petitionId) {
    // Simple trending algorithm: votes + vigor/100
    // In production, this could include time decay, engagement metrics, etc.
    return voteCount + (totalVigor / 100);
  }

  /**
   * Update metrics for all petitions (for initial setup)
   */
  async updateAllPetitions() {
    try {
      const Petition = require('../models/Petition');
      const petitions = await Petition.find({}).select('_id');
      
      console.log(`Updating metrics for ${petitions.length} petitions...`);
      
      for (const petition of petitions) {
        await this.updatePetitionMetrics(petition._id);
      }
      
      console.log('All petition metrics updated successfully');
    } catch (error) {
      console.error('Error updating all petition metrics:', error);
    }
  }
}

// Create singleton instance
const metricsWorker = new MetricsWorker();

module.exports = metricsWorker;
