'use client'

import React from 'react'
import Image from 'next/image'

interface LibrarySection {
  id: string
  name: string
  description: string
  backgroundImage: string
  categories: string[]
}

interface LibraryHeroProps {
  sections: LibrarySection[]
  selectedSection: string
  onSectionChange: (sectionId: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

const LibraryHero: React.FC<LibraryHeroProps> = ({
  sections,
  selectedSection,
  onSectionChange,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange
}) => {
  const currentSection = sections.find(section => section.id === selectedSection) || sections[0]

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentSection.backgroundImage}
          alt={`${currentSection.name} background`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 [text-shadow:0px_2px_4px_rgba(0,0,0,0.8)]">
          Library
        </h1>
        
        {/* Section Description */}
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto [text-shadow:0px_1px_2px_rgba(0,0,0,0.8)]">
          {currentSection.description}
        </p>

        {/* Section Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                  selectedSection === section.id
                    ? 'bg-white text-gray-900 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-6 py-4 pl-12 pr-6 text-gray-900 bg-white/95 backdrop-blur-sm border-0 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg placeholder-gray-600"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {['All', ...currentSection.categories].map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LibraryHero
