'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface WhimsyDocument {
  title: string
  filename: string
  excerpt: string
  category: string
  date?: string
}

const whimsyDocuments: WhimsyDocument[] = [
  {
    title: "Back to the Future as Prophetic Media",
    filename: "Back to the Future II.md",
    excerpt: "A dissertation exploring how Back to the Future Part II functioned as cultural foresight, with Biff Tannen's character eerily predicting Donald Trump's political rise.",
    category: "Cultural Analysis"
  },
  {
    title: "Back to the Future",
    filename: "Back to the Future.md",
    excerpt: "Further exploration of the prophetic nature of the Back to the Future franchise and its cultural significance.",
    category: "Cultural Analysis"
  },
  {
    title: "Vigor Feature Guide",
    filename: "Vigor_Feature_Guide.md",
    excerpt: "Comprehensive guide to the Vigor feature - a revolutionary addition that allows users to channel emotional conviction into their votes through gamified activities.",
    category: "Platform Features"
  },
  {
    title: "Moral Evaluation",
    filename: "Moral_Evaluation.md",
    excerpt: "Philosophical exploration of moral evaluation systems and their role in democratic processes.",
    category: "Philosophy"
  },
  {
    title: "Ron Paul",
    filename: "Ron Paul.md",
    excerpt: "Reflections on Ron Paul's political philosophy and libertarian principles.",
    category: "Political Thought"
  },
  {
    title: "John Wayne #1",
    filename: "John Wayne #1.md",
    excerpt: "Cultural analysis of John Wayne's impact on American identity and political mythology.",
    category: "Cultural Analysis"
  },
  {
    title: "Federalist #86",
    filename: "Federalist #86.md",
    excerpt: "Contemporary interpretation of Federalist Paper #86 and its relevance to modern governance.",
    category: "Constitutional Thought"
  },
  {
    title: "Donald Trump",
    filename: "Donald Trump.md",
    excerpt: "Analysis of Donald Trump's political phenomenon and its cultural implications.",
    category: "Political Analysis"
  },
  {
    title: "Federalist #87",
    filename: "Federalist #87.md",
    excerpt: "Modern reading of Federalist Paper #87 and its application to current political challenges.",
    category: "Constitutional Thought"
  },
  {
    title: "Sitting Bull",
    filename: "Sitting Bull.md",
    excerpt: "Reflections on Sitting Bull's leadership and the intersection of indigenous wisdom with democratic principles.",
    category: "Indigenous Wisdom"
  },
  {
    title: "Davy Crockett",
    filename: "Davy Crockett.md",
    excerpt: "Exploration of Davy Crockett's legacy and the American frontier mythos.",
    category: "Cultural Analysis"
  },
  {
    title: "Vietnam #1",
    filename: "Vietnam #1.md",
    excerpt: "Analysis of the Vietnam War's impact on American political consciousness and democratic institutions.",
    category: "Historical Analysis"
  },
  {
    title: "Twain #1",
    filename: "Twain #1.md",
    excerpt: "Mark Twain's insights on democracy, human nature, and the American experiment.",
    category: "Literary Analysis"
  },
  {
    title: "A. Lincoln",
    filename: "A. Lincoln.md",
    excerpt: "Abraham Lincoln's vision for a Civilian Voice Branch - a new branch of government to amplify the people's voice.",
    category: "Constitutional Innovation"
  },
  {
    title: "Political Capital Economic System",
    filename: "Political Capital.md",
    excerpt: "A comprehensive exploration of Political Capital as a civic currency system that works alongside Vigor to create a dual-currency democracy where both passion and patience have weight.",
    category: "Platform Features"
  },
  {
    title: "Vigor vs. Capital",
    filename: "Vigor vs. Capital.md",
    excerpt: "A concise comparison of how Vigor and Political Capital work together as complementary forms of civic influence - immediate passion versus stored cumulative will.",
    category: "Platform Features"
  }
]

const categories = [
  "All",
  "Cultural Analysis",
  "Platform Features", 
  "Philosophy",
  "Political Thought",
  "Constitutional Thought",
  "Political Analysis",
  "Indigenous Wisdom",
  "Historical Analysis",
  "Literary Analysis",
  "Constitutional Innovation"
]

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDocuments = whimsyDocuments.filter(doc => {
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Library of Whimsical Thoughts
          </h1>
          <p className="text-xl text-neutral max-w-3xl mx-auto">
            A collection of philosophical musings, cultural analyses, and innovative ideas 
            that explore the intersection of democracy, technology, and human nature.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 text-foreground bg-surface border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface text-neutral hover:bg-neutral-light border border-neutral-light'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-neutral">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
          </p>
        </div>

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
