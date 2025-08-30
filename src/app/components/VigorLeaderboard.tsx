'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface LeaderboardEntry {
  _id: string
  totalVigor: number
  vigorCount: number
  user: {
    username: string
    firstName: string
    lastName: string
  }
  topPetition: {
    vigorAmount: number
    petitionTitle: string
    petitionId: string
  }
}

const VigorLeaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeFrame, setTimeFrame] = useState<'all' | 'week' | 'month'>('all')

  useEffect(() => {
    fetchLeaderboard()
  }, [timeFrame])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/vigor/leaderboard?limit=10&timeFrame=${timeFrame}`)
      setLeaderboard(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching vigor leaderboard:', err)
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Vigor Champions</h3>
        <div className="flex space-x-2">
          {(['all', 'week', 'month'] as const).map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                timeFrame === frame
                  ? 'bg-yellow-100 text-yellow-800 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
          </div>
          <p className="text-gray-500">No vigor contributions yet</p>
          <p className="text-sm text-gray-400">Be the first to contribute vigor!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div key={entry._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {index < 3 ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {index + 1}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {entry.user.firstName} {entry.user.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  @{entry.user.username}
                </p>
                {entry.topPetition && (
                  <div className="mt-1">
                    <Link 
                      href={`/petitions/${entry.topPetition.petitionId}`}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span className="font-medium">Top petition:</span> {entry.topPetition.petitionTitle}
                    </Link>
                    <p className="text-xs text-gray-400">
                      {entry.topPetition.vigorAmount} vigor points
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-sm font-bold text-yellow-600">
                  {entry.totalVigor} Vigor
                </div>
                <div className="text-xs text-gray-500">
                  {entry.vigorCount} contributions
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Ready to make your voice heard?
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            Contribute Vigor
          </button>
        </div>
      </div>
    </div>
  )
}

export default VigorLeaderboard
