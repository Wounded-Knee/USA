'use client'

import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggleMobile() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
  }

  return (
    <div className="px-3 py-2">
      <p className="text-xs text-neutral mb-2">Theme</p>
      <div className="space-y-1">
        <button
          onClick={() => handleThemeChange('light')}
          className={`w-full flex items-center space-x-2 px-2 py-1 text-sm rounded transition-colors duration-200 ${
            theme === 'light' 
              ? 'bg-primary text-white' 
              : 'text-neutral hover:text-foreground hover:bg-neutral-light'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Light</span>
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={`w-full flex items-center space-x-2 px-2 py-1 text-sm rounded transition-colors duration-200 ${
            theme === 'dark' 
              ? 'bg-primary text-white' 
              : 'text-neutral hover:text-foreground hover:bg-neutral-light'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span>Dark</span>
        </button>
        <button
          onClick={() => handleThemeChange('system')}
          className={`w-full flex items-center space-x-2 px-2 py-1 text-sm rounded transition-colors duration-200 ${
            theme === 'system' 
              ? 'bg-primary text-white' 
              : 'text-neutral hover:text-foreground hover:bg-neutral-light'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>System</span>
        </button>
      </div>
    </div>
  )
}
