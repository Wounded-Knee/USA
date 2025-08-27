'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface NavItem {
  label: string
  href: string
  icon?: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { 
    label: 'Products', 
    href: '/products',
    children: [
      { label: 'Color Palettes', href: '/products/colors' },
      { label: 'Design Systems', href: '/products/design-systems' },
      { label: 'Components', href: '/products/components' },
    ]
  },
  { 
    label: 'Services', 
    href: '/services',
    children: [
      { label: 'Consulting', href: '/services/consulting' },
      { label: 'Implementation', href: '/services/implementation' },
      { label: 'Training', href: '/services/training' },
    ]
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click target is the toggle button itself
      const target = event.target as Node
      const toggleButton = document.querySelector('[aria-label="Toggle navigation menu"]')
      
      if (toggleButton && toggleButton.contains(target)) {
        return // Don't close if clicking the toggle button
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const toggleMenu = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setActiveDropdown(null)
  }

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  const handleDropdownClick = (event: React.MouseEvent, item: NavItem) => {
    if (item.children) {
      event.preventDefault()
      toggleDropdown(item.label)
    } else {
      closeMenu()
    }
  }

  return (
    <nav className="bg-surface border-b border-neutral-light shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2 group">
              <Image
                src="/california-bear-logo.png"
                alt="California Bear Logo"
                width={32}
                height={32}
                className="w-8 h-8 group-hover:scale-105 transition-transform duration-200"
              />
              <span className="text-neutral-dark font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                Democracy California
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <a
                    href={item.href}
                    className="text-neutral hover:text-foreground hover:bg-neutral-light px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                    onClick={(e) => handleDropdownClick(e, item)}
                  >
                    <span>{item.label}</span>
                    {item.children && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </a>
                  
                  {/* Desktop Dropdown */}
                  {item.children && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-surface border border-neutral-light opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-neutral hover:text-foreground hover:bg-neutral-light transition-colors duration-200"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={(e) => toggleMenu(e)}
              className="text-neutral hover:text-foreground hover:bg-neutral-light p-2 rounded-md transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-surface border-t border-neutral-light">
              {navItems.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleDropdownClick(e, item)}
                    className="text-neutral hover:text-foreground hover:bg-neutral-light block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    {item.children && (
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </a>
                  
                  {/* Mobile Dropdown */}
                  {item.children && activeDropdown === item.label && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={closeMenu}
                          className="text-neutral hover:text-foreground hover:bg-neutral-light block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-neutral-light">
                <button className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
