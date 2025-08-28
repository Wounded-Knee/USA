'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the Map component to avoid SSR issues with WebGL
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">Loading Map...</p>
      </div>
    </div>
  )
})

export default function MapPage() {
  // Default coordinates for California (San Francisco area)
  const defaultLocation = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 10
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Map
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Explore our interactive map powered by Deck.gl technology. 
            Navigate, zoom, and interact with the visualization below.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Map 
            longitude={defaultLocation.longitude}
            latitude={defaultLocation.latitude}
            zoom={defaultLocation.zoom}
          />
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>
            <strong>Controls:</strong> Use mouse to pan, scroll to zoom, and right-click to rotate.
          </p>
        </div>
      </div>
    </div>
  )
}
