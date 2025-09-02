import React from 'react'
import DocumentPageClient from './DocumentPageClient'

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // For static export, we need to pre-generate common document filenames
  // Since we can't know all filenames at build time, we'll generate some common ones
  return [
    { filename: 's3-cloudfront-deployment.md' },
    { filename: 'README.md' },
    // Add other common document filenames as needed
  ]
}

export default function DocumentPage() {
  return <DocumentPageClient />
}
