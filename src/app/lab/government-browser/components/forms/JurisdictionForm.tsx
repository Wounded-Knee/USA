'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/app/contexts/ThemeContext'

interface JurisdictionFormProps {
  jurisdiction?: any
  parentOptions: { value: string; label: string }[]
  onSave: (data: any) => void
  onCancel: () => void
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

export default function JurisdictionForm({ 
  jurisdiction, 
  parentOptions, 
  onSave, 
  onCancel 
}: JurisdictionFormProps) {
  const { resolvedTheme } = useTheme()
  const [formData, setFormData] = useState({
    name: jurisdiction?.name || '',
    slug: jurisdiction?.slug || '',
    level: jurisdiction?.level || 'municipal',
    entity_type: jurisdiction?.entity_type || 'jurisdiction',
    parent: jurisdiction?.parent || '',
    description: jurisdiction?.description || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Theme-aware class names
  const themeClasses = {
    container: resolvedTheme === 'dark' 
      ? 'bg-surface-dark border-neutral-dark' 
      : 'bg-surface border-neutral-light',
    header: resolvedTheme === 'dark' 
      ? 'text-foreground' 
      : 'text-foreground',
    text: resolvedTheme === 'dark' ? 'text-foreground' : 'text-foreground',
    textSecondary: resolvedTheme === 'dark' ? 'text-neutral-light' : 'text-neutral-dark',
    input: resolvedTheme === 'dark'
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500',
    select: resolvedTheme === 'dark'
      ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400'
      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
    textarea: resolvedTheme === 'dark'
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500',
    button: {
      primary: resolvedTheme === 'dark'
        ? 'bg-primary hover:bg-primary-dark text-white focus:ring-primary-light'
        : 'bg-primary hover:bg-primary-dark text-white focus:ring-primary-light',
      secondary: resolvedTheme === 'dark'
        ? 'bg-neutral hover:bg-neutral-dark text-foreground focus:ring-neutral-light'
        : 'bg-neutral hover:bg-neutral-dark text-foreground focus:ring-neutral-light'
    },
    error: resolvedTheme === 'dark'
      ? 'text-error/80'
      : 'text-error'
  }

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-generate slug from name
    if (field === 'name' && !jurisdiction?.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    if (!formData.level) {
      newErrors.level = 'Level is required'
    }

    if (!formData.entity_type) {
      newErrors.entity_type = 'Entity type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.input} ${errors.name ? 'border-error' : ''}`}
          placeholder="Enter jurisdiction name"
          required
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className={`mt-1 text-sm ${themeClasses.error}`}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Slug Field */}
      <div>
        <label htmlFor="slug" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
          Slug *
        </label>
        <input
          type="text"
          id="slug"
          value={formData.slug}
          onChange={(e) => handleInputChange('slug', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.input} ${errors.slug ? 'border-error' : ''}`}
          placeholder="jurisdiction-slug"
          required
          aria-describedby={errors.slug ? 'slug-error' : undefined}
        />
        {errors.slug && (
          <p id="slug-error" className={`mt-1 text-sm ${themeClasses.error}`}>
            {errors.slug}
          </p>
        )}
        <p className={`mt-1 text-xs ${themeClasses.textSecondary}`}>
          URL-friendly identifier (auto-generated from name)
        </p>
      </div>

      {/* Level Field */}
      <div>
        <label htmlFor="level" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
          Level *
        </label>
        <select
          id="level"
          value={formData.level}
          onChange={(e) => handleInputChange('level', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.select} ${errors.level ? 'border-error' : ''}`}
          required
          aria-describedby={errors.level ? 'level-error' : undefined}
        >
          {LEVELS.map(level => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.level && (
          <p id="level-error" className={`mt-1 text-sm ${themeClasses.error}`}>
            {errors.level}
          </p>
        )}
      </div>

      {/* Entity Type Field */}
      <div>
        <label htmlFor="entity_type" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
          Entity Type *
        </label>
        <select
          id="entity_type"
          value={formData.entity_type}
          onChange={(e) => handleInputChange('entity_type', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.select} ${errors.entity_type ? 'border-error' : ''}`}
          required
          aria-describedby={errors.entity_type ? 'entity-type-error' : undefined}
        >
          {ENTITY_TYPES.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.entity_type && (
          <p id="entity-type-error" className={`mt-1 text-sm ${themeClasses.error}`}>
            {errors.entity_type}
          </p>
        )}
      </div>

      {/* Parent Field */}
      <div>
        <label htmlFor="parent" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
          Parent Jurisdiction
        </label>
        <select
          id="parent"
          value={formData.parent}
          onChange={(e) => handleInputChange('parent', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.select}`}
        >
          {parentOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className={`mt-1 text-xs ${themeClasses.textSecondary}`}>
          Leave empty for top-level jurisdictions
        </p>
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.textarea}`}
          placeholder="Enter jurisdiction description"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${themeClasses.button.secondary}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${themeClasses.button.primary}`}
        >
          {jurisdiction ? 'Update' : 'Create'} Jurisdiction
        </button>
      </div>
    </form>
  )
}
