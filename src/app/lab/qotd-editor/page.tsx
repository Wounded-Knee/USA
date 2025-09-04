'use client'

import React from 'react'
import Link from 'next/link'
import QOTDEditor from '../../components/QOTDEditor/QOTDEditor'
import { useAuth } from '../../contexts/AuthContext'

export default function QOTDEditorPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QOTD Editor</h1>
              <p className="mt-2 text-gray-600">
                Manage quotes and backgrounds for the Quote of the Day system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/lab"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Back to Lab
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QOTDEditor />
      </div>
    </div>
  )
}
