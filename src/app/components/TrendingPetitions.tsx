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
        const response = await axios.get('http://localhost:5000/api/petitions/trending?limit=6&timeFrame=week')
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
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Trending Petitions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Trending Petitions</h2>
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Trending Petitions</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover the most popular petitions this week. Join thousands of citizens in shaping our democracy.
        </p>
        
        {petitions.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-lg">No trending petitions at the moment.</p>
            <p className="text-sm mt-2">Be the first to create a petition that matters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petitions.map((petition) => (
              <Link 
                href={`/petitions/${petition._id}`} 
                key={petition._id}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(petition.category)}`}>
                      {petition.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(petition.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {petition.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {petition.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{petition.voteCount} / {petition.targetVotes}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(petition.voteCount, petition.targetVotes)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      by {petition.creator.firstName} {petition.creator.lastName}
                    </span>
                    <div className="flex items-center text-blue-600 font-medium">
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
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
