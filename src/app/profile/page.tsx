'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProfileHeader from '../components/ProfileHeader'
import UserVoteCard from '../components/UserVoteCard'
import GovernmentPositions from '../components/GovernmentPositions'
import RepresentativesAndJurisdictions from '../components/RepresentativesAndJurisdictions'
import Link from 'next/link'
import axios from 'axios'

interface UserVote {
  _id: string
  petition: {
    _id: string
    title: string
    description: string
    category: string
    voteCount: number
    targetVotes: number
    isActive: boolean
    jurisdiction?: {
      name: string
      level: string
    }
  }
  totalVigor: number
  vigorCount: number
  signingStatement?: string
  createdAt: string
  capital?: number
}

interface UserStats {
  totalVotes: number
  totalVigor: number
  averageVigor: number
  petitionsSupported: number
  totalCapital: number
}

interface GovernmentData {
  currentPositions: any[]
  pastPositions: any[]
  committeeMemberships: any[]
  representatives: any[]
  totalPositions: number
  totalCurrentPositions: number
  totalPastPositions: number
  totalCommittees: number
}

type SortOption = 'date' | 'vigor' | 'category' | 'status'
type FilterOption = 'all' | 'active' | 'inactive'

export default function ProfilePage() {
  const { user, token } = useAuth()
  const [votes, setVotes] = useState<UserVote[]>([])
  const [filteredVotes, setFilteredVotes] = useState<UserVote[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [governmentData, setGovernmentData] = useState<GovernmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('date')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user && token) {
      fetchUserData()
    }
  }, [user, token])

  useEffect(() => {
    filterAndSortVotes()
  }, [votes, sortBy, filterBy, searchTerm])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [votesResponse, statsResponse, governmentResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${user?._id}/votes`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${user?._id}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${user?._id}/government`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      setVotes(votesResponse.data)
      setStats(statsResponse.data)
      setGovernmentData(governmentResponse.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortVotes = () => {
    let filtered = [...votes]

    // Apply status filter
    if (filterBy === 'active') {
      filtered = filtered.filter(vote => vote.petition.isActive)
    } else if (filterBy === 'inactive') {
      filtered = filtered.filter(vote => !vote.petition.isActive)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vote =>
        vote.petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vote.petition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vote.petition.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'vigor':
          return b.totalVigor - a.totalVigor
        case 'category':
          return a.petition.category.localeCompare(b.petition.category)
        case 'status':
          return a.petition.isActive === b.petition.isActive ? 0 : a.petition.isActive ? -1 : 1
        default:
          return 0
      }
    })

    setFilteredVotes(filtered)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      environment: 'bg-[var(--fs-14260)]/10 text-[var(--fs-14260)] border-[var(--fs-14260)]/20',
      education: 'bg-[var(--fs-15056)]/10 text-[var(--fs-15056)] border-[var(--fs-15056)]/20',
      healthcare: 'bg-[var(--fs-16350)]/10 text-[var(--fs-16350)] border-[var(--fs-16350)]/20',
      economy: 'bg-[var(--fs-16357)]/10 text-[var(--fs-16357)] border-[var(--fs-16357)]/20',
      'civil-rights': 'bg-[var(--fs-15125)]/10 text-[var(--fs-15125)] border-[var(--fs-15125)]/20',
      'foreign-policy': 'bg-[var(--fs-15080)]/10 text-[var(--fs-15080)] border-[var(--fs-15080)]/20',
      other: 'bg-[var(--fs-16152)]/10 text-[var(--fs-16152)] border-[var(--fs-16152)]/20'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getProgressPercentage = (voteCount: number, targetVotes: number) => {
    return Math.min((voteCount / targetVotes) * 100, 100)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please sign in to view your profile</h1>
          <Link 
            href="/"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error loading profile</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchUserData}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <ProfileHeader user={user} />
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-surface rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalVotes}</div>
              <div className="text-sm text-neutral">Total Votes</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalVigor}</div>
              <div className="text-sm text-neutral">Total Vigor</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.averageVigor.toFixed(1)}</div>
              <div className="text-sm text-neutral">Avg Vigor</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.petitionsSupported}</div>
              <div className="text-sm text-neutral">Petitions Supported</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalCapital}</div>
              <div className="text-sm text-neutral">Total Capital</div>
            </div>
          </div>
        )}

        {/* Government Stats Grid */}
        {governmentData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{governmentData.totalCurrentPositions}</div>
              <div className="text-sm text-neutral">Current Positions</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{governmentData.totalPastPositions}</div>
              <div className="text-sm text-neutral">Past Positions</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{governmentData.totalCommittees}</div>
              <div className="text-sm text-neutral">Committee Memberships</div>
            </div>
            <div className="bg-surface rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{governmentData.representatives.length}</div>
              <div className="text-sm text-neutral">Representatives</div>
            </div>
          </div>
        )}

        {/* Government Positions */}
        {governmentData && (
          <div className="mb-8">
            <GovernmentPositions
              currentPositions={governmentData.currentPositions}
              pastPositions={governmentData.pastPositions}
              committeeMemberships={governmentData.committeeMemberships}
              userId={user?._id || ''}
            />
          </div>
        )}

        {/* Representatives and Jurisdictions */}
        {governmentData && governmentData.representatives.length > 0 && (
          <div className="mb-8">
            <RepresentativesAndJurisdictions
              representatives={governmentData.representatives}
            />
          </div>
        )}

        {/* Voting History */}
        <div className="bg-surface rounded-lg shadow-sm border border-neutral-light">
          <div className="p-6 border-b border-neutral-light">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Your Voting History</h2>
                <p className="text-neutral mt-1">
                  {filteredVotes.length} of {votes.length} petitions you've supported
                </p>
              </div>
              
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search petitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-neutral-light rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="px-3 py-2 border border-neutral-light rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-neutral-light rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="vigor">Sort by Vigor</option>
                  <option value="category">Sort by Category</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-neutral-light">
            {filteredVotes.length === 0 ? (
              <div className="p-6 text-center">
                {votes.length === 0 ? (
                  <>
                    <p className="text-neutral mb-4">You haven't voted on any petitions yet.</p>
                    <Link
                      href="/petitions"
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
                    >
                      Browse Petitions
                    </Link>
                  </>
                ) : (
                  <p className="text-neutral">No petitions match your current filters.</p>
                )}
              </div>
            ) : (
              filteredVotes.map((vote) => (
                <UserVoteCard key={vote._id} vote={vote} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
