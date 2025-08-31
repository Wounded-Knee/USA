'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BaseModal from '../../../components/BaseModal'
import { useTheme } from '@/app/contexts/ThemeContext'

interface BreadcrumbItem {
  id: string
  name: string
  path: string
}

interface MediaBrowserProps {
  isAuthorized: boolean
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  breadcrumbs?: BreadcrumbItem[]
  onJurisdictionSelect?: (jurisdiction: any) => void
  currentJurisdictionFilter?: string | null
}

interface MediaItem {
  _id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  media_type: string
  title?: string
  description?: string
  alt_text?: string
  width?: number
  height?: number
  is_primary: boolean
  is_public: boolean
  uploaded_by: {
    _id: string
    username: string
    firstName: string
    lastName: string
  }
  jurisdiction?: { _id: string; name: string; slug: string }
  governing_body?: { _id: string; name: string; slug: string }
  office?: { _id: string; name: string; slug: string }
  position?: { _id: string; office: { _id: string; name: string }; person: { _id: string; firstName: string; lastName: string } }
  createdAt: string
  updatedAt: string
}

const MEDIA_TYPES = [
  'seal', 'flag', 'headshot', 'logo', 'building', 'document', 'signature', 'other'
]

const ENTITY_TYPES = [
  'jurisdiction', 'governing_body', 'office', 'position'
]

export default function MediaBrowser({ 
  isAuthorized, 
  isLoading, 
  setIsLoading,
  breadcrumbs = [],
  onJurisdictionSelect,
  currentJurisdictionFilter
}: MediaBrowserProps) {
  const { resolvedTheme } = useTheme()
  const [media, setMedia] = useState<MediaItem[]>([])
  const [selectedEntityType, setSelectedEntityType] = useState<string>('')
  const [selectedEntityId, setSelectedEntityId] = useState<string>('')
  const [entities, setEntities] = useState<any[]>([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    media_type: '',
    title: '',
    description: '',
    alt_text: '',
    entity_type: '',
    entity_id: ''
  })
  const [error, setError] = useState('')

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
    textMuted: resolvedTheme === 'dark' ? 'text-neutral' : 'text-neutral',
    card: resolvedTheme === 'dark' 
      ? 'bg-surface-dark border-neutral hover:bg-neutral-dark/50' 
      : 'bg-surface border-neutral-light hover:bg-neutral-light/50',
         input: resolvedTheme === 'dark'
       ? 'bg-surface-dark border-neutral text-foreground placeholder-neutral-light focus:border-primary focus:ring-primary'
       : 'bg-surface border-neutral text-foreground placeholder-neutral focus:border-primary focus:ring-primary',
     select: resolvedTheme === 'dark'
       ? 'bg-surface-dark border-neutral text-foreground focus:border-primary focus:ring-primary'
       : 'bg-surface border-neutral text-foreground focus:border-primary focus:ring-primary',
    button: {
      primary: resolvedTheme === 'dark'
        ? 'bg-primary hover:bg-primary-dark text-white focus:ring-primary-light'
        : 'bg-primary hover:bg-primary-dark text-white focus:ring-primary-light',
      secondary: resolvedTheme === 'dark'
        ? 'bg-neutral hover:bg-neutral-dark text-foreground focus:ring-neutral-light'
        : 'bg-neutral hover:bg-neutral-dark text-foreground focus:ring-neutral-light',
      danger: resolvedTheme === 'dark'
        ? 'bg-error hover:bg-error/80 text-white focus:ring-error/50'
        : 'bg-error hover:bg-error/80 text-white focus:ring-error/50'
    },
    badge: {
      primary: resolvedTheme === 'dark' ? 'bg-primary/20 text-primary-light border-primary/30' : 'bg-primary/10 text-primary border-primary/30',
      secondary: resolvedTheme === 'dark' ? 'bg-secondary/20 text-secondary-light border-secondary/30' : 'bg-secondary/10 text-secondary border-secondary/30',
      public: resolvedTheme === 'dark' ? 'bg-green-900/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-800 border-green-200',
      private: resolvedTheme === 'dark' ? 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    modal: resolvedTheme === 'dark'
      ? 'bg-surface-dark border-neutral'
      : 'bg-surface border-neutral-light',
    modalOverlay: 'bg-black bg-opacity-50'
  }

  // Fetch media
  const fetchMedia = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams()
      if (selectedEntityType && selectedEntityId) {
        params.set('entity_type', selectedEntityType)
        params.set('entity_id', selectedEntityId)
      }
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media?${params}`)
      setMedia(response.data.media || [])
    } catch (err: any) {
      console.error('Error fetching media:', err)
      setError(err.response?.data?.error || 'Failed to fetch media')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch entities for dropdown
  const fetchEntities = async (entityType: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/government/${entityType}s`)
      setEntities(response.data[`${entityType}s`] || [])
    } catch (err: any) {
      console.error(`Error fetching ${entityType}s:`, err)
    }
  }

  // Handle entity type change
  const handleEntityTypeChange = (entityType: string) => {
    setSelectedEntityType(entityType)
    setSelectedEntityId('')
    if (entityType) {
      fetchEntities(entityType)
    } else {
      setEntities([])
    }
  }

  // Handle file upload
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.file || !uploadForm.media_type) {
      setError('Please select a file and media type')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', uploadForm.file)
      formData.append('media_type', uploadForm.media_type)
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('alt_text', uploadForm.alt_text)
      
      if (uploadForm.entity_type && uploadForm.entity_id) {
        formData.append('entity_type', uploadForm.entity_type)
        formData.append('entity_id', uploadForm.entity_id)
      }

      // For now, use a default user ID - in production this would come from auth
      formData.append('uploaded_by', '68b244b1d9bd1067422b8712')

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setShowUploadForm(false)
      setUploadForm({
        file: null,
        media_type: '',
        title: '',
        description: '',
        alt_text: '',
        entity_type: '',
        entity_id: ''
      })
      fetchMedia() // Refresh media list
    } catch (err: any) {
      console.error('Error uploading file:', err)
      setError(err.response?.data?.error || 'Failed to upload file')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle media deletion
  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    setIsLoading(true)
    setError('')

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media/${mediaId}`)
      fetchMedia() // Refresh media list
    } catch (err: any) {
      console.error('Error deleting media:', err)
      setError(err.response?.data?.error || 'Failed to delete media')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle setting primary media
  const handleSetPrimary = async (mediaId: string, entityType: string, entityId: string) => {
    setIsLoading(true)
    setError('')

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media/${mediaId}/set-primary`,
        {
          entity_type: entityType,
          entity_id: entityId
        }
      )
      fetchMedia() // Refresh media list
    } catch (err: any) {
      console.error('Error setting primary media:', err)
      setError(err.response?.data?.error || 'Failed to set primary media')
    } finally {
      setIsLoading(false)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get entity name
  const getEntityName = (media: MediaItem) => {
    if (media.jurisdiction) return media.jurisdiction.name
    if (media.governing_body) return media.governing_body.name
    if (media.office) return media.office.name
    if (media.position) return `${media.position.office.name} - ${media.position.person.firstName} ${media.position.person.lastName}`
    return 'Unlinked'
  }

  // Get entity type
  const getEntityType = (media: MediaItem) => {
    if (media.jurisdiction) return 'Jurisdiction'
    if (media.governing_body) return 'Governing Body'
    if (media.office) return 'Office'
    if (media.position) return 'Position'
    return 'Unlinked'
  }

  useEffect(() => {
    fetchMedia()
  }, [selectedEntityType, selectedEntityId])

  return (
    <div className={`space-y-6 ${themeClasses.container} rounded-lg border p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${themeClasses.header}`}>Media Management</h2>
        {isAuthorized && (
          <button
            onClick={() => setShowUploadForm(true)}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.button.primary}`}
            aria-label="Upload new media"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Media
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className={`border rounded-md p-4 ${themeClasses.textMuted}`} role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Error</h3>
              <div className="mt-2 text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={`rounded-lg p-4 space-y-4 ${themeClasses.card} border`}>
        <h3 className={`text-lg font-medium ${themeClasses.header}`}>Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="entity-type" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
              Entity Type
            </label>
            <select
              id="entity-type"
              value={selectedEntityType}
              onChange={(e) => handleEntityTypeChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.select}`}
            >
              <option value="">All Entities</option>
              {ENTITY_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="entity-id" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
              Entity
            </label>
            <select
              id="entity-id"
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              disabled={!selectedEntityType}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.select} ${!selectedEntityType ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">All {selectedEntityType ? selectedEntityType.replace('_', ' ') + 's' : 'Entities'}</option>
              {entities.map(entity => (
                <option key={entity._id} value={entity._id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Upload Form Modal */}
      <BaseModal
        isOpen={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        title="Upload Media"
        size="lg"
        position="top"
        showCloseButton={true}
      >
        <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label htmlFor="file" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
                    File
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.input}`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="media-type" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
                    Media Type
                  </label>
                  <select
                    id="media-type"
                    value={uploadForm.media_type}
                    onChange={(e) => setUploadForm({ ...uploadForm, media_type: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.select}`}
                    required
                  >
                    <option value="">Select Media Type</option>
                    {MEDIA_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="title" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.input}`}
                  />
                </div>
                <div>
                  <label htmlFor="description" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.input}`}
                  />
                </div>
                <div>
                  <label htmlFor="alt-text" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
                    Alt Text
                  </label>
                  <input
                    type="text"
                    id="alt-text"
                    value={uploadForm.alt_text}
                    onChange={(e) => setUploadForm({ ...uploadForm, alt_text: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.input}`}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="uploadEntityType" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
                      Entity Type *
                    </label>
                    <select
                      id="uploadEntityType"
                      value={uploadForm.entity_type}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, entity_type: e.target.value, entity_id: '' }))}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.select}`}
                      required
                    >
                      <option value="">Select Entity Type</option>
                      {ENTITY_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="uploadEntityId" className={`block text-sm font-medium mb-1 ${themeClasses.header}`}>
                      Entity *
                    </label>
                    <select
                      id="uploadEntityId"
                      value={uploadForm.entity_id}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, entity_id: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.select}`}
                      required
                      disabled={!uploadForm.entity_type}
                    >
                      <option value="">Select Entity</option>
                      {entities.map(entity => (
                        <option key={entity._id} value={entity._id}>
                          {entity.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${themeClasses.button.secondary}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${themeClasses.button.primary} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
      </BaseModal>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className={`ml-2 ${themeClasses.header}`}>Loading media...</span>
        </div>
      ) : media.length === 0 ? (
        <div className={`text-center py-12 ${themeClasses.textSecondary}`}>
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No media found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <div key={item._id} className={`rounded-lg border p-4 ${themeClasses.card} transition-colors`}>
              {/* Media Preview */}
              <div className="aspect-w-16 aspect-h-9 mb-4">
                {item.mime_type.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.alt_text || item.title || item.original_name}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className={`w-full h-32 bg-neutral-light dark:bg-neutral-dark rounded flex items-center justify-center ${themeClasses.textMuted}`}>
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Media Info */}
              <div className="space-y-2">
                <h3 className={`font-medium ${themeClasses.text}`}>
                  {item.title || item.original_name}
                </h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>
                  {item.description}
                </p>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${themeClasses.badge.primary}`}>
                    {item.media_type}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${item.is_primary ? themeClasses.badge.primary : themeClasses.badge.secondary}`}>
                    {item.is_primary ? 'Primary' : 'Secondary'}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${item.is_public ? themeClasses.badge.public : themeClasses.badge.private}`}>
                    {item.is_public ? 'Public' : 'Private'}
                  </span>
                </div>

                {/* Entity Info */}
                <div className={`text-sm ${themeClasses.textMuted}`}>
                  <p><strong>Entity:</strong> {getEntityName(item)}</p>
                  <p><strong>Type:</strong> {getEntityType(item)}</p>
                  <p><strong>Size:</strong> {formatFileSize(item.size)}</p>
                  <p><strong>Uploaded:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Actions */}
                {isAuthorized && (
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => {
                        const entityType = item.jurisdiction ? 'jurisdiction' : 
                                         item.governing_body ? 'governing_body' : 
                                         item.office ? 'office' : 'position'
                        const entityId = item.jurisdiction?._id || 
                                       item.governing_body?._id || 
                                       item.office?._id || 
                                       item.position?._id
                        if (entityType && entityId) {
                          handleSetPrimary(item._id, entityType, entityId)
                        }
                      }}
                      disabled={item.is_primary}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        item.is_primary 
                          ? 'opacity-50 cursor-not-allowed' 
                          : themeClasses.button.secondary
                      }`}
                      aria-label={`Set ${item.title || item.original_name} as primary`}
                    >
                      {item.is_primary ? 'Primary' : 'Set Primary'}
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(item._id)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${themeClasses.button.danger}`}
                      aria-label={`Delete ${item.title || item.original_name}`}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
