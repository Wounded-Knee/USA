'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import UserAvatar from '../../components/UserAvatar'
import Link from 'next/link'
import axios from 'axios'

interface ProfileFormData {
  firstName: string
  lastName: string
  username: string
  email: string
  avatar?: string
  avatarFile?: File
}

export default function EditProfilePage() {
  const { user, token, updateUser } = useAuth()
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    avatar: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        avatar: user.avatar || ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarFile: file
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Handle avatar upload first if there's a new file
      let avatarPath = formData.avatar
      if (formData.avatarFile) {
        const formDataFile = new FormData()
        formDataFile.append('avatar', formData.avatarFile)
        
        const avatarResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${user?._id}/avatar`,
          formDataFile,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        avatarPath = avatarResponse.data.avatar
      }

      // Update other profile data
      const { avatarFile, ...profileData } = formData
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${user?._id}`,
        { ...profileData, avatar: avatarPath },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      updateUser(response.data)
      setSuccess('Profile updated successfully!')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please sign in to edit your profile</h1>
          <Link 
            href="/"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="text-primary hover:text-primary-dark transition-colors duration-200 mb-4 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-neutral mt-2">Update your personal information and avatar</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-light p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="mb-4">
                <UserAvatar size="lg" showDropdown={false} />
              </div>
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-neutral mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-neutral file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark transition-colors duration-200"
                />
                <p className="text-xs text-neutral mt-1">
                  Upload a new profile picture (JPG, PNG, GIF up to 5MB)
                </p>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
              <p className="text-xs text-neutral mt-1">
                This is your public username that others will see
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
              <p className="text-xs text-neutral mt-1">
                We'll send you important updates about your account
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-neutral-light">
              <Link
                href="/profile"
                className="text-neutral hover:text-foreground transition-colors duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
