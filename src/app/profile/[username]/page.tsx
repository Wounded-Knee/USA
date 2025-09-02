import React from 'react'
import ProfilePageClient from './ProfilePageClient'

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // For static export, we need to pre-generate all possible username values
  // Since we can't know all usernames at build time, we'll generate common ones
  // and the 'me' route which is used for the current user's profile
  return [
    { username: 'me' },
    // Add other common usernames if needed for static generation
    // { username: 'admin' },
    // { username: 'demo' },
  ]
}

export default function ProfilePage() {
  return <ProfilePageClient />
}
