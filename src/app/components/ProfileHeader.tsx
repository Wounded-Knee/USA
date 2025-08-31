'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import UserAvatar from './UserAvatar'
import axios from 'axios'

interface ProfileHeaderProps {
  user: any
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { token } = useAuth()
  const { resolvedTheme } = useTheme()
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const bannerFileInputRef = useRef<HTMLInputElement>(null)
  const avatarFileInputRef = useRef<HTMLInputElement>(null)

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !token) return

    setIsUploadingBanner(true)
    const formData = new FormData()
    formData.append('banner', file)

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${user._id}/banner`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      // Refresh the page to show the new banner
      window.location.reload()
    } catch (error) {
      console.error('Error uploading banner:', error)
    } finally {
      setIsUploadingBanner(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !token) return

    setIsUploadingAvatar(true)
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${user._id}/avatar`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      // Refresh the page to show the new avatar
      window.location.reload()
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className={`relative rounded-lg shadow-sm border overflow-hidden ${
      resolvedTheme === 'dark' 
        ? 'bg-surface border-neutral-light' 
        : 'bg-white border-neutral-light'
    }`}>
      {/* Banner Image */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-secondary/20">
        {user.banner ? (
          <Image
            src={user.banner.startsWith('http') ? user.banner : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${user.banner}`}
            alt="Profile banner"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10" />
        )}
        
        {/* Banner Upload Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <button
            onClick={() => bannerFileInputRef.current?.click()}
            disabled={isUploadingBanner}
            className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-foreground px-4 py-2 rounded-md font-medium text-sm"
          >
            {isUploadingBanner ? 'Uploading...' : 'Upload Banner'}
          </button>
        </div>
        
        <input
          ref={bannerFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          className="hidden"
        />
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6">
        {/* Avatar positioned over banner */}
        <div className="relative -mt-20 mb-4">
          <div className="relative">
            <UserAvatar size="xl" showDropdown={false} />
            
            {/* Avatar Upload Overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 rounded-full flex items-center justify-center">
              <button
                onClick={() => avatarFileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-foreground px-3 py-1 rounded-md font-medium text-xs"
              >
                {isUploadingAvatar ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            
            <input
              ref={avatarFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-neutral mb-1">@{user.username}</p>
          <p className="text-neutral mb-4">{user.email}</p>
          <div className="flex items-center space-x-4">
            <Link
              href="/profile/edit"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Edit Profile
            </Link>
            <span className="text-sm text-neutral">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
