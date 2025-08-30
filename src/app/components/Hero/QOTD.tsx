'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { getTodaysQuoteAndBackground } from './utils/quoteSelector'
import { AnchorPoint } from './data/backgrounds'

const QOTD: React.FC = () => {
  const { quote, background } = getTodaysQuoteAndBackground()

  // Enhanced responsive positioning with viewport considerations
  const getSafeZoneStyles = useMemo(() => {
    return (safeZone: { x: number; y: number; width: number; height: number }) => {
      // Base dimensions (1920x1080) for safe zone calculations
      const baseWidth = 1920
      const baseHeight = 1080
      
      // Calculate percentages for responsive positioning
      const xPercent = (safeZone.x / baseWidth) * 100
      const yPercent = (safeZone.y / baseHeight) * 100
      const widthPercent = (safeZone.width / baseWidth) * 100
      const heightPercent = (safeZone.height / baseHeight) * 100

      // Ensure minimum readable sizes for very small viewports
      const minWidth = Math.max(widthPercent, 80) // At least 80% width on small screens
      const minHeight = Math.max(heightPercent, 40) // At least 40% height on small screens

      return {
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        width: `${widthPercent}%`,
        height: `${heightPercent}%`,
        minWidth: `${minWidth}%`,
        minHeight: `${minHeight}%`
      }
    }
  }, [])

  // Get object-position CSS value based on anchor point
  const getObjectPosition = (anchorPoint: AnchorPoint): string => {
    switch (anchorPoint) {
      case 'top-left':
        return '0% 0%'
      case 'top-center':
        return '50% 0%'
      case 'top-right':
        return '100% 0%'
      case 'center-left':
        return '0% 50%'
      case 'center':
        return '50% 50%'
      case 'center-right':
        return '100% 50%'
      case 'bottom-left':
        return '0% 100%'
      case 'bottom-center':
        return '50% 100%'
      case 'bottom-right':
        return '100% 100%'
      default:
        return '50% 50%'
    }
  }

  const mainZoneStyles = getSafeZoneStyles(background.safeZones.main)
  const attributionZoneStyles = getSafeZoneStyles(background.safeZones.attribution)
  const objectPosition = getObjectPosition(background.anchorPoint)

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="background-image absolute inset-0 z-0">
        <Image
          src={background.imageUrl}
          alt={background.captions.brief}
          fill
          className="object-cover"
          style={{ objectPosition }}
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: background.colorPalette.light.overlay }}
        ></div>
      </div>

      {/* Quote Content - positioned in main safe zone */}
      <div 
        className="quote-content absolute z-10 text-center flex items-center justify-center px-4"
        style={mainZoneStyles}
      >
        <blockquote className="text-white max-w-full [text-shadow:0px_0px_3px_black] transition-colors duration-300">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light leading-tight mb-4 md:mb-6 italic">
            &ldquo;{quote.text.direct}&rdquo;
          </p>
          <footer className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
            <cite className="not-italic">
              — {quote.attribution.name}
            </cite>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-normal mt-1 md:mt-2 opacity-90">
              {quote.source.name}
            </div>
          </footer>
        </blockquote>
      </div>

      {/* Background Attribution - positioned in attribution safe zone */}
      <div 
                    className="attribution-content absolute z-20 text-white opacity-70 px-2 py-1 transition-colors duration-300"
        style={attributionZoneStyles}
      >
        <div className="text-right text-xs sm:text-sm">
          <div>Photo: {background.attribution.name}</div>
          <div>Source: {background.source.name}</div>
        </div>
      </div>

      {/* Fallback positioning for extreme aspect ratios */}
      <div className="attribution-fallback absolute inset-0 pointer-events-none">
        {/* Mobile fallback - ensure content is always visible */}
        <div className="block md:hidden absolute bottom-4 left-4 right-4 z-30">
          <div className="bg-black bg-opacity-50 rounded-lg p-3 text-white text-xs transition-colors duration-300">
            <div>Photo: {background.attribution.name}</div>
            <div>Source: {background.source.name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QOTD