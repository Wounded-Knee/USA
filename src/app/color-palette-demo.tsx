'use client'

import React from 'react'

interface ColorSwatch {
  id: string
  name: string
  description: string
  className: string
}

const federalColors: ColorSwatch[] = [
  // Row 1 - Greens and Muted Tones
  { id: '14257', name: 'Federal Standard 14257', description: 'Muted earthy olive green', className: 'bg-fs-14257' },
  { id: '14260', name: 'Federal Standard 14260', description: 'Medium desaturated green', className: 'bg-fs-14260' },
  { id: '14272', name: 'Federal Standard 14272', description: 'Muted sage green', className: 'bg-fs-14272' },
  { id: '14277', name: 'Federal Standard 14277', description: 'Gray-green, leaning towards gray', className: 'bg-fs-14277' },
  { id: '14325', name: 'Federal Standard 14325', description: 'Light muted green', className: 'bg-fs-14325' },
  { id: '14449', name: 'Federal Standard 14449', description: 'Very pale pastel green', className: 'bg-fs-14449' },
  
  // Row 2 - Pale Greens and Dark Blues
  { id: '14533', name: 'Federal Standard 14533', description: 'Very light off-white pale green', className: 'bg-fs-14533' },
  { id: '14672', name: 'Federal Standard 14672', description: 'Light desaturated green', className: 'bg-fs-14672' },
  { id: '15042', name: 'Federal Standard 15042', description: 'Sea Blue - very dark almost black-blue', className: 'bg-fs-15042 text-white' },
  { id: '15044', name: 'Federal Standard 15044', description: 'Insignia Blue - deep dark navy blue', className: 'bg-fs-15044 text-white' },
  { id: '15045', name: 'Federal Standard 15045', description: 'Dark navy blue, similar to Insignia Blue', className: 'bg-fs-15045 text-white' },
  { id: '15050', name: 'Federal Standard 15050', description: 'Blue Angels Blue - rich deep navy blue', className: 'bg-fs-15050 text-white' },
  
  // Row 3 - Blues
  { id: '15056', name: 'Federal Standard 15056', description: 'Blue - vibrant deep royal blue', className: 'bg-fs-15056 text-white' },
  { id: '15065', name: 'Federal Standard 15065', description: 'Medium-dark blue', className: 'bg-fs-15065 text-white' },
  { id: '15080', name: 'Federal Standard 15080', description: 'Medium-dark blue, slightly richer', className: 'bg-fs-15080 text-white' },
  { id: '15090', name: 'Federal Standard 15090', description: 'Medium-dark blue, similar to 15080', className: 'bg-fs-15090 text-white' },
  { id: '15092', name: 'Federal Standard 15092', description: 'Medium blue', className: 'bg-fs-15092 text-white' },
  { id: '15102', name: 'Federal Standard 15102', description: 'Dark Blue - medium-dark blue', className: 'bg-fs-15102 text-white' },
  
  // Row 4 - Teals, Blues, and Blue-Grays
  { id: '15125', name: 'Federal Standard 15125', description: 'Deep teal or dark cyan', className: 'bg-fs-15125 text-white' },
  { id: '15177', name: 'Federal Standard 15177', description: 'Muted blue-gray', className: 'bg-fs-15177 text-white' },
  { id: '15180', name: 'Federal Standard 15180', description: 'Bright medium blue', className: 'bg-fs-15180 text-white' },
  { id: '15182', name: 'Federal Standard 15182', description: 'Bright medium blue, similar to 15180', className: 'bg-fs-15182 text-white' },
  { id: '15187', name: 'Federal Standard 15187', description: 'Bright light blue or cyan', className: 'bg-fs-15187 text-white' },
  { id: '15193', name: 'Federal Standard 15193', description: 'Muted blue-green or slate', className: 'bg-fs-15193 text-white' },
  
  // Row 5 - Grays and Browns
  { id: '15526', name: 'Federal Standard 15526', description: 'Light blue-gray', className: 'bg-fs-15526 text-white' },
  { id: '16081', name: 'Federal Standard 16081', description: 'Engine Gray - dark charcoal gray', className: 'bg-fs-16081 text-white' },
  { id: '16099', name: 'Federal Standard 16099', description: 'Dark gray', className: 'bg-fs-16099 text-white' },
  { id: '16152', name: 'Federal Standard 16152', description: 'Medium-dark gray', className: 'bg-fs-16152 text-white' },
  { id: '16160', name: 'Federal Standard 16160', description: 'Olive brown or khaki brown', className: 'bg-fs-16160 text-white' },
  { id: '16165', name: 'Federal Standard 16165', description: 'Medium brown or taupe', className: 'bg-fs-16165 text-white' },
  
  // Row 6 - Grays, Pinks, and Beiges
  { id: '16251', name: 'Federal Standard 16251', description: 'Medium gray', className: 'bg-fs-16251 text-white' },
  { id: '16307', name: 'Federal Standard 16307', description: 'Medium gray, slightly warmer', className: 'bg-fs-16307' },
  { id: '16314', name: 'Federal Standard 16314', description: 'Light gray', className: 'bg-fs-16314' },
  { id: '16350', name: 'Federal Standard 16350', description: 'Muted reddish-brown or terracotta', className: 'bg-fs-16350 text-white' },
  { id: '16357', name: 'Federal Standard 16357', description: 'Light beige or tan', className: 'bg-fs-16357' },
  { id: '16360', name: 'Federal Standard 16360', description: 'Light beige or tan, similar to 16357', className: 'bg-fs-16360' },
]

export default function ColorPaletteDemo() {
  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Federal Standard Color Palette
          </h1>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            A comprehensive collection of 36 Federal Standard colors, organized by color families and optimized for web applications.
          </p>
        </div>

        {/* Semantic Colors Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Semantic Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-primary text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Primary</div>
              <div className="text-sm opacity-90">Main brand color</div>
            </div>
            <div className="bg-secondary text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Secondary</div>
              <div className="text-sm opacity-90">Supporting color</div>
            </div>
            <div className="bg-accent text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Accent</div>
              <div className="text-sm opacity-90">Highlight color</div>
            </div>
            <div className="bg-neutral text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Neutral</div>
              <div className="text-sm opacity-90">Text & borders</div>
            </div>
            <div className="bg-success text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Success</div>
              <div className="text-sm opacity-90">Positive actions</div>
            </div>
            <div className="bg-warning text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Warning</div>
              <div className="text-sm opacity-90">Caution states</div>
            </div>
            <div className="bg-error text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Error</div>
              <div className="text-sm opacity-90">Error states</div>
            </div>
            <div className="bg-surface border border-neutral-light p-4 rounded-lg text-center">
              <div className="font-semibold text-foreground">Surface</div>
              <div className="text-sm text-neutral">Backgrounds</div>
            </div>
          </div>
        </div>

        {/* Full Color Palette */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Complete Federal Standard Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {federalColors.map((color) => (
              <div key={color.id} className="group relative">
                <div className={`${color.className} h-24 rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105`}>
                  <div className="absolute inset-0 flex items-end p-3">
                    <div className="text-xs font-medium">
                      <div className="font-bold">FS {color.id}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-foreground">FS {color.id}</div>
                  <div className="text-xs text-neutral mt-1">{color.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Usage Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Tailwind Classes</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-fs-15056 text-white p-3 rounded">bg-fs-15056 (Primary Blue)</div>
                <div className="bg-fs-14272 text-white p-3 rounded">bg-fs-14272 (Sage Green)</div>
                <div className="bg-fs-15187 text-white p-3 rounded">bg-fs-15187 (Cyan Accent)</div>
                <div className="bg-fs-16081 text-white p-3 rounded">bg-fs-16081 (Engine Gray)</div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">CSS Variables</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-primary text-white p-3 rounded">var(--primary)</div>
                <div className="bg-secondary text-white p-3 rounded">var(--secondary)</div>
                <div className="bg-accent text-white p-3 rounded">var(--accent)</div>
                <div className="bg-neutral text-white p-3 rounded">var(--neutral)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
