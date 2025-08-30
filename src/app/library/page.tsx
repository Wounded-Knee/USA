'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LibraryHero from '../components/LibraryHero'
import LibrarySectionInfo from '../components/LibrarySectionInfo'
import { 
  librarySections, 
  libraryDocuments, 
  getDocumentsBySection, 
  getCategoriesBySection,
  type LibraryDocument 
} from '../components/Library/data'

export default function LibraryPage() {
  const [selectedSection, setSelectedSection] = useState('whimsy')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [isHeroCompact, setIsHeroCompact] = useState(false)

  // Reset category when section changes
  useEffect(() => {
    setSelectedCategory('All')
  }, [selectedSection])

  // Listen for hero state changes
  useEffect(() => {
    const handleScroll = () => {
      setIsHeroCompact(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Get documents for current section
  const sectionDocuments = getDocumentsBySection(selectedSection)
  
  // Filter documents based on search and category
  const filteredDocuments = sectionDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      {/* Hero Section */}
      <LibraryHero
        sections={librarySections}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Documents Section */}
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        style={{ 
          paddingTop: isHeroCompact ? '5rem' : 'calc(100vh + 3rem)',
          transition: 'padding-top 0.3s ease-in-out'
        }}
      >
        {/* Section Info */}
        <LibrarySectionInfo
          section={librarySections.find(s => s.id === selectedSection)!}
          documents={sectionDocuments}
          filteredCount={filteredDocuments.length}
        />

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Link
              key={doc.filename}
              href={`/document/${encodeURIComponent(doc.filename)}`}
              className="bg-surface rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-neutral-light hover:border-primary group"
            >
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary border border-primary/30 rounded-full">
                    {doc.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {doc.title}
                </h3>
                
                <p className="text-neutral text-sm mb-4 line-clamp-3">
                  {doc.excerpt}
                </p>
                
                <div className="flex items-center justify-end">
                  <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary-dark transition-colors duration-200">
                    Read More
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-foreground">No documents found</h3>
              <p className="mt-1 text-sm text-neutral">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
