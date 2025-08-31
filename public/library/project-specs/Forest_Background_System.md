# Forest Background System

## Overview
The Forest Background System provides a consistent, atmospheric background across all pages of the Whitepine application. Each page features a random forest treeline SVG that creates a subtle, darkening effect while maintaining readability and visual appeal.

## Features

### Core Functionality
- **Random Background Selection**: Each page loads with a randomly selected forest treeline SVG
- **Bottom Positioning**: Backgrounds are aligned to the bottom of the page (not viewport)
- **Light Opacity**: 15% opacity ensures content remains readable while providing atmospheric depth
- **Natural Scrolling**: Backgrounds appear at the bottom of the page content, not fixed to viewport
- **Proper Layering**: All content appears above the background with correct z-indexing

### Available Forest Images
- `/boundaries/Forest-3.svg` (152KB)
- `/boundaries/Forest-4.svg` (134KB)
- `/boundaries/Forest-5.svg` (16KB)
- `/boundaries/Forest-6.svg` (20KB)

## Technical Implementation

### Components

#### BackgroundProvider (`src/app/contexts/BackgroundContext.tsx`)
- Manages the global state of the selected forest background
- Provides random image selection functionality
- Offers a `refreshBackground()` method for changing backgrounds

#### ForestBackground (`src/app/components/ForestBackground.tsx`)
- Renders the selected forest SVG as a background
- Applies proper positioning and opacity styling
- Uses absolute positioning at the bottom of the page content

#### BackgroundRefreshButton (`src/app/components/BackgroundRefreshButton.tsx`)
- Utility component for manually refreshing the background
- Can be placed on any page to allow users to change backgrounds

### Hooks

#### useForestBackground (`src/app/hooks/useForestBackground.ts`)
- Provides easy access to background functionality
- Returns current image, refresh function, and available images list

### CSS Styling
```css
.forest-background {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
  min-height: 200px;
  pointer-events: none;
  z-index: 0;
  background-position: bottom center !important;
  background-repeat: no-repeat !important;
  background-size: contain !important;
}
```

## Usage

### Automatic Background (Default)
The background system is automatically applied to all pages through the root layout:

```tsx
// src/app/layout.tsx
<BackgroundProvider>
  <ForestBackground />
  <Navigation />
  {children}
</BackgroundProvider>
```

### Manual Background Refresh
To allow users to change backgrounds on specific pages:

```tsx
import BackgroundRefreshButton from '../components/BackgroundRefreshButton';

export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <BackgroundRefreshButton />
    </div>
  );
}
```

### Programmatic Background Control
To control backgrounds programmatically:

```tsx
import { useForestBackground } from '../hooks/useForestBackground';

export default function MyPage() {
  const { currentForestImage, refreshBackground, forestImages } = useForestBackground();
  
  const handleRefresh = () => {
    refreshBackground();
  };
  
  return (
    <div>
      <p>Current background: {currentForestImage}</p>
      <button onClick={handleRefresh}>Change Background</button>
    </div>
  );
}
```

## Design Considerations

### Visual Impact
- **Subtle Enhancement**: The 15% opacity ensures the background enhances rather than overwhelms
- **Atmospheric Depth**: Creates a sense of depth and connection to nature
- **Brand Consistency**: Aligns with the "Great Tree of Peace" theme

### Performance
- **SVG Format**: Vector graphics ensure crisp display at all resolutions
- **Absolute Positioning**: Positioned at bottom of page content, not viewport
- **Pointer Events**: Disabled to prevent interference with page interactions

### Accessibility
- **Low Contrast**: Light opacity ensures text remains readable
- **No Interference**: Background doesn't affect keyboard navigation or screen readers
- **Visual Hierarchy**: Content remains the primary focus

## Demo Page
Visit `/background-demo` to see the system in action and test background refreshing functionality.

## Future Enhancements
- **Time-based Backgrounds**: Different backgrounds for day/night cycles
- **Seasonal Variations**: Forest backgrounds that change with seasons
- **User Preferences**: Allow users to save preferred backgrounds
- **Animation**: Subtle animations for background transitions
- **Performance Optimization**: Lazy loading for background images

## File Structure
```
src/app/
├── components/
│   ├── ForestBackground.tsx
│   └── BackgroundRefreshButton.tsx
├── contexts/
│   └── BackgroundContext.tsx
├── hooks/
│   └── useForestBackground.ts
└── background-demo/
    └── page.tsx
```
