'use client'

import React, { useState, useEffect, useCallback } from 'react'
import BaseBrowser from './BaseBrowser'
import JurisdictionForm from './forms/JurisdictionForm'
import { useTheme } from '@/app/contexts/ThemeContext'

interface BreadcrumbItem {
  id: string
  name: string
  path: string
}

interface JurisdictionBrowserProps {
  isAuthorized: boolean
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  breadcrumbs?: BreadcrumbItem[]
  onJurisdictionSelect?: (jurisdiction: any) => void
  currentJurisdictionFilter?: string | null
}

const LEVELS = [
  'federal', 'state', 'territory', 'tribal', 'regional',
  'county', 'municipal', 'special_district', 'school_district',
  'judicial_district', 'precinct', 'ward'
]

const ENTITY_TYPES = [
  'jurisdiction', 'body', 'agency', 'department', 'court', 'office',
  'board', 'commission', 'authority', 'corporation', 'committee', 'district'
]

export default function JurisdictionBrowser({ 
  isAuthorized, 
  isLoading, 
  setIsLoading,
  breadcrumbs = [],
  onJurisdictionSelect,
  currentJurisdictionFilter
}: JurisdictionBrowserProps) {
  const { resolvedTheme } = useTheme()
  const [jurisdictions, setJurisdictions] = useState<any[]>([])
  const [parentOptions, setParentOptions] = useState<{ value: string; label: string }[]>([])

  // Theme-aware class names
  const themeClasses = {
    text: resolvedTheme === 'dark' ? 'text-foreground' : 'text-foreground',
    textSecondary: resolvedTheme === 'dark' ? 'text-neutral-light' : 'text-neutral-dark',
    textMuted: resolvedTheme === 'dark' ? 'text-neutral' : 'text-neutral',
    link: resolvedTheme === 'dark' 
      ? 'text-primary-light hover:text-primary focus:ring-primary-light' 
      : 'text-primary hover:text-primary-dark focus:ring-primary',
    badge: {
      federal: resolvedTheme === 'dark' ? 'bg-purple-900/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-800 border-purple-200',
      state: resolvedTheme === 'dark' ? 'bg-blue-900/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      county: resolvedTheme === 'dark' ? 'bg-green-900/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-800 border-green-200',
      municipal: resolvedTheme === 'dark' ? 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      default: resolvedTheme === 'dark' ? 'bg-neutral-900/20 text-neutral-300 border-neutral-500/30' : 'bg-neutral-100 text-neutral-800 border-neutral-200'
    },
    button: {
      edit: resolvedTheme === 'dark' 
        ? 'text-primary-light hover:text-primary focus:ring-primary-light' 
        : 'text-primary hover:text-primary-dark focus:ring-primary',
      delete: resolvedTheme === 'dark' 
        ? 'text-error hover:text-error/80 focus:ring-error/50' 
        : 'text-error hover:text-error/80 focus:ring-error/50'
    }
  }

  // Fetch jurisdictions for parent dropdown
  useEffect(() => {
    const fetchJurisdictions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/government/jurisdictions?limit=1000`)
        const data = await response.json()
        const options = data.jurisdictions?.map((jurisdiction: any) => ({
          value: jurisdiction._id,
          label: jurisdiction.name
        })) || []
        setParentOptions([{ value: '', label: 'None (Top Level)' }, ...options])
      } catch (error) {
        console.error('Error fetching jurisdictions:', error)
      }
    }
    fetchJurisdictions()
  }, [])



  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'level', label: 'Level', sortable: true },
    { key: 'entity_type', label: 'Entity Type', sortable: true },
    { key: 'depth', label: 'Depth', sortable: true },
    { key: 'path', label: 'Path', sortable: false },
    { key: 'createdAt', label: 'Created', sortable: true }
  ]

  const filters = [
    {
      key: 'level',
      label: 'Level',
      type: 'select' as const,
      options: LEVELS.map(level => ({ value: level, label: level.charAt(0).toUpperCase() + level.slice(1) }))
    },
    {
      key: 'entity_type',
      label: 'Entity Type',
      type: 'select' as const,
      options: ENTITY_TYPES.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))
    }
  ]

  // Handle jurisdiction click for breadcrumb navigation
  const handleJurisdictionClick = (jurisdiction: any) => {
    if (onJurisdictionSelect) {
      onJurisdictionSelect(jurisdiction)
    }
  }

  // Get badge styling based on level
  const getBadgeClass = (level: string) => {
    switch (level) {
      case 'federal':
        return themeClasses.badge.federal
      case 'state':
        return themeClasses.badge.state
      case 'county':
        return themeClasses.badge.county
      case 'municipal':
        return themeClasses.badge.municipal
      default:
        return themeClasses.badge.default
    }
  }

  const renderRow = (jurisdiction: any, index: number) => (
    <tr key={jurisdiction._id || index} className="hover:bg-neutral-light/50 dark:hover:bg-neutral-dark/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button
            onClick={() => handleJurisdictionClick(jurisdiction)}
            className={`text-sm font-medium hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 rounded transition-colors ${themeClasses.link}`}
            aria-label={`Navigate to ${jurisdiction.name}`}
          >
            {jurisdiction.name}
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm ${themeClasses.text}`}>{jurisdiction.slug}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getBadgeClass(jurisdiction.level)}`}>
          {jurisdiction.level}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm ${themeClasses.text}`}>{jurisdiction.entity_type}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm ${themeClasses.text}`}>{jurisdiction.depth}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-mono ${themeClasses.textMuted}`}>{jurisdiction.path}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm ${themeClasses.textSecondary}`}>
          {new Date(jurisdiction.createdAt).toLocaleDateString()}
        </div>
      </td>
      {isAuthorized && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => {
                // Handle edit - this would be passed to the form
                console.log('Edit jurisdiction:', jurisdiction)
              }}
              className={`hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded transition-colors ${themeClasses.button.edit}`}
              aria-label={`Edit ${jurisdiction.name}`}
            >
              Edit
            </button>
            <button
              onClick={() => {
                // Handle delete
                if (confirm(`Are you sure you want to delete ${jurisdiction.name}?`)) {
                  console.log('Delete jurisdiction:', jurisdiction._id)
                }
              }}
              className={`hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded transition-colors ${themeClasses.button.delete}`}
              aria-label={`Delete ${jurisdiction.name}`}
            >
              Delete
            </button>
          </div>
        </td>
      )}
    </tr>
  )

  const renderForm = (jurisdiction: any, onSave: (data: any) => void, onCancel: () => void) => (
    <JurisdictionForm
      jurisdiction={jurisdiction}
      parentOptions={parentOptions}
      onSave={onSave}
      onCancel={onCancel}
    />
  )

  // Create custom fetch function that includes parent filter
  const customFetchData = useCallback(async (params: any) => {
    const queryParams = new URLSearchParams(params)
    
    // Add parent filter if we have a current jurisdiction filter
    if (currentJurisdictionFilter) {
      queryParams.set('parent', currentJurisdictionFilter)
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/government/jurisdictions?${queryParams}`)
    return response.json()
  }, [currentJurisdictionFilter])

  return (
    <BaseBrowser
      isAuthorized={isAuthorized}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      endpoint="jurisdictions"
      title="Jurisdictions"
      columns={columns}
      renderRow={renderRow}
      renderForm={renderForm}
      searchFields={['name', 'slug', 'path']}
      filters={filters}
      customFetchData={customFetchData}
    />
  )
}
