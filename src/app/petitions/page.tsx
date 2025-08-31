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
  isActive: boolean
  createdAt: string
  creator: {
    firstName: string
    lastName: string
    username: string
  }
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

const PetitionsPage: React.FC = () => {
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  
  // Filter states
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'environment', label: 'Environment' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'economy', label: 'Economy' },
    { value: 'civil-rights', label: 'Civil Rights' },
    { value: 'foreign-policy', label: 'Foreign Policy' },
    { value: 'other', label: 'Other' }
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'voteCount', label: 'Most Votes' },
    { value: 'title', label: 'Title' }
  ]

  useEffect(() => {
    fetchPetitions()
  }, [category, sortBy, sortOrder, currentPage])

  const fetchPetitions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder,
        ...(category && { category })
      })

              const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions?${params}`)
      setPetitions(response.data.petitions)
      setPagination(response.data.pagination)
      setError(null)
    } catch (err) {
      console.error('Error fetching petitions:', err)
      setError('Failed to load petitions')
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && petitions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">All Petitions</h1>
              <p className="text-lg text-neutral">Discover and support petitions that matter to you.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">All Petitions</h1>
            <p className="text-lg text-neutral">Discover and support petitions that matter to you.</p>
          </div>

          {/* Filters */}
          <div className="bg-surface rounded-lg shadow-md p-6 mb-8 border border-neutral-light">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center text-error mb-8">
              <p>{error}</p>
              <button 
                onClick={() => fetchPetitions()} 
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Petitions Grid */}
          {petitions.length === 0 && !loading ? (
            <div className="text-center text-neutral">
              <p className="text-lg">No petitions found.</p>
              <p className="text-sm mt-2">Try adjusting your filters or be the first to create a petition!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-neutral bg-surface border border-neutral-light rounded-md hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'text-neutral bg-surface border border-neutral-light hover:bg-neutral-light'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-2 text-sm font-medium text-neutral bg-surface border border-neutral-light rounded-md hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Create Petition CTA */}
          <div className="mt-16 text-center">
            <div className="bg-surface rounded-lg shadow-md p-8 border border-neutral-light">
              <h2 className="text-2xl font-bold text-foreground mb-4">Have an idea for change?</h2>
              <p className="text-neutral mb-6">
                Create a petition and start building support for the issues that matter to you.
              </p>
              <button className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create a Petition
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PetitionsPage
