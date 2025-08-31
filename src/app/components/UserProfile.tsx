'use client'

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserRoles from './UserRoles';
import { getHighestRole } from '../utils/roleUtils';

interface UserProfileProps {
  showAvatar?: boolean;
  showEmail?: boolean;
  showLogout?: boolean;
  className?: string;
}

export default function UserProfile({ 
  showAvatar = true, 
  showEmail = true, 
  showLogout = true,
  className = '' 
}: UserProfileProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* User Avatar/Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {showAvatar && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium">
            {user.avatar ? (
              <img 
                src={user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${user.avatar}`}
                alt={user.firstName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
            )}
          </div>
        )}
        
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          {showEmail && (
            <p className="text-xs text-gray-500">{user.email}</p>
          )}
        </div>

        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Signed in via {user.authMethod === 'google' ? 'Google' : 'Email'}
            </p>
            {user.roles && user.roles.length > 0 && (
              <div className="mt-2">
                <UserRoles roles={user.roles} />
              </div>
            )}
          </div>
          
          <div className="py-1">
            <button
              onClick={() => {
                // Add profile edit functionality here
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Edit Profile
            </button>
            
            {showLogout && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
