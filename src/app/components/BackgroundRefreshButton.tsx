'use client';

import { useBackground } from '../contexts/BackgroundContext';

interface BackgroundRefreshButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function BackgroundRefreshButton({ 
  className = '', 
  children = '🔄 Refresh Background' 
}: BackgroundRefreshButtonProps) {
  const { refreshBackground } = useBackground();

  return (
    <button
      onClick={refreshBackground}
      className={`px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ${className}`}
      title="Change the forest background"
    >
      {children}
    </button>
  );
}
