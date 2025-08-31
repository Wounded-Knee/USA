'use client'

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthDialog from './AuthDialog';
import UserProfile from './UserProfile';

interface AuthButtonProps {
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

export default function AuthButton({ variant = 'default', className = '' }: AuthButtonProps) {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthDialog(true);
  };

  // If user is authenticated, show user profile
  if (user) {
    return (
      <UserProfile 
        showAvatar={variant !== 'minimal'}
        showEmail={variant === 'default'}
        className={className}
      />
    );
  }

  // If user is not authenticated, show auth buttons
  switch (variant) {
    case 'minimal':
      return (
        <>
          <button
            onClick={() => handleAuthClick('login')}
            className={`bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors ${className}`}
          >
            Sign In
          </button>
          
          <AuthDialog 
            isOpen={showAuthDialog} 
            onClose={() => setShowAuthDialog(false)} 
            initialMode={authMode} 
          />
        </>
      );

    case 'compact':
      return (
        <>
          <div className={`flex space-x-2 ${className}`}>
            <button
              onClick={() => handleAuthClick('login')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleAuthClick('register')}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
          
          <AuthDialog 
            isOpen={showAuthDialog} 
            onClose={() => setShowAuthDialog(false)} 
            initialMode={authMode} 
          />
        </>
      );

    default:
      return (
        <>
          <div className={`flex items-center space-x-4 ${className}`}>
            <button
              onClick={() => handleAuthClick('login')}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleAuthClick('register')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
            >
              Get Started
            </button>
          </div>
          
          <AuthDialog 
            isOpen={showAuthDialog} 
            onClose={() => setShowAuthDialog(false)} 
            initialMode={authMode} 
          />
        </>
      );
  }
}
