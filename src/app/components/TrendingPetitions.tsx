'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface Petition {
  _id: string
  title: string
  description: string
  category: string
  voteCount: number
  targetVotes: number
  createdAt: string
  creator: {
    firstName: string
    lastName: string
    username: string
  }
}

const TrendingPetitions: React.FC = () => {
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingPetitions = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/trending?limit=6&timeFrame=week`)
        setPetitions(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching trending petitions:', err)
        setError('Failed to load trending petitions')
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingPetitions()
  }, [])

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
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const getProgressPercentage = (voteCount: number, targetVotes: number) => {
    return Math.min((voteCount / targetVotes) * 100, 100)
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-background to-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Trending Petitions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg shadow-md p-6 animate-pulse border border-neutral-light">
                <div className="h-4 bg-neutral-light rounded mb-4"></div>
                <div className="h-3 bg-neutral-light rounded mb-2"></div>
                <div className="h-3 bg-neutral-light rounded mb-4"></div>
                <div className="h-2 bg-neutral-light rounded mb-2"></div>
                <div className="h-2 bg-neutral-light rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-background to-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Trending Petitions</h2>
          <div className="text-center text-error">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-background to-surface">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Trending Petitions</h2>
        <p className="text-center text-neutral mb-12 max-w-2xl mx-auto">
          Discover the most popular petitions this week. Join thousands of citizens in shaping our democracy.
        </p>
        
        {petitions.length === 0 ? (
          <div className="text-center text-neutral">
            <p className="text-lg">No trending petitions at the moment.</p>
            <p className="text-sm mt-2">Be the first to create a petition that matters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {petitions.map((petition) => (
              <Link 
                href={`/petitions/${petition._id}`} 
                key={petition._id}
                className="group"
              >
                <div className="bg-surface rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-neutral-light">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(petition.category)}`}>
                      {petition.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-neutral">
                      {formatDate(petition.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    {petition.title}
                  </h3>
                  
                  <p className="text-neutral text-sm mb-4 line-clamp-3">
                    {petition.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-neutral mb-2">
                      <span>Progress</span>
                      <span>{petition.voteCount} / {petition.targetVotes}</span>
                    </div>
                    <div className="w-full bg-neutral-light rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(petition.voteCount, petition.targetVotes)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral">
                      by {petition.creator.firstName} {petition.creator.lastName}
                    </span>
                    <div className="flex items-center text-primary font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {petition.voteCount} votes
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            href="/petitions" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            View All Petitions
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TrendingPetitions
