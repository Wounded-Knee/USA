'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

interface Petition {
  _id: string
  title: string
  description: string
  category: string
  voteCount: number
  targetVotes: number
  isActive: boolean
  createdAt: string
  creator: {
    _id: string
    firstName: string
    lastName: string
    username: string
  }
}

interface PetitionStats {
  totalVotes: number
  recentVotes: number
  targetVotes: number
  progressPercentage: number
  isTargetReached: boolean
}

const PetitionDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const petitionId = params.id as string

  const [petition, setPetition] = useState<Petition | null>(null)
  const [stats, setStats] = useState<PetitionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voting, setVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    const fetchPetitionData = async () => {
      try {
        setLoading(true)
        const [petitionResponse, statsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/petitions/${petitionId}`),
          axios.get(`http://localhost:5000/api/petitions/${petitionId}/stats`)
        ])
        
        setPetition(petitionResponse.data)
        setStats(statsResponse.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching petition data:', err)
        setError('Failed to load petition data')
      } finally {
        setLoading(false)
      }
    }

    if (petitionId) {
      fetchPetitionData()
    }
  }, [petitionId])

  const handleVote = async () => {
    if (!petition) return

    try {
      setVoting(true)
      // For demo purposes, using a hardcoded user ID. In a real app, this would come from authentication
      const userId = "68b244b1d9bd1067422b8712" // Maria Rodriguez's ID from our demo
      
      await axios.post(`http://localhost:5000/api/petitions/${petitionId}/vote`, {
        userId
      })

      // Refresh the data
      const [petitionResponse, statsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/petitions/${petitionId}`),
        axios.get(`http://localhost:5000/api/petitions/${petitionId}/stats`)
      ])
      
      setPetition(petitionResponse.data)
      setStats(statsResponse.data)
      setHasVoted(true)
    } catch (err: any) {
      console.error('Error casting vote:', err)
      if (err.response?.data?.error?.includes('already voted')) {
        setHasVoted(true)
      } else {
        alert('Failed to cast vote. Please try again.')
      }
    } finally {
      setVoting(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'environment': 'bg-green-100 text-green-800',
      'education': 'bg-blue-100 text-blue-800',
      'healthcare': 'bg-red-100 text-red-800',
      'economy': 'bg-yellow-100 text-yellow-800',
      'civil-rights': 'bg-purple-100 text-purple-800',
      'foreign-policy': 'bg-indigo-100 text-indigo-800',
      'other': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="h-32 bg-gray-200 rounded mb-8"></div>
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !petition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Petition Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'The petition you are looking for does not exist.'}</p>
              <Link 
                href="/petitions" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Petitions
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/petitions" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Petitions
            </Link>
          </nav>

          {/* Main Petition Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm`}>
                  {petition.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="text-sm opacity-90">
                  Created {formatDate(petition.createdAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{petition.title}</h1>
              <p className="text-blue-100 text-lg">
                by {petition.creator.firstName} {petition.creator.lastName}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {petition.description}
                </p>
              </div>

              {/* Vote Statistics */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {stats.totalVotes.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Votes</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats.recentVotes.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Recent Votes (24h)</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {stats.progressPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Progress</div>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress toward {petition.targetVotes.toLocaleString()} votes</span>
                  <span>{petition.voteCount.toLocaleString()} / {petition.targetVotes.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats?.progressPercentage || 0}%` }}
                  ></div>
                </div>
                {stats?.isTargetReached && (
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Target Reached!
                    </span>
                  </div>
                )}
              </div>

              {/* Vote Button */}
              <div className="text-center">
                {!petition.isActive ? (
                  <div className="bg-gray-100 rounded-lg p-6">
                    <p className="text-gray-600">This petition is no longer active.</p>
                  </div>
                ) : hasVoted ? (
                  <div className="bg-green-100 rounded-lg p-6">
                    <div className="flex items-center justify-center text-green-800">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">You have voted on this petition!</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleVote}
                    disabled={voting}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {voting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Casting Vote...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Vote for this Petition
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this Petition</h3>
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 2.007a1 1 0 00-.707 1.707l.096.096 7.586 7.586a1 1 0 001.414 0l7.586-7.586.096-.096a1 1 0 00-1.414-1.414L10 8.586 2.707 1.293a1 1 0 00-1.414 0z" />
                </svg>
                Share
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PetitionDetailPage
