'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

export default function SimpleProfilePage() {
  const params = useParams()
  const { user: currentUser, token } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Simple Profile Page</h1>
            <p className="text-neutral mb-4">Username: {params.username as string}</p>
            <p className="text-neutral mb-4">Token: {token ? 'Present' : 'Not present'}</p>
            <p className="text-neutral mb-4">Current User: {currentUser ? currentUser.username : 'Not loaded'}</p>
            
            {currentUser && (
              <div className="bg-surface rounded-lg shadow-lg border border-neutral-light p-6 mt-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Current User Data</h2>
                <pre className="text-left text-sm text-neutral">
                  {JSON.stringify(currentUser, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

