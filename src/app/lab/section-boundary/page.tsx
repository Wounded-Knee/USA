'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import SectionBoundary from '../../components/SectionBoundary'

export default function SectionBoundaryDemo() {
  const [selectedVariant, setSelectedVariant] = useState<'Forest-3' | 'Forest-4' | 'Forest-5' | 'Forest-6'>('Forest-5')

  const demoColors = [
    'var(--background)',
    'var(--surface)',
    'var(--primary)',
    'var(--secondary)',
    'var(--accent)',
    'var(--neutral-light)',
    '#f8fafc', // slate-50
    '#e2e8f0', // slate-200
    '#cbd5e1', // slate-300
  ]

  const demoVariants = [
    { id: 'Forest-3', name: 'Forest 3', description: 'Dense forest canopy pattern' },
    { id: 'Forest-4', name: 'Forest 4', description: 'Medium density forest pattern' },
    { id: 'Forest-5', name: 'Forest 5', description: 'Sparse forest pattern (default)' },
    { id: 'Forest-6', name: 'Forest 6', description: 'Minimal forest pattern' }
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Section Boundary Component
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Aesthetic transition components that provide smooth visual separation between page sections. 
              Features natural forest patterns with customizable colors.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/lab"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
              >
                Back to Lab
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="bg-surface border border-neutral-light rounded-lg p-6 mb-8">
          <h2 className="text-foreground font-semibold text-xl mb-6">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variant Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Boundary Variant
              </label>
              <div className="grid grid-cols-2 gap-2">
                {demoVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id as any)}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      selectedVariant === variant.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface text-foreground border-neutral-light hover:border-primary'
                    }`}
                  >
                    <div className="font-medium">{variant.name}</div>
                    <div className="text-xs opacity-75">{variant.description}</div>
                  </button>
                ))}
              </div>
            </div>

                         {/* Color Preview */}
             <div>
               <label className="block text-sm font-medium text-foreground mb-3">
                 Bottom Color Options (for section below)
               </label>
               <div className="grid grid-cols-3 gap-2">
                 {demoColors.map((color, index) => (
                   <div
                     key={index}
                     className="aspect-square rounded-lg border-2 border-neutral-light cursor-pointer hover:border-primary transition-colors"
                     style={{ backgroundColor: color }}
                     title={color}
                   />
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-surface border border-neutral-light rounded-lg p-6 mb-8">
          <h2 className="text-foreground font-semibold text-xl mb-6">Live Preview</h2>
          
          <div className="space-y-0">
                         {/* Section Above */}
             <div className="bg-background p-6">
               <h3 className="font-medium text-foreground mb-2">Section Above</h3>
               <p className="text-sm text-neutral">This section has a background color. The boundary below will transition to the next section.</p>
             </div>

             {/* Boundary */}
             <SectionBoundary 
               topColor="var(--background)" 
               bottomColor="var(--surface)" 
               variant={selectedVariant}
             />

             {/* Section Below */}
             <div className="bg-surface p-6">
               <h3 className="font-medium text-foreground mb-2">Section Below</h3>
               <p className="text-sm text-neutral">This section has a white background. The boundary above creates a smooth transition.</p>
             </div>
          </div>
        </div>

                 {/* Color Examples */}
         <div className="bg-surface border border-neutral-light rounded-lg p-6 mb-8">
           <h2 className="text-foreground font-semibold text-xl mb-6">Bottom Color Examples</h2>
          
          <div className="space-y-0">
            {demoColors.map((color, index) => (
              <div key={index} className="space-y-0">
                                                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                   <h4 className="font-medium text-gray-900 mb-1">Section Above (Light Gradient)</h4>
                   <p className="text-sm text-gray-700">Boundary transitions to {color}</p>
                 </div>
                 <SectionBoundary topColor="rgb(239 246 255)" bottomColor={color} variant={selectedVariant} />
                 <div 
                   className="p-4"
                   style={{ backgroundColor: color }}
                 >
                                     <h4 className="font-medium mb-1" style={{ color: color === 'var(--background)' ? 'var(--foreground)' : 'white' }}>
                     Section Below ({color})
                   </h4>
                   <p className="text-sm" style={{ color: color === 'var(--background)' ? 'var(--neutral)' : 'rgba(255,255,255,0.8)' }}>
                     Background matches the boundary bottom color
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variant Examples */}
        <div className="bg-surface border border-neutral-light rounded-lg p-6">
          <h2 className="text-foreground font-semibold text-xl mb-6">All Variants</h2>
          
          <div className="space-y-0">
            {demoVariants.map((variant) => (
              <div key={variant.id} className="space-y-0">
                                 <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                   <h4 className="font-medium text-gray-900 mb-1">{variant.name}</h4>
                   <p className="text-sm text-gray-700">{variant.description}</p>
                 </div>
                 <SectionBoundary topColor="rgb(239 246 255)" bottomColor="var(--surface)" variant={variant.id as any} />
                 <div className="bg-surface p-4">
                   <h4 className="font-medium text-foreground mb-1">Section Below</h4>
                   <p className="text-sm text-neutral">White background section</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
