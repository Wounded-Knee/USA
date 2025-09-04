'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Quote } from '../Hero/data/quotes'
import { BackgroundOption } from '../Hero/data/backgrounds'
import { quotes } from '../Hero/data/quotes'
import { backgrounds } from '../Hero/data/backgrounds'

interface QOTDEditorProps {
  className?: string
}

const QOTDEditor: React.FC<QOTDEditorProps> = ({ className = '' }) => {
  const { user, hasRole } = useAuth()
  const [localQuotes, setLocalQuotes] = useState<Quote[]>(quotes)
  const [localBackgrounds, setLocalBackgrounds] = useState<BackgroundOption[]>(backgrounds)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [editingBackground, setEditingBackground] = useState<BackgroundOption | null>(null)
  const [showAddQuote, setShowAddQuote] = useState(false)
  const [showAddBackground, setShowAddBackground] = useState(false)
  const [activeTab, setActiveTab] = useState<'quotes' | 'backgrounds'>('quotes')
  const [jsonOutput, setJsonOutput] = useState('')

  // Generate JSON output
  useEffect(() => {
    const data = {
      quotes: localQuotes,
      backgrounds: localBackgrounds,
      lastUpdated: new Date().toISOString()
    }
    setJsonOutput(JSON.stringify(data, null, 2))
  }, [localQuotes, localBackgrounds])

  // Check if user has Developer role
  if (!user || !hasRole('developer')) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
        <div className="text-red-600 text-lg font-semibold mb-2">Access Restricted</div>
        <p className="text-red-500">This tool is only available to Developer users.</p>
      </div>
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const handleSaveQuote = (quote: Quote) => {
    if (editingQuote) {
      setLocalQuotes(prev => prev.map(q => q.id === quote.id ? quote : q))
      setEditingQuote(null)
    } else {
      setLocalQuotes(prev => [...prev, quote])
      setShowAddQuote(false)
    }
  }

  const handleSaveBackground = (background: BackgroundOption) => {
    if (editingBackground) {
      setLocalBackgrounds(prev => prev.map(b => b.id === background.id ? background : b))
      setEditingBackground(null)
    } else {
      setLocalBackgrounds(prev => [...prev, background])
      setShowAddBackground(false)
    }
  }

  const handleDeleteQuote = (id: string) => {
    if (confirm('Are you sure you want to delete this quote?')) {
      setLocalQuotes(prev => prev.filter(q => q.id !== id))
    }
  }

  const handleDeleteBackground = (id: string) => {
    if (confirm('Are you sure you want to delete this background?')) {
      setLocalBackgrounds(prev => prev.filter(b => b.id !== id))
    }
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">QOTD Editor</h2>
        <p className="text-blue-100 text-sm mt-1">Manage quotes and backgrounds for the Quote of the Day system</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quotes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quotes ({localQuotes.length})
          </button>
          <button
            onClick={() => setActiveTab('backgrounds')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'backgrounds'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Backgrounds ({localBackgrounds.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'quotes' ? (
          <div className="space-y-6">
            {/* Add Quote Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Quotes</h3>
              <button
                onClick={() => setShowAddQuote(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Quote
              </button>
            </div>

            {/* Quotes List */}
            <div className="grid gap-4">
              {localQuotes.map((quote) => (
                <div key={quote.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{quote.attribution.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">"{quote.text.direct}"</p>
                      <div className="flex flex-wrap gap-2">
                        {quote.tags.map((tag) => (
                          <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingQuote(quote)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add Background Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Backgrounds</h3>
              <button
                onClick={() => setShowAddBackground(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Background
              </button>
            </div>

            {/* Backgrounds List */}
            <div className="grid gap-4">
              {localBackgrounds.map((background) => (
                <div key={background.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{background.captions.brief}</h4>
                      <p className="text-gray-600 text-sm mb-2">{background.source.name}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {background.anchorPoint}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingBackground(background)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBackground(background.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JSON Export Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">JSON Export</h3>
            <button
              onClick={copyToClipboard}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
              {jsonOutput}
            </pre>
          </div>
        </div>
      </div>

      {/* Add/Edit Quote Modal */}
      {(showAddQuote || editingQuote) && (
        <QuoteForm
          quote={editingQuote || {
            id: generateId(),
            text: { abbreviated: '', direct: '' },
            source: { name: '' },
            attribution: { name: '' },
            date: new Date().toISOString().split('T')[0],
            explanation: '',
            backgroundIds: [],
            tags: []
          }}
          backgrounds={localBackgrounds}
          onSave={handleSaveQuote}
          onCancel={() => {
            setShowAddQuote(false)
            setEditingQuote(null)
          }}
        />
      )}

      {/* Add/Edit Background Modal */}
      {(showAddBackground || editingBackground) && (
        <BackgroundForm
          background={editingBackground || {
            id: generateId(),
            imageUrl: '',
            anchorPoint: 'center',
            source: { name: '' },
            attribution: { name: '' },
            captions: { abbreviated: '', brief: '', expansive: '' },
            safeZones: {
              main: { x: 200, y: 200, width: 800, height: 400 },
              secondary: { x: 900, y: 150, width: 600, height: 300 },
              caption: { x: 50, y: 800, width: 400, height: 100 },
              source: { x: 1400, y: 900, width: 300, height: 80 },
              attribution: { x: 1400, y: 980, width: 300, height: 60 }
            },
            colorPalette: {
              light: {
                primary: '#1e3a8a',
                secondary: '#16213e',
                accent: '#6b7a5a',
                text: '#ffffff',
                overlay: 'rgba(26, 26, 46, 0.4)'
              },
              dark: {
                primary: '#3b82f6',
                secondary: '#1e40af',
                accent: '#6b7a5a',
                text: '#ffffff',
                overlay: 'rgba(0, 0, 0, 0.6)'
              }
            }
          }}
          onSave={handleSaveBackground}
          onCancel={() => {
            setShowAddBackground(false)
            setEditingBackground(null)
          }}
        />
      )}
    </div>
  )
}

// Quote Form Component
interface QuoteFormProps {
  quote: Quote
  backgrounds: BackgroundOption[]
  onSave: (quote: Quote) => void
  onCancel: () => void
}

const QuoteForm: React.FC<QuoteFormProps> = ({ quote, backgrounds, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Quote>(quote)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {quote.id ? 'Edit Quote' : 'Add Quote'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text (Direct)</label>
            <textarea
              value={formData.text.direct}
              onChange={(e) => setFormData({ ...formData, text: { ...formData.text, direct: e.target.value } })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text (Abbreviated)</label>
            <input
              type="text"
              value={formData.text.abbreviated}
              onChange={(e) => setFormData({ ...formData, text: { ...formData.text, abbreviated: e.target.value } })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attribution Name</label>
              <input
                type="text"
                value={formData.attribution.name}
                onChange={(e) => setFormData({ ...formData, attribution: { ...formData.attribution, name: e.target.value } })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
              <input
                type="text"
                value={formData.source.name}
                onChange={(e) => setFormData({ ...formData, source: { ...formData.source, name: e.target.value } })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
            <select
              value={formData.backgroundIds[0] || ''}
              onChange={(e) => setFormData({ ...formData, backgroundIds: e.target.value ? [e.target.value] : [] })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white"
            >
              <option value="">Select a background image</option>
              {backgrounds.map(bg => (
                <option key={bg.id} value={bg.id}>
                  {bg.captions.brief}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500"
              placeholder="peace, unity, democracy"
            />
          </div>
          {/* QOTD Preview */}
          {formData.backgroundIds.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <QOTDPreview quote={formData} backgrounds={backgrounds} />
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Background Form Component
interface BackgroundFormProps {
  background: BackgroundOption
  onSave: (background: BackgroundOption) => void
  onCancel: () => void
}

const BackgroundForm: React.FC<BackgroundFormProps> = ({ background, onSave, onCancel }) => {
  const [formData, setFormData] = useState<BackgroundOption>(background)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {background.id ? 'Edit Background' : 'Add Background'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attribution Name</label>
              <input
                type="text"
                value={formData.attribution.name}
                onChange={(e) => setFormData({ ...formData, attribution: { ...formData.attribution, name: e.target.value } })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
              <input
                type="text"
                value={formData.source.name}
                onChange={(e) => setFormData({ ...formData, source: { ...formData.source, name: e.target.value } })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brief Caption</label>
            <input
              type="text"
              value={formData.captions.brief}
              onChange={(e) => setFormData({ ...formData, captions: { ...formData.captions, brief: e.target.value } })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// QOTD Preview Component
interface QOTDPreviewProps {
  quote: Quote
  backgrounds: BackgroundOption[]
}

const QOTDPreview: React.FC<QOTDPreviewProps> = ({ quote, backgrounds }) => {
  const background = backgrounds.find(bg => bg.id === quote.backgroundIds[0])
  
  if (!background) {
    return (
      <div className="p-4 text-center text-gray-500">
        No background selected for preview
      </div>
    )
  }

  // Get object-position CSS value based on anchor point
  const getObjectPosition = (anchorPoint: string): string => {
    switch (anchorPoint) {
      case 'top-left': return '0% 0%'
      case 'top-center': return '50% 0%'
      case 'top-right': return '100% 0%'
      case 'center-left': return '0% 50%'
      case 'center': return '50% 50%'
      case 'center-right': return '100% 50%'
      case 'bottom-left': return '0% 100%'
      case 'bottom-center': return '50% 100%'
      case 'bottom-right': return '100% 100%'
      default: return '50% 50%'
    }
  }

  const mainZoneStyles = {
    left: `${(background.safeZones.main.x / 1920) * 100}%`,
    top: `${(background.safeZones.main.y / 1080) * 100}%`,
    width: `${(background.safeZones.main.width / 1920) * 100}%`,
    height: `${(background.safeZones.main.height / 1080) * 100}%`
  }

  const attributionZoneStyles = {
    left: `${(background.safeZones.attribution.x / 1920) * 100}%`,
    top: `${(background.safeZones.attribution.y / 1080) * 100}%`,
    width: `${(background.safeZones.attribution.width / 1920) * 100}%`,
    height: `${(background.safeZones.attribution.height / 1080) * 100}%`
  }

  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={background.imageUrl}
          alt={background.captions.brief}
          className="w-full h-full object-cover"
          style={{ objectPosition: getObjectPosition(background.anchorPoint) }}
        />
        {/* Overlay for better text readability */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: background.colorPalette.light.overlay }}
        ></div>
      </div>

      {/* Quote Content - positioned in main safe zone */}
      <div 
        className="quote-content absolute z-10 text-center flex items-center justify-center px-2"
        style={mainZoneStyles}
      >
        <blockquote className="text-white max-w-full [text-shadow:0px_0px_3px_black]">
          <p className="text-sm font-light leading-tight mb-2 italic">
            &ldquo;{quote.text.direct}&rdquo;
          </p>
          <footer className="text-xs font-medium">
            <cite className="not-italic">
              — {quote.attribution.name}
            </cite>
            <div className="text-xs font-normal mt-1 opacity-90">
              {quote.source.name}
            </div>
          </footer>
        </blockquote>
      </div>

      {/* Background Attribution - positioned in attribution safe zone */}
      <div 
        className="attribution-content absolute z-20 text-white opacity-70 px-2 py-1"
        style={attributionZoneStyles}
      >
        <div className="text-right text-xs">
          <div>Photo: {background.attribution.name}</div>
          <div>Source: {background.source.name}</div>
        </div>
      </div>
    </div>
  )
}

export default QOTDEditor
