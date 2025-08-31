'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/app/contexts/ThemeContext'
import BaseBrowser from './BaseBrowser'
import DistrictForm from './forms/DistrictForm'

interface District {
  _id: string
  name: string
  district_type: string
  district_number?: number
  jurisdiction: {
    _id: string
    name: string
    slug: string
  }
  description?: string
  population?: number
  area_sq_miles?: number
  boundaries?: string
  identifiers?: Record<string, string>
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface DistrictBrowserProps {
  isAuthorized: boolean
  currentJurisdictionFilter?: string
}

export default function DistrictBrowser({ isAuthorized, currentJurisdictionFilter }: DistrictBrowserProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { resolvedTheme } = useTheme()

  // Theme-aware class names
  const themeClasses = {
    text: resolvedTheme === 'dark' ? 'text-neutral-light' : 'text-neutral-dark',
    link: resolvedTheme === 'dark' 
      ? 'text-primary-light hover:text-primary focus:ring-primary-light' 
      : 'text-primary hover:text-primary-dark focus:ring-primary',
    badge: {
      congressional: resolvedTheme === 'dark'
        ? 'bg-blue-600 text-white'
        : 'bg-blue-500 text-white',
      state_senate: resolvedTheme === 'dark'
        ? 'bg-green-600 text-white'
        : 'bg-green-500 text-white',
      state_house: resolvedTheme === 'dark'
        ? 'bg-purple-600 text-white'
        : 'bg-purple-500 text-white',
      county: resolvedTheme === 'dark'
        ? 'bg-orange-600 text-white'
        : 'bg-orange-500 text-white',
      municipal: resolvedTheme === 'dark'
        ? 'bg-red-600 text-white'
        : 'bg-red-500 text-white',
      school: resolvedTheme === 'dark'
        ? 'bg-indigo-600 text-white'
        : 'bg-indigo-500 text-white',
      default: resolvedTheme === 'dark'
        ? 'bg-neutral text-neutral-light'
        : 'bg-neutral-light text-neutral-dark'
    },
    button: {
      edit: resolvedTheme === 'dark'
        ? 'text-blue-400 hover:text-blue-300 focus:ring-blue-400'
        : 'text-blue-600 hover:text-blue-700 focus:ring-blue-500',
      delete: resolvedTheme === 'dark'
        ? 'text-red-400 hover:text-red-300 focus:ring-red-400'
        : 'text-red-600 hover:text-red-700 focus:ring-red-500'
    }
  }

  const getBadgeClass = (districtType: string) => {
    const badgeMap: Record<string, string> = {
      congressional: themeClasses.badge.congressional,
      state_senate: themeClasses.badge.state_senate,
      state_house: themeClasses.badge.state_house,
      county: themeClasses.badge.county,
      municipal: themeClasses.badge.municipal,
      school: themeClasses.badge.school
    }
    return badgeMap[districtType] || themeClasses.badge.default
  }

  const customFetchData = useCallback(async (params: any) => {
    const queryParams = new URLSearchParams(params)

    // Add jurisdiction filter if we have a current jurisdiction filter
    if (currentJurisdictionFilter) {
      queryParams.set('jurisdiction', currentJurisdictionFilter)
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/government/districts?${queryParams}`)
    return response.json()
  }, [currentJurisdictionFilter])

  const columns = [
    { key: 'name', label: 'District Name', sortable: true },
    { key: 'district_type', label: 'Type', sortable: true },
    { key: 'district_number', label: 'Number', sortable: true },
    { key: 'jurisdiction', label: 'Jurisdiction', sortable: true },
    { key: 'population', label: 'Population', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ]

  const filters = [
    {
      key: 'district_type',
      label: 'District Type',
      type: 'select' as const,
      options: [
        { value: 'congressional', label: 'Congressional' },
        { value: 'state_senate', label: 'State Senate' },
        { value: 'state_house', label: 'State House' },
        { value: 'county', label: 'County' },
        { value: 'municipal', label: 'Municipal' },
        { value: 'school', label: 'School' }
      ]
    }
  ]

  const renderRow = (district: District, index: number) => (
    <tr key={district._id} className={`${resolvedTheme === 'dark' ? 'hover:bg-neutral-dark' : 'hover:bg-neutral-light'}`}>
      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
          {district.name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeClass(district.district_type)}`}>
          {district.district_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
        {district.district_number || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-foreground">
          {district.jurisdiction?.name || 'Unknown'}
        </div>
        <div className="text-sm text-neutral">
          {district.jurisdiction?.slug}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
        {district.population ? district.population.toLocaleString() : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {isAuthorized && (
          <div className="flex space-x-2">
            <button
              className={themeClasses.button.edit}
              aria-label={`Edit district ${district.name}`}
            >
              Edit
            </button>
            <button
              className={themeClasses.button.delete}
              aria-label={`Delete district ${district.name}`}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  )

  const renderForm = (district: District | null, onSave: (data: any) => void, onCancel: () => void) => (
    <DistrictForm
      district={district}
      onSave={onSave}
      onCancel={onCancel}
      currentJurisdictionFilter={currentJurisdictionFilter}
    />
  )

  return (
    <BaseBrowser
      isAuthorized={isAuthorized}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      endpoint="/government/districts"
      title="Districts"
      columns={columns}
      renderRow={renderRow}
      renderForm={renderForm}
      searchFields={['name', 'district_type', 'jurisdiction.name']}
      filters={filters}
      customFetchData={customFetchData}
    />
  )
}
