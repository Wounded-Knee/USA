'use client'

import React from 'react'

interface Segment {
  name: string
  outcome: string
  threshold: number
  color?: string
}

interface PetitionVotesProgressbarProps {
  currentVotes: number
  targetVotes: number
  currentVigor?: number
  currentCapital?: number
  title?: string
  showPercentage?: boolean
  showVoteCount?: boolean
  showClout?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'detailed'
  segments?: Segment[]
  className?: string
}

// Clout calculation function
function calculateClout(votes: number, vigor: number = 0, capital: number = 0): number {
  // Base clout from votes
  const voteClout = votes
  
  // Vigor contribution with multiplier
  const vigorMultiplier = 1 + (vigor / 1000) // Normalize vigor to reasonable range
  const vigorClout = vigor * vigorMultiplier
  
  // Capital contribution with multiplier
  const capitalMultiplier = 1 + (capital / 10000) // Normalize capital to reasonable range
  const capitalClout = capital * capitalMultiplier
  
  return Math.round(voteClout + vigorClout + capitalClout)
}

export default function PetitionVotesProgressbar({
  currentVotes,
  targetVotes,
  currentVigor = 0,
  currentCapital = 0,
  title,
  showPercentage = true,
  showVoteCount = true,
  showClout = true,
  size = 'md',
  variant = 'default',
  segments = [],
  className = ''
}: PetitionVotesProgressbarProps) {
  const currentClout = calculateClout(currentVotes, currentVigor, currentCapital)
  const targetClout = calculateClout(targetVotes, currentVigor, currentCapital)
  
  // Use clout for progress calculation if segments are provided, otherwise use votes
  const progressValue = segments.length > 0 ? currentClout : currentVotes
  const progressTarget = segments.length > 0 ? targetClout : targetVotes
  
  const percentage = Math.min((progressValue / progressTarget) * 100, 100)
  const isComplete = progressValue >= progressTarget

  // Determine which segments are completed
  const completedSegments = segments.filter(segment => currentClout >= segment.threshold)
  const nextSegment = segments.find(segment => currentClout < segment.threshold)

  // Size classes
  const sizeClasses = {
    sm: {
      progress: 'h-2',
      text: 'text-sm',
      title: 'text-sm',
      count: 'text-xs',
      padding: 'p-3',
      segment: 'text-xs'
    },
    md: {
      progress: 'h-3',
      text: 'text-base',
      title: 'text-base',
      count: 'text-sm',
      padding: 'p-4',
      segment: 'text-sm'
    },
    lg: {
      progress: 'h-4',
      text: 'text-lg',
      title: 'text-lg',
      count: 'text-base',
      padding: 'p-6',
      segment: 'text-base'
    }
  }

  // Variant styles
  const variantStyles: Record<string, any> = {};
  variantStyles['prototype'] = {
    container: 'bg-surface border border-neutral-light rounded-lg shadow-sm',
    progress: 'bg-neutral-light shadow-inner ring-1 ring-inset ring-neutral-dark/10',
    progressFill: isComplete ? 'bg-success' : 'bg-primary',
    text: 'text-foreground'
  };
  variantStyles['default'] = {
    ...variantStyles['prototype'],
  };
  variantStyles['compact'] = {
    ...variantStyles['prototype'],
    container: 'bg-transparent'
  };
  variantStyles['detailed'] = {
    ...variantStyles['prototype'],
    container: 'bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg shadow-md'
  };

  const currentSize = sizeClasses[size]
  const currentVariant = variantStyles[variant]

  // Generate stacked progress segments for votes, vigor, and capital with gradient blending
  const renderStackedProgress = () => {
    const totalClout = currentClout
    if (totalClout === 0) return null

    // If goal is reached, show solid federal color
    if (isComplete) {
      return (
        <div className="w-full h-full rounded-full bg-primary transition-all duration-1000 ease-out" />
      )
    }

    const votePercentage = (currentVotes / totalClout) * 100
    const vigorClout = currentVigor * (1 + currentVigor / 1000)
    const vigorPercentage = (vigorClout / totalClout) * 100
    const capitalClout = currentCapital * (1 + currentCapital / 10000)
    const capitalPercentage = (capitalClout / totalClout) * 100

    return (
      <div className="flex w-full h-full rounded-full overflow-hidden">
        {/* Votes segment - White */}
        {currentVotes > 0 && (
          <div 
            className="bg-gradient-to-r from-white to-gray-100 transition-all duration-1000 ease-out"
            style={{ width: `${votePercentage}%` }}
            title={`Votes: ${currentVotes.toLocaleString()} (${votePercentage.toFixed(1)}%)`}
          />
        )}
        
        {/* Vigor segment with blend - Yellow */}
        {currentVigor > 0 && (
          <div 
            className={`transition-all duration-1000 ease-out ${
              currentVotes > 0 
                ? 'bg-gradient-to-r from-gray-100 via-yellow-400 to-yellow-300' 
                : 'bg-gradient-to-r from-yellow-400 to-yellow-300'
            }`}
            style={{ width: `${vigorPercentage}%` }}
            title={`Vigor: ${currentVigor.toLocaleString()} (${vigorPercentage.toFixed(1)}%)`}
          />
        )}
        
        {/* Capital segment with blend - Red */}
        {currentCapital > 0 && (
          <div 
            className={`transition-all duration-1000 ease-out ${
              currentVigor > 0 
                ? 'bg-gradient-to-r from-yellow-300 via-red-500 to-red-400' 
                : currentVotes > 0
                  ? 'bg-gradient-to-r from-gray-100 via-red-500 to-red-400'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${capitalPercentage}%` }}
            title={`Capital: ${currentCapital.toLocaleString()} (${capitalPercentage.toFixed(1)}%)`}
          />
        )}
      </div>
    )
  }

  // Generate segment markers for progress bar
  const renderSegmentMarkers = () => {
    if (segments.length === 0) return null

    return (
      <div className="relative w-full">
        {segments.map((segment, index) => {
          const segmentPercentage = (segment.threshold / progressTarget) * 100
          const isCompleted = currentClout >= segment.threshold
          const isNext = nextSegment?.name === segment.name
          
          return (
            <div
              key={segment.name}
              className="absolute top-0 bottom-0 flex items-center group"
              style={{ left: `${Math.min(segmentPercentage, 100)}%` }}
            >
              {/* Segment marker line */}
              <div className={`w-1 h-full ${
                isCompleted 
                  ? 'bg-success' 
                  : isNext 
                    ? 'bg-primary' 
                    : 'bg-neutral-light'
              } rounded-full transition-colors duration-200`} />
              
              {/* Segment tooltip/indicator */}
              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-sm ${
                isCompleted 
                  ? 'bg-success text-white' 
                  : isNext 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-light text-neutral'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
                {segment.name}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`${currentVariant.container} ${currentSize.padding} ${className}`}>
      {/* Header */}
      {(title || variant === 'detailed') && (
        <div className="flex justify-between items-center mb-3">
          {title && (
            <h3 className={`${currentSize.title} font-semibold ${currentVariant.text} flex-1 mr-4`}>
              {title}
            </h3>
          )}
          {variant === 'detailed' && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className={`${currentSize.count} text-neutral`}>
                {isComplete ? 'Goal Reached!' : 'Clout Needed'}
              </span>
              {isComplete && (
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className={`w-full ${currentSize.progress} ${currentVariant.progress} rounded-full overflow-hidden relative`}>
          {renderSegmentMarkers()}
          <div
            className={`${currentSize.progress} relative z-10 transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          >
            {renderStackedProgress()}
          </div>
        </div>
      </div>

      {/* Component Legend */}
      {(currentVigor > 0 || currentCapital > 0) && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2 items-center">
            {currentVotes > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-r from-white to-gray-100 rounded border border-gray-300"></div>
                <span className={`${currentSize.segment} text-neutral`}>Votes</span>
              </div>
            )}
            {currentVigor > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded"></div>
                <span className={`${currentSize.segment} text-neutral`}>Vigor</span>
              </div>
            )}
            {currentCapital > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded"></div>
                <span className={`${currentSize.segment} text-neutral`}>Capital</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Segments Info */}
      {segments.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {segments.map((segment, index) => {
              const isCompleted = currentClout >= segment.threshold
              const isNext = nextSegment?.name === segment.name
              
              return (
                <div
                  key={segment.name}
                  className={`inline-flex items-center px-2 py-1 rounded-full ${currentSize.segment} font-medium transition-colors duration-200 ${
                    isCompleted 
                      ? 'bg-success text-white' 
                      : isNext 
                        ? 'bg-primary text-white' 
                        : 'bg-neutral-light text-neutral'
                  }`}
                  title={`${segment.name}: ${segment.outcome}`}
                >
                  {isCompleted && (
                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="truncate">{segment.name}</span>
                </div>
              )
            })}
          </div>
          
          {/* Next milestone info */}
          {nextSegment && (
            <div className={`${currentSize.segment} text-neutral mt-2`}>
              <span className="font-medium">Next:</span> {nextSegment.outcome} 
              <span className="ml-2">
                ({currentClout.toLocaleString()} / {nextSegment.threshold.toLocaleString()} clout)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className={`${currentSize.text} ${currentVariant.text} flex-1 mr-4`}>
          {showVoteCount && (
            <div>
              <span className="font-semibold">
                {currentVotes.toLocaleString()}
                <span className="text-neutral font-normal">
                  {' '}/ {targetVotes.toLocaleString()} votes
                </span>
              </span>
              {showClout && (
                <div className={`${currentSize.count} text-neutral`}>
                  <span className="font-medium">Clout:</span> {currentClout.toLocaleString()}
                  {currentVigor > 0 && <span className="ml-2">(+{currentVigor} vigor)</span>}
                  {currentCapital > 0 && <span className="ml-2">(+{currentCapital} capital)</span>}
                </div>
              )}
            </div>
          )}
        </div>
        
        {showPercentage && (
          <div className={`${currentSize.count} ${currentVariant.text} flex-shrink-0`}>
            <span className={`font-semibold ${isComplete ? 'text-success' : 'text-primary'}`}>
              {percentage.toFixed(1)}%
            </span>
            {isComplete && (
              <span className="text-success ml-1">✓</span>
            )}
          </div>
        )}
      </div>

      {/* Compact variant additional info */}
      {variant === 'compact' && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-neutral">
            <span>{segments.length > 0 ? 'Clout Progress' : 'Progress'}</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
