'use client';

import BackgroundRefreshButton from '../components/BackgroundRefreshButton';
import { useForestBackground } from '../hooks/useForestBackground';

export default function BackgroundDemoPage() {
  const { currentForestImage, forestImages } = useForestBackground();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Forest Background System Demo
        </h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Current Background
          </h2>
          <p className="text-gray-700 mb-4">
            Current forest image: <code className="bg-gray-100 px-2 py-1 rounded">{currentForestImage}</code>
          </p>
          
          <BackgroundRefreshButton className="mb-4" />
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Available Forest Images:
            </h3>
            <ul className="space-y-2">
              {forestImages.map((image, index) => (
                <li key={image} className="flex items-center space-x-2">
                  <span className={`w-4 h-4 rounded-full ${currentForestImage === image ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{image}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How It Works
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The forest background system provides a consistent, atmospheric background across all pages:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Each page loads with a random forest treeline SVG from the available collection</li>
              <li>The background is positioned at the bottom of the page (not viewport)</li>
              <li>Light opacity (15%) ensures it darkens the background without overwhelming content</li>
              <li>The background scrolls naturally with the page content</li>
              <li>All content appears above the background with proper z-indexing</li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Technical Implementation:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• BackgroundProvider manages random image selection</li>
                <li>• ForestBackground component renders the SVG with proper styling</li>
                <li>• useForestBackground hook provides easy access to background controls</li>
                <li>• BackgroundRefreshButton allows users to change backgrounds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
