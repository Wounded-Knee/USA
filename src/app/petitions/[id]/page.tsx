'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
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
  jurisdiction: {
    _id: string
    name: string
    slug: string
    level: string
    path: string
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

interface PetitionStats {
  totalVotes: number
  recentVotes: number
  averageVigor: number
  vigorCount: number
}

interface OfficePosition {
  _id: string
  office: {
    _id: string
    name: string
    slug: string
    office_type: string
    governing_body: {
      _id: string
      name: string
      slug: string
    }
    jurisdiction: {
      _id: string
      name: string
      slug: string
    }
    selection_method: string
    term_length: number
    term_limit: number
    salary: number
    is_part_time: boolean
    constituency: string
    primary_media?: {
      _id: string
      url: string
      alt_text: string
      media_type: string
    }
  }
  person: {
    _id: string
    username: string
    firstName: string
    lastName: string
    email: string
  }
  term_start: string
  term_end: string
  party: string
  status: string
  primary_media?: {
    _id: string
    url: string
    alt_text: string
    media_type: string
  }
}

interface AssociatedPetition {
  _id: string
  title: string
  description: string
  voteCount: number
  targetVotes: number
  category: string
  createdAt: string
  creator: {
    firstName: string
    lastName: string
  }
}

interface OfficeMedia {
  _id: string
  url: string
  alt_text: string
  media_type: string
  title: string
  description: string
}

const PetitionDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [petition, setPetition] = useState<Petition | null>(null)
  const [stats, setStats] = useState<PetitionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVigorActivity, setShowVigorActivity] = useState(false)
  const [currentVoteId, setCurrentVoteId] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)
  const [officePosition, setOfficePosition] = useState<OfficePosition | null>(null)
  const [associatedPetitions, setAssociatedPetitions] = useState<AssociatedPetition[]>([])
  const [loadingOffice, setLoadingOffice] = useState(false)
  const [officeMedia, setOfficeMedia] = useState<OfficeMedia[]>([])
  const [personMedia, setPersonMedia] = useState<OfficeMedia[]>([])

  useEffect(() => {
    if (params.id) {
      fetchPetition()
      fetchPetitionStats()
      checkVoteStatus()
    }
  }, [params.id])

  useEffect(() => {
    if (petition) {
      fetchOfficeInformation()
    }
  }, [petition])

  const checkVoteStatus = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/votes/check/${params.id}/68b244b1d9bd1067422b8712`)
      if (response.data.hasVoted) {
        setHasVoted(true)
        // Fetch the vote to get the vote ID for vigor button
        const voteResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/votes/user/68b244b1d9bd1067422b8712/vote/${params.id}`)
        if (voteResponse.data.vote) {
          setCurrentVoteId(voteResponse.data.vote._id)
        }
      }
    } catch (err) {
      console.error('Error checking vote status:', err)
    }
  }

  const fetchPetition = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/${params.id}`)
      setPetition(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching petition:', err)
      setError('Failed to load petition')
    } finally {
      setLoading(false)
    }
  }

  const fetchPetitionStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/${params.id}/stats`)
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching petition stats:', err)
    }
  }

  const fetchOfficeInformation = async () => {
    if (!petition?.governingBody?._id) return
    
    try {
      setLoadingOffice(true)
      
      // First, find the office for this governing body
      const officeResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/government/offices?governing_body=${petition.governingBody._id}`)
      
      if (officeResponse.data.offices && officeResponse.data.offices.length > 0) {
        const office = officeResponse.data.offices[0] // Get the first office for this governing body
        
        // Get the current position for this office
        const positionResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/government/positions/office/${office._id}`)
        setOfficePosition(positionResponse.data)
        
        // Get associated petitions for this office
        const petitionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/office/${office._id}`)
        setAssociatedPetitions(petitionsResponse.data.petitions || [])
        
        // Fetch office media (seals, logos)
        const officeMediaResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/media?entity_type=office&entity_id=${office._id}&media_type=seal`)
        setOfficeMedia(officeMediaResponse.data.media || [])
        
        // Fetch person media (headshots) if position exists
        if (positionResponse.data?.person?._id) {
          const personMediaResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/media?entity_type=position&entity_id=${positionResponse.data._id}&media_type=headshot`)
          setPersonMedia(personMediaResponse.data.media || [])
        }
      }
    } catch (err) {
      console.error('Error fetching office information:', err)
    } finally {
      setLoadingOffice(false)
    }
  }

  const handleVote = async () => {
    try {
      setVoteError(null)
      // Create a vote for this petition with zero vigor
      const voteResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/${params.id}/vote`, {
        userId: '68b244b1d9bd1067422b8712' // Using Maria Rodriguez's ID for demo
      })
      
      setCurrentVoteId(voteResponse.data.voteId)
      setHasVoted(true)
      // Refresh petition data to update vote count
      await fetchPetition()
      await fetchPetitionStats()
    } catch (err: any) {
      console.error('Error creating vote:', err)
      if (err.response?.status === 400) {
        if (err.response.data.error === 'User has already voted on this petition') {
          setVoteError('You have already voted on this petition')
          setHasVoted(true)
        } else {
          setVoteError(err.response.data.error || 'Failed to vote on petition')
        }
      } else {
        setVoteError('Failed to vote on petition. Please try again.')
      }
    }
  }

  const handleVigorClick = () => {
    if (currentVoteId) {
      setShowVigorActivity(true)
    }
  }

  const handleVigorComplete = async () => {
    setShowVigorActivity(false)
    // Refresh petition data after vigor activity
    await fetchPetition()
    await fetchPetitionStats()
    // Refresh vote status to get updated vote ID
    await checkVoteStatus()
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
      month: 'long',
      day: 'numeric'
    })
  }

  const formatProgress = (current: number, target: number) => {
    const percentage = Math.min((current / target) * 100, 100)
    return `${percentage.toFixed(1)}%`
  }

  const formatTermDates = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    const endDate = new Date(end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    return `${startDate} - ${endDate}`
  }

  const getOfficeTypeDisplay = (officeType: string) => {
    const displayNames: { [key: string]: string } = {
      'president': 'President',
      'vice_president': 'Vice President',
      'governor': 'Governor',
      'lieutenant_governor': 'Lieutenant Governor',
      'mayor': 'Mayor',
      'senator': 'Senator',
      'representative': 'Representative',
      'councilmember': 'Councilmember',
      'other': 'Official'
    }
    return displayNames[officeType] || officeType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getSelectionMethodDisplay = (method: string) => {
    const displayNames: { [key: string]: string } = {
      'elected': 'Elected',
      'appointed': 'Appointed',
      'hybrid': 'Hybrid',
      'career': 'Career Civil Service'
    }
    return displayNames[method] || method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getConstituencyDisplay = (constituency: string) => {
    const displayNames: { [key: string]: string } = {
      'at_large': 'At-Large',
      'district': 'District-Based',
      'ward': 'Ward-Based',
      'circuit': 'Circuit-Based',
      'subcircuit': 'Subcircuit-Based',
      'single_member_district': 'Single Member District'
    }
    return displayNames[constituency] || constituency.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatSalary = (salary: number) => {
    if (!salary) return 'Not specified'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary)
  }

  const formatTermLength = (months: number) => {
    if (!months) return 'Not specified'
    if (months === 12) return '1 year'
    if (months === 24) return '2 years'
    if (months === 48) return '4 years'
    if (months === 60) return '5 years'
    if (months === 72) return '6 years'
    return `${months} months`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-neutral">Loading petition...</p>
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-error font-semibold mb-2">Error Loading Petition</div>
              <div className="text-sm text-neutral">{error || 'Petition not found'}</div>
              <button 
                onClick={() => router.push('/petitions')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors duration-200"
              >
                Back to Petitions
              </button>
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
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border ${getCategoryColor(petition.category)}`}>
                    {petition.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border ${getJurisdictionColor(petition.jurisdiction.level)}`}>
                    {petition.jurisdiction.name}
                  </span>
                </div>
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
              {/* Enhanced Government Entity Information */}
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">Government Context & Office Responsibility</h3>
                </div>
                
                {/* Basic Government Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Jurisdiction</h4>
                    <p className="text-blue-700">{petition.jurisdiction.name} ({petition.jurisdiction.level})</p>
                  </div>
                  {petition.governingBody && (
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Target Governing Body</h4>
                      <p className="text-blue-700">{petition.governingBody.name} ({petition.governingBody.branch})</p>
                    </div>
                  )}
                  {petition.legislation && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-blue-800 mb-2">Related Legislation</h4>
                      <p className="text-blue-700">
                        {petition.legislation.bill_number}: {petition.legislation.title}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">Status: {petition.legislation.status}</p>
                    </div>
                  )}
                </div>

                {/* Office Holder Information */}
                {loadingOffice ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-blue-700">Loading office information...</span>
                  </div>
                ) : officePosition ? (
                  <div className="border-t border-blue-200 pt-6">
                    <h4 className="font-semibold text-blue-900 mb-4">Current Office Holder</h4>
                    <div className="flex items-start space-x-4">
                      {/* Government seal/headshot */}
                      <div className="flex-shrink-0">
                        {personMedia.length > 0 ? (
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                            <Image
                              src={personMedia[0].url}
                              alt={personMedia[0].alt_text || `${officePosition.person.firstName} ${officePosition.person.lastName}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : officeMedia.length > 0 ? (
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                            <Image
                              src={officeMedia[0].url}
                              alt={officeMedia[0].alt_text || `${officePosition.office.name} seal`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 8a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Office holder details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="text-lg font-semibold text-blue-900">
                            {officePosition.person.firstName} {officePosition.person.lastName}
                          </h5>
                          {officePosition.party && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {officePosition.party}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-blue-700 font-medium mb-1">
                          {getOfficeTypeDisplay(officePosition.office.office_type)} • {officePosition.office.name}
                        </p>
                        
                        <p className="text-sm text-blue-600 mb-2">
                          Term: {formatTermDates(officePosition.term_start, officePosition.term_end)}
                        </p>
                        
                        <div className="flex items-center space-x-4">
                          <Link 
                            href={`/profile/${officePosition.person.username}`}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            View Profile
                          </Link>
                          
                          {officePosition.person.email && (
                            <a 
                              href={`mailto:${officePosition.person.email}`}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Contact
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Office Details */}
                    <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-900 mb-3">Office Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-blue-800">Selection Method:</span>
                          <p className="text-blue-700">{getSelectionMethodDisplay(officePosition.office.selection_method)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">Constituency:</span>
                          <p className="text-blue-700">{getConstituencyDisplay(officePosition.office.constituency)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">Term Length:</span>
                          <p className="text-blue-700">{formatTermLength(officePosition.office.term_length)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">Term Limit:</span>
                          <p className="text-blue-700">{officePosition.office.term_limit ? `${officePosition.office.term_limit} terms` : 'No limit'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">Position Type:</span>
                          <p className="text-blue-700">{officePosition.office.is_part_time ? 'Part-time' : 'Full-time'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">Salary:</span>
                          <p className="text-blue-700">{formatSalary(officePosition.office.salary)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Associated Petitions */}
                {associatedPetitions.length > 0 && (
                  <div className="border-t border-blue-200 pt-6 mt-6">
                    <h4 className="font-semibold text-blue-900 mb-4">
                      All Petitions for {petition.governingBody?.name || 'This Governing Body'} ({associatedPetitions.length})
                    </h4>
                    <div className="space-y-3">
                      {associatedPetitions.map((associatedPetition) => (
                        <Link 
                          key={associatedPetition._id}
                          href={`/petitions/${associatedPetition._id}`}
                          className="block p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-blue-900 mb-1">{associatedPetition.title}</h5>
                              <p className="text-sm text-blue-600 mb-2">
                                by {associatedPetition.creator.firstName} {associatedPetition.creator.lastName}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-blue-500">
                                <span>{associatedPetition.voteCount} votes</span>
                                <span className={`px-2 py-1 rounded-full ${getCategoryColor(associatedPetition.category)}`}>
                                  {associatedPetition.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                                <span>{formatDate(associatedPetition.createdAt)}</span>
                              </div>
                            </div>
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Description</h3>
                <p className="text-neutral leading-relaxed">{petition.description}</p>
              </div>

              {/* Progress Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Progress</h3>
                  <span className="text-lg font-medium text-primary">
                    {petition.voteCount} / {petition.targetVotes} votes
                  </span>
                </div>
                <div className="w-full bg-neutral-light rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary-dark h-3 rounded-full transition-all duration-300"
                    style={{ width: formatProgress(petition.voteCount, petition.targetVotes) }}
                  ></div>
                </div>
                <p className="text-sm text-neutral">
                  {formatProgress(petition.voteCount, petition.targetVotes)} complete • 
                  {petition.voteCount >= petition.vigorReducedThreshold ? ' Ready for action!' : ` ${petition.vigorReducedThreshold - petition.voteCount} more votes needed`}
                </p>
              </div>

              {/* Vigor Display */}
              {stats && (
                <div className="mb-8">
                  <VigorDisplay 
                    petitionId={petition._id}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {hasVoted ? (
                  <button
                    onClick={handleVigorClick}
                    className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <span className="text-xl mr-2">🔥</span>
                    Vigor
                  </button>
                ) : (
                  <button
                    onClick={handleVote}
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Support This Petition
                  </button>
                )}
                <button className="flex-1 bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-dark transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Petition
                </button>
              </div>

              {/* Vote Error Message */}
              {voteError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-800 font-medium">{voteError}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vigor Activity Modal */}
          {showVigorActivity && currentVoteId && (
            <VigorActivity
              voteId={currentVoteId}
              petitionTitle={petition.title}
              onVigorContributed={handleVigorComplete}
              onClose={() => setShowVigorActivity(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PetitionDetailPage
