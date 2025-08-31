'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import UserAvatar from '../components/UserAvatar'
import Link from 'next/link'
import axios from 'axios'

interface UserVote {
  _id: string
  petition: {
    _id: string
    title: string
    description: string
    status: string
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

export default function ProfilePage() {
  const { user, token } = useAuth()
  const [votes, setVotes] = useState<UserVote[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && token) {
      fetchUserData()
    }
  }, [user, token])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [votesResponse, statsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${user?._id}/votes`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${user?._id}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      setVotes(votesResponse.data)
      setStats(statsResponse.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load user data')
    } finally {
      setLoading(false)
    }
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-light p-6 mb-8">
          <div className="flex items-center space-x-6">
            <UserAvatar size="lg" showDropdown={false} />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-neutral mb-1">@{user.username}</p>
              <p className="text-neutral mb-4">{user.email}</p>
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile/edit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Edit Profile
                </Link>
                <span className="text-sm text-neutral">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalVotes}</div>
              <div className="text-sm text-neutral">Total Votes</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalVigor}</div>
              <div className="text-sm text-neutral">Total Vigor</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.averageVigor.toFixed(1)}</div>
              <div className="text-sm text-neutral">Avg Vigor</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.petitionsSupported}</div>
              <div className="text-sm text-neutral">Petitions Supported</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-neutral-light p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalCapital}</div>
              <div className="text-sm text-neutral">Total Capital</div>
            </div>
          </div>
        )}

        {/* Voting History */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-light">
          <div className="p-6 border-b border-neutral-light">
            <h2 className="text-xl font-semibold text-foreground">Your Voting History</h2>
            <p className="text-neutral mt-1">Petitions you've supported and your vigor contributions</p>
          </div>
          
          <div className="divide-y divide-neutral-light">
            {votes.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-neutral mb-4">You haven't voted on any petitions yet.</p>
                <Link
                  href="/petitions"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
                >
                  Browse Petitions
                </Link>
              </div>
            ) : (
              votes.map((vote) => (
                <div key={vote._id} className="p-6 hover:bg-neutral-light transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/petitions/${vote.petition._id}`}
                        className="text-lg font-semibold text-foreground hover:text-primary transition-colors duration-200"
                      >
                        {vote.petition.title}
                      </Link>
                      <p className="text-neutral mt-1 line-clamp-2">{vote.petition.description}</p>
                      
                      {vote.signingStatement && (
                        <div className="mt-3 p-3 bg-neutral-light rounded-md">
                          <p className="text-sm text-neutral italic">"{vote.signingStatement}"</p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm text-neutral">
                        <span>Vigor: {vote.totalVigor}</span>
                        <span>Activities: {vote.vigorCount}</span>
                        {vote.capital !== undefined && <span>Capital: {vote.capital}</span>}
                        <span>Voted: {new Date(vote.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          vote.petition.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {vote.petition.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
