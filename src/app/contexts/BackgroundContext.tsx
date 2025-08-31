'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface BackgroundContextType {
  selectedForestImage: string;
  refreshBackground: () => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const FOREST_IMAGES = [
  '/boundaries/Forest-3.svg',
  '/boundaries/Forest-4.svg',
  '/boundaries/Forest-5.svg',
  '/boundaries/Forest-6.svg',
];

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [selectedForestImage, setSelectedForestImage] = useState<string>('');

  const selectRandomForest = () => {
    const randomIndex = Math.floor(Math.random() * FOREST_IMAGES.length);
    setSelectedForestImage(FOREST_IMAGES[randomIndex]);
  };

  const refreshBackground = () => {
    selectRandomForest();
  };

  useEffect(() => {
    // Select initial random forest image
    selectRandomForest();
  }, []);

  return (
    <BackgroundContext.Provider value={{ selectedForestImage, refreshBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
