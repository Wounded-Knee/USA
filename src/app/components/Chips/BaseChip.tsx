'use client'

import React from 'react'

export interface BaseChipProps {
  id: string
  name: string
  description: string
  abbr?: string
  format?: 'default' | 'compact' | 'comprehensive' | 'icon'
  populationEstimate?: {
    year: number
    source: string
    estimate: number
  }
  isActive?: boolean
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

const BaseChip: React.FC<BaseChipProps> = ({
  id,
  name,
  description,
  abbr,
  populationEstimate,
  isActive = true,
  format = 'default', // default, compact, comprehensive, icon
  className = '',
  onClick,
  children
}) => {
  const baseClasses = `
    inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 
    transition-all duration-200 cursor-pointer
    ${isActive 
      ? 'border-blue-500 bg-blue-50 hover:bg-blue-100 hover:border-blue-600' 
      : 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
    }
    ${className}
  `

  return (
    <div 
      className={baseClasses.trim()}
      onClick={isActive ? onClick : undefined}
      title={description}
    >
      { format === 'icon' && (
        <>
          {abbr && (
            <span className="font-bold text-blue-700 text-lg">
              {abbr}
            </span>
          )}
        </>
      ) }
      { format === 'compact' && (
        <>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {name}
            </div>
          </div>
        </>
      ) }
      { format === 'default' && (
        <>
          {abbr && (
            <span className="font-bold text-blue-700 text-lg">
              {abbr}
            </span>
          )}

          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {name}
            </div>
          </div>
        </>
      ) }
      { format === 'comprehensive' && (
        <>
          {abbr && (
            <span className="font-bold text-blue-700 text-sm">
              {abbr}
            </span>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {name}
            </div>
            
            {populationEstimate && (
              <div className="text-xs text-gray-600">
                ~{populationEstimate.estimate.toLocaleString()} ({populationEstimate.year})
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default BaseChip
