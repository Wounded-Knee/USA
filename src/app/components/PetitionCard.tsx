'use client'

import { useState } from 'react'
import Link from 'next/link'

interface PetitionCardProps {
  petition: {
    id: string
    title: string
    description: string
    category: string
    currentVotes: number
    targetVotes: number
    vigorPoints: number
    status: 'draft' | 'active' | 'successful' | 'failed'
    createdAt: string
    author: {
      name: string
      avatar?: string
    }
  }
  onVote?: (petitionId: string) => void
  onVigor?: (petitionId: string, points: number) => void
}

export default function PetitionCard({ petition, onVote, onVigor }: PetitionCardProps) {
  const [showVigorSlider, setShowVigorSlider] = useState(false)
  const [vigorPoints, setVigorPoints] = useState(5)

  const progressPercentage = Math.min((petition.currentVotes / petition.targetVotes) * 100, 100)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[var(--color-success)] text-[var(--color-text-on-primary)]'
      case 'successful':
        return 'bg-[var(--color-success)] text-[var(--color-text-on-primary)]'
      case 'failed':
        return 'bg-[var(--color-error)] text-[var(--color-text-on-primary)]'
      case 'draft':
        return 'bg-[var(--color-secondary)] text-[var(--color-text-on-primary)]'
      default:
        return 'bg-[var(--color-secondary)] text-[var(--color-text-on-primary)]'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'successful':
        return 'Successful'
      case 'failed':
        return 'Failed'
      case 'draft':
        return 'Draft'
      default:
        return status
    }
  }

  const handleVigorSubmit = () => {
    if (onVigor) {
      onVigor(petition.id, vigorPoints)
      setShowVigorSlider(false)
      setVigorPoints(5)
    }
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-lg shadow-lg border border-[var(--color-border)] overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="p-6 border-b border-[var(--color-border)]">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 line-clamp-2">
              {petition.title}
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm line-clamp-3">
              {petition.description}
            </p>
          </div>
          <span className={`ml-4 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(petition.status)}`}>
            {getStatusText(petition.status)}
          </span>
        </div>

        {/* Category and Author */}
        <div className="flex items-center justify-between text-sm">
          <span className="px-2 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-md">
            {petition.category}
          </span>
          <div className="flex items-center space-x-2">
            {petition.author.avatar && (
              <img 
                src={petition.author.avatar} 
                alt={petition.author.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-[var(--color-text-secondary)]">
              by {petition.author.name}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-6">
        {/* Vote Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Votes Progress</span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {petition.currentVotes} / {petition.targetVotes}
            </span>
          </div>
          <div className="w-full bg-[var(--color-border)] rounded-full h-2">
            <div 
              className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {Math.round(progressPercentage)}% complete
          </p>
        </div>

        {/* Vigor Points */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Community Vigor</span>
            <span className="text-sm text-[var(--color-success)] font-medium">
              {petition.vigorPoints} points
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < petition.vigorPoints 
                    ? 'bg-[var(--color-success)]' 
                    : 'bg-[var(--color-border)]'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => onVote?.(petition.id)}
            className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 font-medium"
          >
            Vote
          </button>
          
          <button
            onClick={() => setShowVigorSlider(!showVigorSlider)}
            className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200"
          >
            Add Vigor
          </button>
        </div>

        {/* Vigor Slider */}
        {showVigorSlider && (
          <div className="mt-4 p-4 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
            <div className="mb-3">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                How much energy are you willing to invest? ({vigorPoints} points)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={vigorPoints}
                onChange={(e) => setVigorPoints(parseInt(e.target.value))}
                className="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleVigorSubmit}
                className="flex-1 px-3 py-2 bg-[var(--color-success)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-success-hover)] transition-colors duration-200 text-sm"
              >
                Submit Vigor
              </button>
              <button
                onClick={() => setShowVigorSlider(false)}
                className="px-3 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-[var(--color-background)] border-t border-[var(--color-border)]">
        <div className="flex justify-between items-center text-sm text-[var(--color-text-muted)]">
          <span>Created {new Date(petition.createdAt).toLocaleDateString()}</span>
          <Link 
            href={`/petitions/${petition.id}`}
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}
