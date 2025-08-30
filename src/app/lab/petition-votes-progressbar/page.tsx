'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import PetitionVotesProgressbar from '../../components/PetitionVotesProgressbar'

interface Segment {
  name: string
  outcome: string
  threshold: number
  color?: string
}

export default function PetitionVotesProgressbarPage() {
  const [currentVotes, setCurrentVotes] = useState(750)
  const [targetVotes, setTargetVotes] = useState(1000)
  const [currentVigor, setCurrentVigor] = useState(250)
  const [currentCapital, setCurrentCapital] = useState(500)
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'compact' | 'detailed'>('default')
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [showTitle, setShowTitle] = useState(true)
  const [showPercentage, setShowPercentage] = useState(true)
  const [showVoteCount, setShowVoteCount] = useState(true)
  const [showClout, setShowClout] = useState(true)
  const [useSegments, setUseSegments] = useState(true)

  // Sample segments for demonstration
  const sampleSegments: Segment[] = [
    {
      name: 'Launch',
      outcome: 'Petition goes live',
      threshold: 100
    },
    {
      name: 'Momentum',
      outcome: 'Featured on homepage',
      threshold: 500
    },
    {
      name: 'Viral',
      outcome: 'Social media promotion',
      threshold: 1000
    },
    {
      name: 'Critical Mass',
      outcome: 'Official response required',
      threshold: 2500
    },
    {
      name: 'Victory',
      outcome: 'Petition succeeds',
      threshold: 5000
    }
  ]

  const demoData = [
    { 
      current: 250, 
      target: 1000, 
      vigor: 100,
      capital: 200,
      title: 'Environmental Protection Petition',
      segments: sampleSegments
    },
    { 
      current: 750, 
      target: 1000, 
      vigor: 300,
      capital: 600,
      title: 'Community Safety Initiative',
      segments: sampleSegments
    },
    { 
      current: 1000, 
      target: 1000, 
      vigor: 500,
      capital: 1000,
      title: 'Completed Petition Example',
      segments: sampleSegments
    },
    { 
      current: 1500, 
      target: 1000, 
      vigor: 750,
      capital: 1500,
      title: 'Exceeded Goal Example',
      segments: sampleSegments
    },
    { 
      current: 50, 
      target: 1000, 
      vigor: 25,
      capital: 50,
      title: 'Early Stage Petition',
      segments: sampleSegments
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Link 
              href="/lab"
              className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Lab
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">
              Petition Votes Progressbar
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              A unified progress bar component with segment support and Clout calculation. 
              Tracks petition progress through multiple milestones using votes, vigor, and capital.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="bg-surface border border-neutral-light rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-foreground font-semibold text-lg mb-4">Component Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vote Controls */}
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Current Votes
              </label>
              <input
                type="number"
                value={currentVotes}
                onChange={(e) => setCurrentVotes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-light rounded-md text-foreground bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
            </div>
            
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Target Votes
              </label>
              <input
                type="number"
                value={targetVotes}
                onChange={(e) => setTargetVotes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-light rounded-md text-foreground bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* Clout Controls */}
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Current Vigor
              </label>
              <input
                type="number"
                value={currentVigor}
                onChange={(e) => setCurrentVigor(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-light rounded-md text-foreground bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Current Capital
              </label>
              <input
                type="number"
                value={currentCapital}
                onChange={(e) => setCurrentCapital(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-light rounded-md text-foreground bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* Variant Selection */}
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Variant
              </label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value as any)}
                className="w-full px-3 py-2 border border-neutral-light rounded-md text-foreground bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              >
                <option value="default">Default</option>
                <option value="compact">Compact</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as any)}
                className="w-full px-3 py-2 border border-neutral-light rounded-md text-foreground bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showTitle}
                  onChange={(e) => setShowTitle(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-foreground text-sm">Show Title</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showPercentage}
                  onChange={(e) => setShowPercentage(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-foreground text-sm">Show Percentage</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showVoteCount}
                  onChange={(e) => setShowVoteCount(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-foreground text-sm">Show Vote Count</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showClout}
                  onChange={(e) => setShowClout(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-foreground text-sm">Show Clout</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useSegments}
                  onChange={(e) => setUseSegments(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-foreground text-sm">Use Segments</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-surface border border-neutral-light rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-foreground font-semibold text-lg mb-4">Live Preview</h2>
          <div className="max-w-2xl">
            <PetitionVotesProgressbar
              currentVotes={currentVotes}
              targetVotes={targetVotes}
              currentVigor={currentVigor}
              currentCapital={currentCapital}
              title={showTitle ? "Sample Petition Title" : undefined}
              showPercentage={showPercentage}
              showVoteCount={showVoteCount}
              showClout={showClout}
              size={selectedSize}
              variant={selectedVariant}
              segments={useSegments ? sampleSegments : []}
            />
          </div>
        </div>

        {/* Clout Calculation Info */}
        <div className="bg-surface border border-neutral-light rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-foreground font-semibold text-lg mb-4">Clout Calculation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-foreground font-medium text-base mb-2">Formula</h3>
              <div className="bg-neutral-light p-4 rounded text-sm">
                <p className="mb-2"><strong>Clout = Votes + (Vigor × VigorMultiplier) + (Capital × CapitalMultiplier)</strong></p>
                <ul className="space-y-1 text-neutral">
                  <li>• Votes = direct contribution</li>
                  <li>• VigorMultiplier = 1 + (vigor / 1000)</li>
                  <li>• CapitalMultiplier = 1 + (capital / 10000)</li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-foreground font-medium text-base mb-2">Current Calculation</h3>
              <div className="bg-neutral-light p-4 rounded text-sm">
                <p className="mb-2"><strong>Current Clout: {Math.round(currentVotes + (currentVigor * (1 + currentVigor / 1000)) + (currentCapital * (1 + currentCapital / 10000))).toLocaleString()}</strong></p>
                <ul className="space-y-1 text-neutral">
                  <li>• Votes: {currentVotes.toLocaleString()}</li>
                  <li>• Vigor: {Math.round(currentVigor * (1 + currentVigor / 1000)).toLocaleString()}</li>
                  <li>• Capital: {Math.round(currentCapital * (1 + currentCapital / 10000)).toLocaleString()}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* All Variants */}
        <div className="space-y-8">
          <h2 className="text-foreground font-semibold text-2xl">All Variants with Segments</h2>
          
          {/* Default Variant */}
          <div>
            <h3 className="text-foreground font-semibold text-lg mb-4">Default Variant</h3>
            <div className="space-y-4">
              {demoData.map((data, index) => (
                <PetitionVotesProgressbar
                  key={`default-${index}`}
                  currentVotes={data.current}
                  targetVotes={data.target}
                  currentVigor={data.vigor}
                  currentCapital={data.capital}
                  title={data.title}
                  variant="default"
                  size="md"
                  segments={data.segments}
                />
              ))}
            </div>
          </div>

          {/* Compact Variant */}
          <div>
            <h3 className="text-foreground font-semibold text-lg mb-4">Compact Variant</h3>
            <div className="space-y-4">
              {demoData.map((data, index) => (
                <PetitionVotesProgressbar
                  key={`compact-${index}`}
                  currentVotes={data.current}
                  targetVotes={data.target}
                  currentVigor={data.vigor}
                  currentCapital={data.capital}
                  title={data.title}
                  variant="compact"
                  size="md"
                  segments={data.segments}
                />
              ))}
            </div>
          </div>

          {/* Detailed Variant */}
          <div>
            <h3 className="text-foreground font-semibold text-lg mb-4">Detailed Variant</h3>
            <div className="space-y-4">
              {demoData.map((data, index) => (
                <PetitionVotesProgressbar
                  key={`detailed-${index}`}
                  currentVotes={data.current}
                  targetVotes={data.target}
                  currentVigor={data.vigor}
                  currentCapital={data.capital}
                  title={data.title}
                  variant="detailed"
                  size="md"
                  segments={data.segments}
                />
              ))}
            </div>
          </div>

          {/* Size Comparison */}
          <div>
            <h3 className="text-foreground font-semibold text-lg mb-4">Size Comparison</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-foreground font-medium text-sm mb-2">Small Size</h4>
                <PetitionVotesProgressbar
                  currentVotes={750}
                  targetVotes={1000}
                  currentVigor={300}
                  currentCapital={600}
                  title="Small Progress Bar"
                  variant="default"
                  size="sm"
                  segments={sampleSegments}
                />
              </div>
              <div>
                <h4 className="text-foreground font-medium text-sm mb-2">Medium Size</h4>
                <PetitionVotesProgressbar
                  currentVotes={750}
                  targetVotes={1000}
                  currentVigor={300}
                  currentCapital={600}
                  title="Medium Progress Bar"
                  variant="default"
                  size="md"
                  segments={sampleSegments}
                />
              </div>
              <div>
                <h4 className="text-foreground font-medium text-sm mb-2">Large Size</h4>
                <PetitionVotesProgressbar
                  currentVotes={750}
                  targetVotes={1000}
                  currentVigor={300}
                  currentCapital={600}
                  title="Large Progress Bar"
                  variant="default"
                  size="lg"
                  segments={sampleSegments}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-surface border border-neutral-light rounded-lg p-6 shadow-sm">
          <h2 className="text-foreground font-semibold text-lg mb-4">Usage Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-foreground font-medium text-base mb-2">Basic Usage</h3>
              <pre className="bg-neutral-light p-3 rounded text-sm overflow-x-auto">
{`<PetitionVotesProgressbar
  currentVotes={750}
  targetVotes={1000}
  title="Petition Title"
/>`}
              </pre>
            </div>
            <div>
              <h3 className="text-foreground font-medium text-base mb-2">With Clout Calculation</h3>
              <pre className="bg-neutral-light p-3 rounded text-sm overflow-x-auto">
{`<PetitionVotesProgressbar
  currentVotes={750}
  targetVotes={1000}
  currentVigor={300}
  currentCapital={600}
  showClout={true}
/>`}
              </pre>
            </div>
            <div>
              <h3 className="text-foreground font-medium text-base mb-2">With Segments</h3>
              <pre className="bg-neutral-light p-3 rounded text-sm overflow-x-auto">
{`<PetitionVotesProgressbar
  currentVotes={750}
  targetVotes={1000}
  currentVigor={300}
  currentCapital={600}
  segments={[
    { name: 'Launch', outcome: 'Petition goes live', threshold: 100 },
    { name: 'Momentum', outcome: 'Featured on homepage', threshold: 500 },
    { name: 'Victory', outcome: 'Petition succeeds', threshold: 1000 }
  ]}
/>`}
              </pre>
            </div>
            <div>
              <h3 className="text-foreground font-medium text-base mb-2">Complete Configuration</h3>
              <pre className="bg-neutral-light p-3 rounded text-sm overflow-x-auto">
{`<PetitionVotesProgressbar
  currentVotes={750}
  targetVotes={1000}
  currentVigor={300}
  currentCapital={600}
  title="Detailed Petition"
  variant="detailed"
  size="lg"
  showClout={true}
  segments={sampleSegments}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
