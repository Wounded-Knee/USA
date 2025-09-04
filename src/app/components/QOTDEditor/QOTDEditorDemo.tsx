'use client'

import React from 'react'
import Link from 'next/link'

interface QOTDEditorDemoProps {
  className?: string
}

const QOTDEditorDemo: React.FC<QOTDEditorDemoProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">QOTD Editor</h2>
        <p className="text-blue-100 text-sm mt-1">Manage quotes and backgrounds for the Quote of the Day system</p>
      </div>

      {/* Demo Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Sample Quote */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Abraham Lincoln</h4>
                <p className="text-gray-600 text-sm mb-2">"Government of the people, by the people, for the people, shall not perish from the earth."</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">democracy</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">government</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">people</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <span className="text-blue-600 text-sm font-medium">Edit</span>
                <span className="text-red-600 text-sm font-medium">Delete</span>
              </div>
            </div>
          </div>

          {/* Sample Background */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">U.S. Capitol Building</h4>
                <p className="text-gray-600 text-sm mb-2">National Park Service</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">center</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <span className="text-blue-600 text-sm font-medium">Edit</span>
                <span className="text-red-600 text-sm font-medium">Delete</span>
              </div>
            </div>
          </div>

          {/* JSON Export Preview */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">JSON Export</h3>
              <span className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Copy to Clipboard</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  "quotes": [...],
  "backgrounds": [...],
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-6">
          <Link 
            href="/lab/qotd-editor"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Open Full QOTD Editor
          </Link>
        </div>
      </div>
    </div>
  )
}

export default QOTDEditorDemo
