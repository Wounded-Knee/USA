'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface VigorLeaderboardEntry {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  totalVigor: number;
  contributionCount: number;
  averageVigor: number;
}

interface VigorLeaderboardProps {
  timeFrame?: 'day' | 'week' | 'month' | 'all';
  limit?: number;
  showTitle?: boolean;
}

const VigorLeaderboard: React.FC<VigorLeaderboardProps> = ({ 
  timeFrame: initialTimeFrame = 'week', 
  limit = 10, 
  showTitle = true 
}) => {
  const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
  const [leaderboard, setLeaderboard] = useState<VigorLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFrame, limit]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the new v1 API endpoint for vigor analytics
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/analytics/vigor?sort=-totalVigor&page=1&page_size=${limit}`);
      
      if (response.data && response.data.data) {
        setLeaderboard(response.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch vigor leaderboard:', error);
      if (error.response?.status === 401) {
        setError('Authentication required to view leaderboard');
      } else {
        setError('Failed to load leaderboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTimeFrameLabel = (timeFrame: string) => {
    const labels: { [key: string]: string } = {
      day: 'Today',
      week: 'This Week',
      month: 'This Month',
      all: 'All Time'
    };
    return labels[timeFrame] || 'This Week';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-[var(--color-warning)]';
    if (rank === 2) return 'text-[var(--color-neutral)]';
    if (rank === 3) return 'text-[var(--color-accent)]';
    return 'text-[var(--color-text-secondary)]';
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        {showTitle && (
          <div className="animate-pulse mb-6">
            <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-[var(--color-border)] rounded w-1/2"></div>
          </div>
        )}
        <div className="space-y-3">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="h-8 w-8 bg-[var(--color-border)] rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[var(--color-border)] rounded w-1/4"></div>
                <div className="h-3 bg-[var(--color-border)] rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-[var(--color-border)] rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <div className="text-center text-[var(--color-error)]">
          <p className="mb-2">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="px-4 py-2 bg-[var(--color-error)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-error)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
      {showTitle && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Vigor Leaderboard</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Top contributors for {getTimeFrameLabel(timeFrame)}
          </p>
        </div>
      )}

      {leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-[var(--color-text-secondary)] text-4xl mb-4">⚡</div>
          <p className="text-[var(--color-text-secondary)]">No vigor contributions yet</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Be the first to contribute!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-[var(--color-background)] transition-colors"
            >
              {/* Rank */}
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getRankColor(index + 1)}`}>
                  {getRankIcon(index + 1)}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-[var(--color-text)]">
                    {entry.user.firstName} {entry.user.lastName}
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)]">@{entry.user.username}</span>
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {entry.contributionCount} contribution{entry.contributionCount !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Vigor Stats */}
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-bold text-[var(--color-primary)]">
                  {entry.totalVigor.toLocaleString()}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {Math.round(entry.averageVigor)} avg
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Time Frame Selector */}
      <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">Time frame:</span>
          <div className="flex space-x-1">
            {(['day', 'week', 'month', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeFrame === tf
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]'
                }`}
              >
                {getTimeFrameLabel(tf)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VigorLeaderboard;
