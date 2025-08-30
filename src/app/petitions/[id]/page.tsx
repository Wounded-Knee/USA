'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import VigorActivity from '../../components/VigorActivity'
import VigorDisplay from '../../components/VigorDisplay'

interface Petition {
  _id: string
  title: string
  description: string
  category: string
  voteCount: number
  targetVotes: number
  totalVigor: number
  vigorReducedThreshold: number
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
  const [showVigorActivity, setShowVigorActivity] = useState(false)
  const [currentVoteId, setCurrentVoteId] = useState<string | null>(null)

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
      
      const voteResponse = await axios.post(`http://localhost:5000/api/petitions/${petitionId}/vote`, {
        userId
      })

      // Get the vote ID for vigor contribution
      const voteId = voteResponse.data.voteId || voteResponse.data._id
      setCurrentVoteId(voteId)

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

  const handleVigorContributed = (vigorData: any) => {
    // Refresh petition data to show updated vigor
    fetchPetitionData()
  }

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

  const getCategoryColor = (category: string) => {
    const colors = {
      'environment': 'bg-success/20 text-success border-success/30',
      'education': 'bg-primary/20 text-primary border-primary/30',
      'healthcare': 'bg-error/20 text-error border-error/30',
      'economy': 'bg-warning/20 text-warning border-warning/30',
      'civil-rights': 'bg-accent/20 text-accent border-accent/30',
      'foreign-policy': 'bg-secondary/20 text-secondary border-secondary/30',
      'other': 'bg-neutral/20 text-neutral border-neutral/30'
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
      <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-surface rounded-lg shadow-lg p-8 animate-pulse border border-neutral-light">
              <div className="h-8 bg-neutral-light rounded mb-4"></div>
              <div className="h-4 bg-neutral-light rounded mb-2"></div>
              <div className="h-4 bg-neutral-light rounded mb-8"></div>
              <div className="h-32 bg-neutral-light rounded mb-8"></div>
              <div className="h-6 bg-neutral-light rounded mb-4"></div>
              <div className="h-4 bg-neutral-light rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !petition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-surface rounded-lg shadow-lg p-8 border border-neutral-light">
              <h1 className="text-2xl font-bold text-foreground mb-4">Petition Not Found</h1>
              <p className="text-neutral mb-6">{error || 'The petition you are looking for does not exist.'}</p>
              <Link 
                href="/petitions" 
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-200"
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
    <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/petitions" 
              className="text-primary hover:text-primary-dark transition-colors duration-200"
            >
              ← Back to Petitions
            </Link>
          </nav>

          {/* Main Petition Card */}
          <div className="bg-surface rounded-lg shadow-lg overflow-hidden border border-neutral-light">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border ${getCategoryColor(petition.category)}`}>
                  {petition.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="text-sm opacity-90">
                  Created {formatDate(petition.createdAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{petition.title}</h1>
              <p className="text-white/80 text-lg">
                by {petition.creator.firstName} {petition.creator.lastName}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="prose max-w-none mb-8">
                <p className="text-neutral text-lg leading-relaxed whitespace-pre-wrap">
                  {petition.description}
                </p>
              </div>

              {/* Vote Statistics */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-primary/10 rounded-lg p-6 text-center border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stats.totalVotes.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral">Total Votes</div>
                  </div>
                  <div className="bg-success/10 rounded-lg p-6 text-center border border-success/20">
                    <div className="text-3xl font-bold text-success mb-2">
                      {stats.recentVotes.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral">Recent Votes (24h)</div>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-6 text-center border border-accent/20">
                    <div className="text-3xl font-bold text-accent mb-2">
                      {stats.progressPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-neutral">Progress</div>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-neutral mb-2">
                  <span>Progress toward {petition.targetVotes.toLocaleString()} votes</span>
                  <span>{petition.voteCount.toLocaleString()} / {petition.targetVotes.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-light rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary-dark h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats?.progressPercentage || 0}%` }}
                  ></div>
                </div>
                {stats?.isTargetReached && (
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success/20 text-success border border-success/30">
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
                  <div className="bg-neutral-light rounded-lg p-6 border border-neutral-light">
                    <p className="text-neutral">This petition is no longer active.</p>
                  </div>
                ) : hasVoted ? (
                  <div className="bg-success/10 rounded-lg p-6 border border-success/20">
                    <div className="flex items-center justify-center text-success mb-4">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">You have voted on this petition!</span>
                    </div>
                    <button
                      onClick={() => setShowVigorActivity(true)}
                      className="inline-flex items-center px-6 py-3 bg-warning text-white font-medium rounded-lg hover:bg-warning/80 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                      </svg>
                      Contribute Vigor
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleVote}
                    disabled={voting}
                    className="inline-flex items-center px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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

          {/* Vigor Display */}
          <div className="mt-8">
            <VigorDisplay petitionId={petitionId} showDetails={true} />
          </div>

          {/* Share Section */}
          <div className="mt-8 bg-surface rounded-lg shadow-lg p-6 border border-neutral-light">
            <h3 className="text-lg font-semibold text-foreground mb-4">Share this Petition</h3>
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 2.007a1 1 0 00-.707 1.707l.096.096 7.586 7.586a1 1 0 001.414 0l7.586-7.586.096-.096a1 1 0 00-1.414-1.414L10 8.586 2.707 1.293a1 1 0 00-1.414 0z" />
                </svg>
                Share
              </button>
              <button className="flex items-center px-4 py-2 bg-neutral text-white rounded hover:bg-neutral-dark transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3 3 0 100-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vigor Activity Modal */}
      {showVigorActivity && currentVoteId && petition && (
        <VigorActivity
          voteId={currentVoteId}
          petitionTitle={petition.title}
          onVigorContributed={handleVigorContributed}
          onClose={() => setShowVigorActivity(false)}
        />
      )}
    </div>
  )
}

export default PetitionDetailPage
