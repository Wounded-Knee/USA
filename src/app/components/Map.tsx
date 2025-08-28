'use client'

import React, { useState, useEffect } from 'react'
import { Map as MapboxMap } from 'react-map-gl/mapbox'
import DeckGL from '@deck.gl/react'
import { GeoJsonLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'

interface MapProps {
  longitude: number
  latitude: number
  zoom: number
}

// Available political boundary layers from Mapbox
const POLITICAL_LAYERS = {
  congressional: {
    id: 'congressional-districts',
    name: 'Congressional Districts',
    description: 'US Congressional district boundaries',
    visible: false
  },
  stateBoundaries: {
    id: 'state-boundaries', 
    name: 'State Boundaries',
    description: 'US state and territory boundaries',
    visible: false
  },
  administrative: {
    id: 'administrative-boundaries',
    name: 'Administrative Boundaries',
    description: 'County and local administrative boundaries',
    visible: false
  }
}

function ErrorMessage({ title, message }: { title: string, message: string }) {
  return (
    <div className="w-full h-[600px] relative bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">{title}</div>
          <div className="text-sm text-gray-600">{message}</div>
        </div>
      </div>
    </div>
  )
}

function LayerSelector({ 
  layers, 
  onLayerToggle 
}: { 
  layers: typeof POLITICAL_LAYERS, 
  onLayerToggle: (layerId: string) => void 
}) {
  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-lg p-4 z-20 border border-blue-200 min-w-[280px]">
      <div className="font-semibold text-blue-900 mb-3">Political Boundaries</div>
      <div className="space-y-2">
        {Object.entries(layers).map(([key, layer]) => (
          <label key={key} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={layer.visible}
              onChange={() => onLayerToggle(key)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{layer.name}</div>
              <div className="text-xs text-gray-500">{layer.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

function MapOverlay({ position, title, items }: { position: string, title: string, items: string[] }) {
  return (
    <div className={`absolute ${position} bg-white bg-opacity-90 rounded-lg shadow-lg p-3 text-sm z-10`}>
      <div className="font-medium text-gray-900 mb-2">{title}</div>
      <div className="text-gray-600 space-y-1">
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  )
}

export default function Map({ longitude, latitude, zoom }: MapProps) {
  const [mapboxToken, setMapboxToken] = useState<string | undefined>()
  const [mapError, setMapError] = useState<string | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<any>(null)
  const [layers, setLayers] = useState(POLITICAL_LAYERS)

  useEffect(() => {
    // Debug: Check if Mapbox token is available
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    console.info(`Mapbox token: ${!!token ? 'Available' : 'Unavailable'} ${!!token ? `(${token?.length}b)` : ''}`);
    setMapboxToken(token)
  }, [])

  const handleMapError = (error: Error | unknown) => {
    console.error('Mapbox error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown map error'
    setMapError(errorMessage)
  }

  const handleLayerToggle = (layerId: string) => {
    setLayers(prev => ({
      ...prev,
      [layerId]: {
        ...prev[layerId as keyof typeof POLITICAL_LAYERS],
        visible: !prev[layerId as keyof typeof POLITICAL_LAYERS].visible
      }
    }))
  }

  // Generate DeckGL layers based on selected layers
  const generateLayers = () => {
    const deckLayers: any[] = []
    
    // Add MVTLayer for each selected political boundary layer
    Object.entries(layers).forEach(([key, layer]) => {
      if (layer.visible) {
        deckLayers.push(
          new MVTLayer({
            id: layer.id,
            data: `https://api.mapbox.com/v4/mapbox.mapbox-political-v1/{z}/{x}/{y}.vector.pbf?access_token=${mapboxToken}`,
            getFillColor: [59, 130, 246, 80], // Blue with transparency
            getLineColor: [0, 0, 0, 255], // Black borders
            getLineWidth: 1,
            stroked: true,
            filled: true,
            lineWidthMinPixels: 1,
            pickable: true,
            onHover: (info: any) => {
              setHoveredFeature(info.object)
            },
            onClick: (info: any) => {
              if (info.object) {
                console.log('Feature clicked:', info.object.properties)
                // Add your click handler logic here
              }
            }
          })
        )
      }
    })

    return deckLayers
  }

  // Show error messages if needed
  if (!mapboxToken) {
    return <ErrorMessage title="Mapbox Token Missing" message="Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env file" />
  }
  
  if (mapError) {
    return <ErrorMessage title="Map Error" message={mapError} />
  }

  return (
    <div className="w-full h-[600px] relative bg-gradient-to-br from-blue-50 to-indigo-100">
      <DeckGL
        initialViewState={{
          longitude,
          latitude,
          zoom
        }}
        controller={true}
        layers={generateLayers()}
      >
        <MapboxMap
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={mapboxToken}
          style={{ width: '100%', height: '100%' }}
          onError={handleMapError}
        />
      </DeckGL>
      
      {/* Layer Selector */}
      <LayerSelector 
        layers={layers} 
        onLayerToggle={handleLayerToggle} 
      />

      {/* Map Controls Overlay */}
      <MapOverlay
        position="top-right"
        title="Map Controls"
        items={[
          '• Mouse: Pan',
          '• Scroll: Zoom',
          '• Right-click: Rotate',
          '• Hover: Feature Info'
        ]}
      />

      {/* Coordinates Display */}
      <MapOverlay
        position="bottom-left"
        title="Current Position"
        items={[
          `Lat: ${latitude.toFixed(4)}`,
          `Lng: ${longitude.toFixed(4)}`,
          `Zoom: ${zoom.toFixed(2)}`
        ]}
      />

      {/* Feature Info Tooltip */}
      {hoveredFeature && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-95 rounded-lg shadow-lg p-4 text-sm z-20 border border-blue-200 max-w-[300px]">
          <div className="font-semibold text-blue-900 mb-2">
            {hoveredFeature.properties?.name || 'Political Boundary'}
          </div>
          <div className="text-gray-700 space-y-1">
            {hoveredFeature.properties?.admin_level && (
              <div>Level: {hoveredFeature.properties.admin_level}</div>
            )}
            {hoveredFeature.properties?.wikidata && (
              <div>Wikidata: {hoveredFeature.properties.wikidata}</div>
            )}
            {hoveredFeature.properties?.name_en && (
              <div>Name: {hoveredFeature.properties.name_en}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}