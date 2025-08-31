import { useBackground } from '../contexts/BackgroundContext';

export function useForestBackground() {
  const { selectedForestImage, refreshBackground } = useBackground();
  
  return {
    currentForestImage: selectedForestImage,
    refreshBackground,
    forestImages: [
      '/boundaries/Forest-3.svg',
      '/boundaries/Forest-4.svg',
      '/boundaries/Forest-5.svg',
      '/boundaries/Forest-6.svg',
    ]
  };
}
