'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CreatePetitionFormProps {
  onClose: () => void
}

export default function CreatePetitionForm({ onClose }: CreatePetitionFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetVotes: 100,
    vigorPoints: 5
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to new petition
    router.push('/petitions/new-petition-id')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetVotes' || name === 'vigorPoints' ? parseInt(value) : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-surface)] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Create New Petition</h2>
            <button
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Petition Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
              placeholder="Enter a clear, concise title for your petition"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
              placeholder="Explain what you're petitioning for and why it matters"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="environment">Environment</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="transportation">Transportation</option>
              <option value="public-safety">Public Safety</option>
              <option value="community-development">Community Development</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Target Votes */}
          <div>
            <label htmlFor="targetVotes" className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Target Votes
            </label>
            <input
              type="number"
              id="targetVotes"
              name="targetVotes"
              min="10"
              max="10000"
              value={formData.targetVotes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
            />
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Minimum 10 votes required to launch
            </p>
          </div>

          {/* Vigor Points */}
          <div>
            <label htmlFor="vigorPoints" className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Your Vigor Points
            </label>
            <input
              type="number"
              id="vigorPoints"
              name="vigorPoints"
              min="1"
              max="10"
              value={formData.vigorPoints}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
            />
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              How much energy are you willing to invest? (1-10 points)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Creating...' : 'Create Petition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
