'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

interface PlatformStats {
  overview: {
    totalUsers: number
    totalPetitions: number
    totalVotes: number
    totalVigor: number
    totalVigorAmount: number
  }
  recentActivity: {
    votes: number
    petitions: number
    users: number
  }
  engagement: {
    avgVotesPerPetition: number
    avgVigorPerVote: number
    userEngagementRate: number
  }
  categories: Array<{
    _id: string
    totalPetitions: number
    totalVotes: number
    avgVotes: number
  }>
  vigorTypes: Array<{
    _id: string
    count: number
    totalAmount: number
    avgAmount: number
  }>
}

const Statistics: React.FC = () => {
    const [stats, setStats] = useState<PlatformStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                
                // Fetch comprehensive platform statistics
                const response = await axios.get(`${API_BASE}/data/platform-stats`)
                setStats(response.data)
                
            } catch (error) {
                console.error('Error fetching platform statistics:', error)
                // Fallback to basic user count if comprehensive endpoint fails
                try {
                    const usersResponse = await axios.get(`${API_BASE}/users`)
                    setStats({
                        overview: {
                            totalUsers: usersResponse.data.length,
                            totalPetitions: 0,
                            totalVotes: 0,
                            totalVigor: 0,
                            totalVigorAmount: 0
                        },
                        recentActivity: { votes: 0, petitions: 0, users: 0 },
                        engagement: { avgVotesPerPetition: 0, avgVigorPerVote: 0, userEngagementRate: 0 },
                        categories: [],
                        vigorTypes: []
                    })
                } catch (userError) {
                    console.error('Error fetching users:', userError)
                }
            } finally {
                setLoading(false)
            }
        }
        
        fetchStats()
    }, [])

    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
    }

    const getCategoryDisplayName = (category: string): string => {
        const categoryMap: { [key: string]: string } = {
            'environment': 'Environment',
            'education': 'Education', 
            'healthcare': 'Healthcare',
            'economy': 'Economy',
            'civil-rights': 'Civil Rights',
            'foreign-policy': 'Foreign Policy',
            'other': 'Other'
        }
        return categoryMap[category] || category
    }

    const getVigorTypeDisplayName = (type: string): string => {
        const typeMap: { [key: string]: string } = {
            'shake': 'Shake',
            'voice': 'Voice',
            'statement': 'Statement'
        }
        return typeMap[type] || type
    }

    if (loading) {
        return (
            <section id="statistics" className="py-16 bg-gradient-to-br from-primary-dark to-primary">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8 text-white">Platform Impact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-surface/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-surface/20">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-surface/20 rounded mb-4"></div>
                                    <div className="h-8 bg-surface/30 rounded mb-2"></div>
                                    <div className="h-4 bg-surface/20 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!stats) {
        return (
            <section id="statistics" className="py-16 bg-gradient-to-br from-primary-dark to-primary">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8 text-white">Platform Impact</h2>
                    <div className="text-center text-white/80">
                        <p>Unable to load platform statistics</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="statistics" className="py-16 bg-gradient-to-br from-primary-dark to-primary">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Platform Impact</h2>
                
                {/* Primary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-surface/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-surface/20">
                        <h3 className="text-xl font-bold mb-4 text-white">Active Voices</h3>
                        <p className="text-3xl font-bold text-white">{formatNumber(stats.overview.totalUsers)}</p>
                        <p className="text-sm text-white/80 mt-2">Citizens contributing to consensus</p>
                    </div>
                    <div className="bg-surface/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-surface/20">
                        <h3 className="text-xl font-bold mb-4 text-white">Petitions Created</h3>
                        <p className="text-3xl font-bold text-white">{formatNumber(stats.overview.totalPetitions)}</p>
                        <p className="text-sm text-white/80 mt-2">Issues brought to the platform</p>
                    </div>
                    <div className="bg-surface/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-surface/20">
                        <h3 className="text-xl font-bold mb-4 text-white">Total Votes</h3>
                        <p className="text-3xl font-bold text-white">{formatNumber(stats.overview.totalVotes)}</p>
                        <p className="text-sm text-white/80 mt-2">Democratic participation</p>
                    </div>
                    <div className="bg-surface/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-surface/20">
                        <h3 className="text-xl font-bold mb-4 text-white">Vigor Generated</h3>
                        <p className="text-3xl font-bold text-white">{formatNumber(stats.overview.totalVigorAmount)}</p>
                        <p className="text-sm text-white/80 mt-2">Collective energy measured</p>
                    </div>
                </div>
                
                {/* Secondary Statistics */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-surface/5 backdrop-blur-sm p-6 rounded-lg shadow-md border border-surface/10">
                        <h3 className="text-lg font-bold mb-3 text-white">Recent Activity</h3>
                        <p className="text-2xl font-bold text-white">{stats.recentActivity.votes}</p>
                        <p className="text-sm text-white/70 mt-1">Votes this week</p>
                        <p className="text-xs text-white/60 mt-1">
                            +{stats.recentActivity.petitions} new petitions, +{stats.recentActivity.users} new users
                        </p>
                    </div>
                    <div className="bg-surface/5 backdrop-blur-sm p-6 rounded-lg shadow-md border border-surface/10">
                        <h3 className="text-lg font-bold mb-3 text-white">Engagement Rate</h3>
                        <p className="text-2xl font-bold text-white">{stats.engagement.userEngagementRate}%</p>
                        <p className="text-sm text-white/70 mt-1">Active participation</p>
                        <p className="text-xs text-white/60 mt-1">
                            {stats.engagement.avgVotesPerPetition} avg votes per petition
                        </p>
                    </div>
                    <div className="bg-surface/5 backdrop-blur-sm p-6 rounded-lg shadow-md border border-surface/10">
                        <h3 className="text-lg font-bold mb-3 text-white">Top Category</h3>
                        {stats.categories.length > 0 ? (
                            <>
                                <p className="text-2xl font-bold text-white">
                                    {getCategoryDisplayName(stats.categories[0]._id)}
                                </p>
                                <p className="text-sm text-white/70 mt-1">
                                    {stats.categories[0].totalVotes} votes
                                </p>
                                <p className="text-xs text-white/60 mt-1">
                                    {stats.categories[0].totalPetitions} petitions
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-2xl font-bold text-white">-</p>
                                <p className="text-sm text-white/70 mt-1">No data yet</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Vigor Type Breakdown */}
                {stats.vigorTypes.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-center mb-6 text-white">Vigor Contributions by Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.vigorTypes.map((type) => (
                                <div key={type._id} className="bg-surface/5 backdrop-blur-sm p-4 rounded-lg border border-surface/10">
                                    <h4 className="text-lg font-semibold text-white mb-2">
                                        {getVigorTypeDisplayName(type._id)}
                                    </h4>
                                    <p className="text-2xl font-bold text-white">{type.count}</p>
                                    <p className="text-sm text-white/70">contributions</p>
                                    <p className="text-xs text-white/60 mt-1">
                                        Avg: {type.avgAmount.toFixed(1)} vigor
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Statistics;