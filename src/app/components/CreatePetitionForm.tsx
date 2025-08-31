'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Jurisdiction {
  _id: string
  name: string
  slug: string
  level: string
  path: string
}

interface GoverningBody {
  _id: string
  name: string
  slug: string
  branch: string
  entity_type: string
}

interface Legislation {
  _id: string
  title: string
  bill_number: string
  status: string
}

interface CreatePetitionFormProps {
  onSuccess?: (petition: any) => void
  onCancel?: () => void
}

const CreatePetitionForm: React.FC<CreatePetitionFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    targetVotes: 1000,
    jurisdiction: '',
    governingBody: '',
    legislation: ''
  })

  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([])
  const [governingBodies, setGoverningBodies] = useState<GoverningBody[]>([])
  const [legislation, setLegislation] = useState<Legislation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { value: 'environment', label: 'Environment' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'economy', label: 'Economy' },
    { value: 'civil-rights', label: 'Civil Rights' },
    { value: 'foreign-policy', label: 'Foreign Policy' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    fetchJurisdictions()
  }, [])

  useEffect(() => {
    if (formData.jurisdiction) {
      fetchGoverningBodies(formData.jurisdiction)
    } else {
      setGoverningBodies([])
      setFormData(prev => ({ ...prev, governingBody: '', legislation: '' }))
    }
  }, [formData.jurisdiction])

  useEffect(() => {
    if (formData.governingBody) {
      fetchLegislation(formData.governingBody)
    } else {
      setLegislation([])
      setFormData(prev => ({ ...prev, legislation: '' }))
    }
  }, [formData.governingBody])

  const fetchJurisdictions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/jurisdictions`)
      setJurisdictions(response.data)
    } catch (err) {
      console.error('Error fetching jurisdictions:', err)
      setError('Failed to load jurisdictions')
    }
  }

  const fetchGoverningBodies = async (jurisdictionId: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/governing-bodies?jurisdiction=${jurisdictionId}`)
      setGoverningBodies(response.data)
    } catch (err) {
      console.error('Error fetching governing bodies:', err)
    }
  }

  const fetchLegislation = async (governingBodyId: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/legislation?governingBody=${governingBodyId}`)
      setLegislation(response.data)
    } catch (err) {
      console.error('Error fetching legislation:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // For demo purposes, using a hardcoded user ID. In a real app, this would come from authentication
      const creatorId = "68b244b1d9bd1067422b8712" // Maria Rodriguez's ID from our demo

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions`, {
        ...formData,
        creatorId
      })

      setLoading(false)
      if (onSuccess) {
        onSuccess(response.data)
      }
    } catch (err: any) {
      setLoading(false)
      setError(err.response?.data?.error || 'Failed to create petition')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-surface rounded-lg shadow-lg p-8 border border-neutral-light">
      <h2 className="text-2xl font-bold text-foreground mb-6">Create a New Petition</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral mb-2">
            Petition Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            minLength={5}
            maxLength={200}
            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground"
            placeholder="Enter a clear, concise title for your petition"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            minLength={20}
            maxLength={2000}
            rows={6}
            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground resize-none"
            placeholder="Explain the issue, why it matters, and what change you want to see..."
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Jurisdiction */}
        <div>
          <label htmlFor="jurisdiction" className="block text-sm font-medium text-neutral mb-2">
            Jurisdiction *
          </label>
          <select
            id="jurisdiction"
            name="jurisdiction"
            value={formData.jurisdiction}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground"
          >
            <option value="">Select a jurisdiction</option>
            {jurisdictions.map((jurisdiction) => (
              <option key={jurisdiction._id} value={jurisdiction._id}>
                {jurisdiction.name} ({jurisdiction.level})
              </option>
            ))}
          </select>
        </div>

        {/* Governing Body */}
        <div>
          <label htmlFor="governingBody" className="block text-sm font-medium text-neutral mb-2">
            Target Governing Body (Optional)
          </label>
          <select
            id="governingBody"
            name="governingBody"
            value={formData.governingBody}
            onChange={handleInputChange}
            disabled={!formData.jurisdiction}
            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground disabled:opacity-50"
          >
            <option value="">Select a governing body (optional)</option>
            {governingBodies.map((body) => (
              <option key={body._id} value={body._id}>
                {body.name} ({body.branch})
              </option>
            ))}
          </select>
        </div>

        {/* Legislation */}
        <div>
          <label htmlFor="legislation" className="block text-sm font-medium text-neutral mb-2">
            Related Legislation (Optional)
          </label>
          <select
            id="legislation"
            name="legislation"
            value={formData.legislation}
            onChange={handleInputChange}
            disabled={!formData.governingBody}
            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground disabled:opacity-50"
          >
            <option value="">Select related legislation (optional)</option>
            {legislation.map((bill) => (
              <option key={bill._id} value={bill._id}>
                {bill.bill_number}: {bill.title} ({bill.status})
              </option>
            ))}
          </select>
        </div>

        {/* Target Votes */}
        <div>
          <label htmlFor="targetVotes" className="block text-sm font-medium text-neutral mb-2">
            Target Number of Votes
          </label>
          <input
            type="number"
            id="targetVotes"
            name="targetVotes"
            value={formData.targetVotes}
            onChange={handleInputChange}
            min={1}
            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground"
            placeholder="1000"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Creating...' : 'Create Petition'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-neutral text-white py-3 px-6 rounded-lg font-semibold hover:bg-neutral-dark transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default CreatePetitionForm
