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
  jurisdiction: {
    _id: string
    name: string
    slug: string
    level: string
  }
  governingBody?: {
    _id: string
    name: string
    slug: string
    branch: string
  }
  legislation?: {
    _id: string
    title: string
    bill_number: string
    status: string
  }
}

interface Jurisdiction {
  _id: string
  name: string
  slug: string
  level: string
  path: string
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
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([])
  
  // Filter states
  const [category, setCategory] = useState('')
  const [jurisdiction, setJurisdiction] = useState('')
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
    fetchJurisdictions()
    fetchPetitions()
  }, [category, jurisdiction, sortBy, sortOrder, currentPage])

  const fetchJurisdictions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/jurisdictions`)
      setJurisdictions(response.data)
    } catch (err) {
      console.error('Error fetching jurisdictions:', err)
    }
  }

  const fetchPetitions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder,
        ...(category && { category }),
        ...(jurisdiction && { jurisdiction })
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
      environment: 'bg-green-100 text-green-800 border-green-200',
      education: 'bg-blue-100 text-blue-800 border-blue-200',
      healthcare: 'bg-red-100 text-red-800 border-red-200',
      economy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'civil-rights': 'bg-purple-100 text-purple-800 border-purple-200',
      'foreign-policy': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getJurisdictionColor = (level: string) => {
    const colors = {
      federal: 'bg-red-100 text-red-800 border-red-200',
      state: 'bg-blue-100 text-blue-800 border-blue-200',
      county: 'bg-green-100 text-green-800 border-green-200',
      municipal: 'bg-purple-100 text-purple-800 border-purple-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[level as keyof typeof colors] || colors.other
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatProgress = (current: number, target: number) => {
    const percentage = Math.min((current / target) * 100, 100)
    return `${percentage.toFixed(1)}%`
  }

  if (loading && petitions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-neutral">Loading petitions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-error font-semibold mb-2">Error Loading Petitions</div>
              <div className="text-sm text-neutral">{error}</div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <label className="block text-sm font-medium text-neutral mb-2">Jurisdiction</label>
                <select
                  value={jurisdiction}
                  onChange={(e) => {
                    setJurisdiction(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground"
                >
                  <option value="">All Jurisdictions</option>
                  {jurisdictions.map((jur) => (
                    <option key={jur._id} value={jur._id}>
                      {jur.name} ({jur.level})
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

                    {/* Government Entity Info */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getJurisdictionColor(petition.jurisdiction.level)}`}>
                          {petition.jurisdiction.name}
                        </span>
                        {petition.governingBody && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {petition.governingBody.name}
                          </span>
                        )}
                      </div>
                      {petition.legislation && (
                        <div className="text-xs text-neutral">
                          Related to: {petition.legislation.bill_number} - {petition.legislation.title}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral">Progress</span>
                        <span className="text-foreground font-medium">
                          {petition.voteCount} / {petition.targetVotes}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-light rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: formatProgress(petition.voteCount, petition.targetVotes) }}
                        ></div>
                      </div>
                      <div className="text-xs text-neutral mt-1">
                        {formatProgress(petition.voteCount, petition.targetVotes)} complete
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-neutral">
                      <span>by {petition.creator.firstName} {petition.creator.lastName}</span>
                      <span>{petition.voteCount} votes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-neutral-light rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-light transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-neutral">
                  Page {currentPage} of {pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-2 border border-neutral-light rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-light transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Create Petition CTA */}
          <div className="mt-16 text-center">
            <div className="bg-surface rounded-lg shadow-md p-8 border border-neutral-light">
              <h2 className="text-2xl font-bold text-foreground mb-4">Have an idea for change?</h2>
              <p className="text-neutral mb-6">
                Create a petition and start building support for the issues that matter to you.
              </p>
              <Link href="/petitions/create" className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create a Petition
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PetitionsPage
