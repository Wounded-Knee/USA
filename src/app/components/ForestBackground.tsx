'use client';

import { useBackground } from '../contexts/BackgroundContext';

interface ForestBackgroundProps {
  className?: string;
}

export default function ForestBackground({ className = '' }: ForestBackgroundProps) {
  const { selectedForestImage } = useBackground();

  if (!selectedForestImage) {
    return null;
  }

  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 pointer-events-none z-0 ${className}`}
      style={{
        backgroundImage: `url(${selectedForestImage})`,
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        opacity: 0.15, // Light opacity to darken the background
        filter: 'brightness(0.8) contrast(1.2)', // Enhance the darkening effect
        height: '300px', // Set a fixed height for the forest background
        minHeight: '200px', // Ensure minimum height on smaller screens
      }}
    />
  );
}
