'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { isAdmin, hasRole } from '../../utils/roleUtils'
import GovernmentBrowser from './components/GovernmentBrowser'

export default function GovernmentBrowserPage() {
  const { user } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if user has admin or developer privileges for editing
    const canEdit = isAdmin(user) || hasRole(user, 'Moderator')
    setIsAuthorized(canEdit)
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Government Browser
              </h1>
              <p className="text-lg text-gray-600">
                Explore and manage the complete US government structure
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">Logged in as</div>
                  <div className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isAuthorized ? 'Edit Mode' : 'Read Only'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Access Control Notice */}
        {!user ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Read-Only Access
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You must be logged in to access the Government Browser. 
                    {!isAuthorized && user && ' Only users with Admin, Developer, or Moderator roles can edit government data.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : !isAuthorized ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Read-Only Mode
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    You can browse government data, but editing requires Admin, Developer, or Moderator privileges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Edit Mode Enabled
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    You have authorization to edit government data. Use the interface below to manage jurisdictions, offices, and other government entities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Browser Component */}
        <GovernmentBrowser isAuthorized={isAuthorized} />
      </div>
    </div>
  )
}
