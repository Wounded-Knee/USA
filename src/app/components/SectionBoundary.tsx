'use client'

import React, { useState, useEffect } from 'react'

interface SectionBoundaryProps {
  /**
   * The color to use for the boundary SVG
   * topColor should match the background color of the section above
   * bottomColor should match the background color of the section below
   */
  topColor?: string
  bottomColor?: string
  /**
   * Additional CSS classes to apply
   */
  className?: string
  /**
   * The style variant of the boundary
   * @default "Forest-5"
   */
  variant?: 'Forest-3' | 'Forest-4' | 'Forest-5' | 'Forest-6'
}

export default function SectionBoundary({
  topColor = 'var(--background)',
  bottomColor = 'var(--background)',
  className = '',
  variant = 'Forest-5'
}: SectionBoundaryProps) {
  const [height, setHeight] = useState<number>(60) // Default fallback height

  useEffect(() => {
    const calculateHeight = async () => {
      try {
        const response = await fetch(`/boundaries/${variant}.svg`)
        const svgText = await response.text()
        
        // Parse SVG to get viewBox or width/height
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
        const svgElement = svgDoc.querySelector('svg')
        
        if (svgElement) {
          const viewBox = svgElement.getAttribute('viewBox')
          const width = svgElement.getAttribute('width')
          const height = svgElement.getAttribute('height')
          
          let aspectRatio = 0.2 // Default aspect ratio if we can't determine it
          
          if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)
            if (vbWidth && vbHeight) {
              aspectRatio = vbHeight / vbWidth
            }
          } else if (width && height) {
            aspectRatio = Number(height) / Number(width)
          }
          
          // Calculate height based on full width (100vw) and aspect ratio
          const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
          const calculatedHeight = containerWidth * aspectRatio
          
          setHeight(Math.max(calculatedHeight, 60)) // Minimum height of 60px
        }
      } catch (error) {
        console.warn('Failed to calculate SVG height, using default:', error)
        setHeight(60)
      }
    }

    calculateHeight()
  }, [variant])

  return (
    <div 
      className={`w-full relative ${className}`}
      style={{ 
        background: topColor,
        height: `${height}px`
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: bottomColor,
          WebkitMask: `url("/boundaries/${variant}.svg") no-repeat center/cover`,
          mask: `url("/boundaries/${variant}.svg") no-repeat center/cover`
        }}
      />
    </div>
  )
}
