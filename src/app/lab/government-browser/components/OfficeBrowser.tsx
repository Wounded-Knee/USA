'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/app/contexts/ThemeContext'
import BaseBrowser from './BaseBrowser'
import OfficeForm from './forms/OfficeForm'

interface Office {
  _id: string
  name: string
  slug: string
  office_type: string
  governing_body?: {
    _id: string
    name: string
    slug: string
  }
  jurisdiction?: {
    _id: string
    name: string
    slug: string
  }
  constituency: string
  district?: {
    _id: string
    name: string
    district_type: string
    district_number?: number
  }
  selection_method: string
  term_length?: number
  term_limit?: number
  salary?: number
  is_part_time: boolean
  identifiers?: Record<string, string>
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface OfficeBrowserProps {
  isAuthorized: boolean
  currentJurisdictionFilter?: string
}

export default function OfficeBrowser({ isAuthorized, currentJurisdictionFilter }: OfficeBrowserProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { resolvedTheme } = useTheme()

  // Theme-aware class names
  const themeClasses = {
    text: resolvedTheme === 'dark' ? 'text-neutral-light' : 'text-neutral-dark',
    link: resolvedTheme === 'dark' 
      ? 'text-primary-light hover:text-primary focus:ring-primary-light' 
      : 'text-primary hover:text-primary-dark focus:ring-primary',
    badge: {
      executive: resolvedTheme === 'dark'
        ? 'bg-red-600 text-white'
        : 'bg-red-500 text-white',
      legislative: resolvedTheme === 'dark'
        ? 'bg-blue-600 text-white'
        : 'bg-blue-500 text-white',
      judicial: resolvedTheme === 'dark'
        ? 'bg-purple-600 text-white'
        : 'bg-purple-500 text-white',
      administrative: resolvedTheme === 'dark'
        ? 'bg-green-600 text-white'
        : 'bg-green-500 text-white',
      advisory: resolvedTheme === 'dark'
        ? 'bg-orange-600 text-white'
        : 'bg-orange-500 text-white',
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

  const getBadgeClass = (officeType: string) => {
    const badgeMap: Record<string, string> = {
      executive: themeClasses.badge.executive,
      legislative: themeClasses.badge.legislative,
      judicial: themeClasses.badge.judicial,
      administrative: themeClasses.badge.administrative,
      advisory: themeClasses.badge.advisory
    }
    return badgeMap[officeType] || themeClasses.badge.default
  }

  const customFetchData = useCallback(async (params: any) => {
    const queryParams = new URLSearchParams(params)

    // Add jurisdiction filter if we have a current jurisdiction filter
    if (currentJurisdictionFilter) {
      queryParams.set('jurisdiction', currentJurisdictionFilter)
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/government/offices?${queryParams}`)
    return response.json()
  }, [currentJurisdictionFilter])

  const columns = [
    { key: 'name', label: 'Office Name', sortable: true },
    { key: 'office_type', label: 'Type', sortable: true },
    { key: 'governing_body', label: 'Governing Body', sortable: true },
    { key: 'jurisdiction', label: 'Jurisdiction', sortable: true },
    { key: 'district', label: 'District', sortable: true },
    { key: 'selection_method', label: 'Selection', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ]

  const filters = [
    {
      key: 'office_type',
      label: 'Office Type',
      type: 'select' as const,
      options: [
        { value: 'executive', label: 'Executive' },
        { value: 'legislative', label: 'Legislative' },
        { value: 'judicial', label: 'Judicial' },
        { value: 'administrative', label: 'Administrative' },
        { value: 'advisory', label: 'Advisory' }
      ]
    },
    {
      key: 'selection_method',
      label: 'Selection Method',
      type: 'select' as const,
      options: [
        { value: 'election', label: 'Election' },
        { value: 'appointment', label: 'Appointment' },
        { value: 'inheritance', label: 'Inheritance' },
        { value: 'merit', label: 'Merit' },
        { value: 'lottery', label: 'Lottery' }
      ]
    }
  ]

  const renderRow = (office: Office, index: number) => (
    <tr key={office._id} className={`${resolvedTheme === 'dark' ? 'hover:bg-neutral-dark' : 'hover:bg-neutral-light'}`}>
      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
          {office.name}
        </div>
        <div className="text-sm text-neutral">
          {office.slug}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeClass(office.office_type)}`}>
          {office.office_type.replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-foreground">
          {office.governing_body?.name || 'N/A'}
        </div>
        {office.governing_body && (
          <div className="text-sm text-neutral">
            {office.governing_body.slug}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-foreground">
          {office.jurisdiction?.name || 'N/A'}
        </div>
        {office.jurisdiction && (
          <div className="text-sm text-neutral">
            {office.jurisdiction.slug}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-foreground">
          {office.district?.name || 'At Large'}
        </div>
        {office.district && (
          <div className="text-sm text-neutral">
            {office.district.district_type.replace('_', ' ')} {office.district.district_number}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
        {office.selection_method.replace(/\b\w/g, l => l.toUpperCase())}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {isAuthorized && (
          <div className="flex space-x-2">
            <button
              className={themeClasses.button.edit}
              aria-label={`Edit office ${office.name}`}
            >
              Edit
            </button>
            <button
              className={themeClasses.button.delete}
              aria-label={`Delete office ${office.name}`}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  )

  const renderForm = (office: Office | null, onSave: (data: any) => void, onCancel: () => void) => (
    <OfficeForm
      office={office}
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
      endpoint="/government/offices"
      title="Offices"
      columns={columns}
      renderRow={renderRow}
      renderForm={renderForm}
      searchFields={['name', 'office_type', 'governing_body.name', 'jurisdiction.name']}
      filters={filters}
      customFetchData={customFetchData}
    />
  )
}
