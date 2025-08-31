'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface VigorDisplayProps {
  petitionId: string
  voteId?: string
  showDetails?: boolean
}

interface VigorStats {
  petition: {
    totalVigor: number
    vigorThreshold: number
    notificationThreshold: number
    vigorReducedThreshold: number
  }
  vigorStats: {
    byType: Array<{
      _id: string
      count: number
      totalVigor: number
      avgVigor: number
    }>
    total: {
      totalVigor: number
      vigorCount: number
      avgVigor: number
    }
  }
}

const VigorDisplay: React.FC<VigorDisplayProps> = ({ 
  petitionId, 
  voteId, 
  showDetails = false 
}) => {
  const [vigorStats, setVigorStats] = useState<VigorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVigorStats()
  }, [petitionId])

  const fetchVigorStats = async () => {
    try {
      setLoading(true)
              const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/vigor/petition/${petitionId}`)
      setVigorStats(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching vigor stats:', err)
      setError('Failed to load vigor statistics')
    } finally {
      setLoading(false)
    }
  }

  const getVigorProgress = () => {
    if (!vigorStats) return 0
    const { totalVigor, vigorThreshold } = vigorStats.petition
    return Math.min((totalVigor / vigorThreshold) * 100, 100)
  }

  const getEffectiveVoteCount = () => {
    if (!vigorStats) return 0
    // Each 100 vigor points counts as 1 additional vote
    return Math.floor(vigorStats.petition.totalVigor / 100)
  }

  const getVigorTypeIcon = (type: string) => {
    switch (type) {
      case 'shake':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
        )
      case 'voice':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        )
      case 'statement':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
          </svg>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-2 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    )
  }

  if (!vigorStats) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Vigor Power</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-yellow-700">
            {vigorStats.petition.totalVigor} Vigor
          </span>
        </div>
      </div>

      {/* Vigor Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Vigor Progress</span>
          <span>{Math.round(getVigorProgress())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getVigorProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Effective Vote Count */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">Effective Vote Bonus</span>
          <span className="text-lg font-bold text-blue-900">+{getEffectiveVoteCount()}</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Vigor reduces notification threshold by {Math.round((1 - vigorStats.petition.vigorReducedThreshold / vigorStats.petition.notificationThreshold) * 100)}%
        </p>
      </div>

      {/* Vigor Type Breakdown */}
      {showDetails && vigorStats.vigorStats.byType.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Vigor by Type</h4>
          <div className="space-y-2">
            {vigorStats.vigorStats.byType.map((type) => (
              <div key={type._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {getVigorTypeIcon(type._id)}
                  <span className="text-sm font-medium capitalize">{type._id}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{type.totalVigor}</div>
                  <div className="text-xs text-gray-500">{type.count} contributions</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vigor Impact */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {vigorStats.vigorStats.total.vigorCount}
            </div>
            <div className="text-xs text-gray-500">Total Contributions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(vigorStats.vigorStats.total.avgVigor)}
            </div>
            <div className="text-xs text-gray-500">Avg Vigor</div>
          </div>
        </div>
      </div>

      {/* Vigor Threshold Info */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-yellow-800">
            {vigorStats.petition.totalVigor >= vigorStats.petition.vigorThreshold 
              ? 'Vigor threshold reached! Representatives will be notified sooner.'
              : `${vigorStats.petition.vigorThreshold - vigorStats.petition.totalVigor} more vigor needed to reduce notification threshold.`
            }
          </span>
        </div>
      </div>
    </div>
  )
}

export default VigorDisplay
