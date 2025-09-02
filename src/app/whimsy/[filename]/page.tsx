import React from 'react'
import WhimsyPageClient from './WhimsyPageClient'

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // For static export, we need to pre-generate common whimsy filenames
  // Since we can't know all filenames at build time, we'll generate some common ones
  return [
    { filename: 'example.md' },
    { filename: 'demo.md' },
    // Add other common whimsy filenames as needed
  ]
}

export default function WhimsyPage() {
  return <WhimsyPageClient />
}
