'use client'

import React from 'react'

interface BreadcrumbItem {
  id: string
  name: string
  path: string
}

interface LegislationBrowserProps {
  isAuthorized: boolean
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  breadcrumbs?: BreadcrumbItem[]
  onJurisdictionSelect?: (jurisdiction: any) => void
  currentJurisdictionFilter?: string | null
}

export default function LegislationBrowser({ 
  isAuthorized, 
  isLoading, 
  setIsLoading,
  breadcrumbs = [],
  onJurisdictionSelect,
  currentJurisdictionFilter
}: LegislationBrowserProps) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-500 text-lg mb-4">📜</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Legislation</h3>
      <p className="text-gray-600 mb-6">Browse and manage bills, resolutions, and legislative actions.</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-blue-800">Coming soon! This feature will allow you to browse and edit legislation within the selected jurisdiction.</p>
      </div>
    </div>
  )
}
