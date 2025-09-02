'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import UserProfile from '../components/UserProfile'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    setLoading(false)
  }, [token, router])

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg border border-[var(--color-border)] p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-[var(--color-border)] rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-[var(--color-border)] rounded w-1/2"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-3/4"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg border border-[var(--color-border)] p-8 text-center">
            <div className="text-[var(--color-text-muted)] text-4xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">Access Denied</h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              You must be logged in to view your profile.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">My Profile</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Manage your profile, view your civic engagement history, and track your impact.
          </p>
        </div>

        <UserProfile 
          user={{
            _id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            profile: user.profile
          }} 
          onProfileUpdate={() => {
            // Refresh user data if needed
            console.log('Profile updated')
          }} 
        />
      </div>
    </div>
  )
}
