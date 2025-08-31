'use client'

import React from 'react'

interface BreadcrumbItem {
  id: string
  name: string
  path: string
}

interface PositionBrowserProps {
  isAuthorized: boolean
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  breadcrumbs?: BreadcrumbItem[]
  onJurisdictionSelect?: (jurisdiction: any) => void
  currentJurisdictionFilter?: string | null
}

export default function PositionBrowser({ 
  isAuthorized, 
  isLoading, 
  setIsLoading,
  breadcrumbs = [],
  onJurisdictionSelect,
  currentJurisdictionFilter
}: PositionBrowserProps) {
  return (
    <div className="text-center py-12">
              <div className="text-neutral text-lg mb-4">👤</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Positions</h3>
        <p className="text-neutral mb-6">Browse and manage person assignments to offices with terms.</p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-primary">Coming soon! This feature will allow you to browse and edit positions within the selected jurisdiction.</p>
      </div>
    </div>
  )
}
