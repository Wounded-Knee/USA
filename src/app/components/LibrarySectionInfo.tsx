'use client'

import React from 'react'
import { LibrarySection, LibraryDocument } from './Library/data'

interface LibrarySectionInfoProps {
  section: LibrarySection
  documents: LibraryDocument[]
  filteredCount: number
}

const LibrarySectionInfo: React.FC<LibrarySectionInfoProps> = ({
  section,
  documents,
  filteredCount
}) => {
  const totalDocuments = documents.length
  const categoryCounts = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="bg-surface rounded-lg shadow-md p-6 mb-8 border border-neutral-light">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Overview */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {section.name}
          </h2>
          <p className="text-neutral mb-4">
            {section.description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-neutral">
            <span>{totalDocuments} total documents</span>
            <span>•</span>
            <span>{Object.keys(categoryCounts).length} categories</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Categories
          </h3>
          <div className="space-y-2">
            {Object.entries(categoryCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-neutral">{category}</span>
                  <span className="text-primary font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Filter Status */}
      {filteredCount !== totalDocuments && (
        <div className="mt-4 pt-4 border-t border-neutral-light">
          <p className="text-sm text-neutral">
            Showing {filteredCount} of {totalDocuments} documents
          </p>
        </div>
      )}
    </div>
  )
}

export default LibrarySectionInfo
