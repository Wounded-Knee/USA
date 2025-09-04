'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Statistic {
  label: string
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
}

interface TopContributor {
  username: string
  initiativeCount: number
}

export default function Statistics() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Statistic[]>([])
  const [topContributors, setTopContributors] = useState<TopContributor[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockStats: Statistic[] = [
        { label: 'Total Users', value: 1234, change: 5, changeType: 'increase' },
        { label: 'Active Users', value: 456, change: 12, changeType: 'increase' },
        { label: 'Total Initiatives', value: 89, change: -3, changeType: 'decrease' },
        { label: 'Success Rate', value: 23, change: 2, changeType: 'increase' }
      ]
      
      const mockContributors: TopContributor[] = [
        { username: 'civic_leader_1', initiativeCount: 8 },
        { username: 'democracy_advocate', initiativeCount: 6 },
        { username: 'community_organizer', initiativeCount: 7 },
        { username: 'policy_wonk', initiativeCount: 5 },
        { username: 'grassroots_hero', initiativeCount: 4 }
      ]
      
      setStats(mockStats)
      setTopContributors(mockContributors)
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-[var(--color-border)] rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-[var(--color-border)] rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-text)] mb-2">
                {stat.label === 'Success Rate' ? `${stat.value}%` : stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] mb-1">{stat.label}</div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {stat.change > 0 ? '+' : ''}{stat.change}% from last week
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Statistics */}
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Platform Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">
              {stats.find(s => s.label === 'Total Users')?.value.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)] mb-1">Total Users</div>
            <div className="text-xs text-[var(--color-text-muted)]">
              {stats.find(s => s.label === 'Total Users')?.change || 0}% from last week
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--color-success)] mb-2">
              {stats.find(s => s.label === 'Total Votes')?.value.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)] mb-1">Total Votes</div>
            <div className="text-xs text-[var(--color-text-muted)]">
              {stats.find(s => s.label === 'Total Votes')?.change || 0}% from last week
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--color-accent)] mb-2">
              {stats.find(s => s.label === 'Total Vigor')?.value.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)] mb-1">Total Vigor</div>
            <div className="text-xs text-[var(--color-text-muted)]">
              {stats.find(s => s.label === 'Total Vigor')?.change || 0}% from last week
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--color-secondary)] mb-2">
              {stats.find(s => s.label === 'Total Initiatives')?.value.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)] mb-1">Total Initiatives</div>
            <div className="text-xs text-[var(--color-text-muted)]">
              {stats.find(s => s.label === 'Total Initiatives')?.change || 0}% from last week
            </div>
          </div>
        </div>
      </div>

      {/* Activity and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-background)] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Activity This Week</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-secondary)]">New Petitions</span>
              <span className="text-sm font-medium text-[var(--color-text)]">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-secondary)]">Votes Cast</span>
              <span className="text-sm font-medium text-[var(--color-text)]">3,456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-secondary)]">Vigor Contributed</span>
              <span className="text-sm font-medium text-[var(--color-text)]">234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-secondary)]">New Users</span>
              <span className="text-sm font-medium text-[var(--color-text)]">45</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--color-background)] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">User Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-secondary)]">Active Users</span>
              <span className="text-sm font-medium text-[var(--color-text)]">892</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-secondary)]">Active Petitions</span>
              <span className="text-sm font-medium text-[var(--color-text)]">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-secondary)]">Avg Votes per Petition</span>
              <span className="text-sm font-medium text-[var(--color-text)]">36.7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-secondary)]">Avg Vigor per User</span>
              <span className="text-sm font-medium text-[var(--color-text)]">1.9</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Top Contributors</h3>
        <div className="bg-[var(--color-background)] rounded-lg p-4">
          {topContributors.length > 0 ? (
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={contributor.username} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-[var(--color-text)]">
                        @{contributor.username}
                      </div>
                      <div className="text-sm text-[var(--color-text-muted)]">{contributor.initiativeCount} initiatives</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[var(--color-text)]">{contributor.initiativeCount} initiatives</div>
                    <div className="text-sm text-[var(--color-text-muted)]">{contributor.initiativeCount} initiatives</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[var(--color-text-muted)] py-4">
              No contributor data available yet.
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <button className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:ring-offset-2 transition-colors">
          View Detailed Analytics
        </button>
      </div>
    </div>
  )
}