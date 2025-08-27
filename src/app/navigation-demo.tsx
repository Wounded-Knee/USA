'use client'

import React from 'react'

export default function NavigationDemo() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Federal Standard Navigation
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            A responsive navigation component built with the Federal Standard color palette, featuring dropdown menus and mobile optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Explore Features
            </button>
            <button className="bg-surface text-foreground hover:bg-neutral-light px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              View Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Navigation Features
            </h2>
            <p className="text-lg text-neutral max-w-2xl mx-auto">
              Built with modern web standards and the Federal Standard color palette for consistent, professional design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-surface border border-neutral-light rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Responsive Design</h3>
              <p className="text-neutral">
                Automatically adapts to different screen sizes with a mobile-first approach and hamburger menu for smaller devices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface border border-neutral-light rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Dropdown Menus</h3>
              <p className="text-neutral">
                Hover-activated dropdown menus on desktop with smooth animations and mobile-friendly accordion style on mobile.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface border border-neutral-light rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Federal Standard Colors</h3>
              <p className="text-neutral">
                Uses the complete Federal Standard color palette with semantic color mappings for consistent branding.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-surface border border-neutral-light rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Performance Optimized</h3>
              <p className="text-neutral">
                Built with React hooks and optimized for performance with smooth transitions and minimal re-renders.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-surface border border-neutral-light rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Accessibility</h3>
              <p className="text-neutral">
                Fully accessible with proper ARIA labels, keyboard navigation, and screen reader support.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-surface border border-neutral-light rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-error rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Customizable</h3>
              <p className="text-neutral">
                Easy to customize with TypeScript interfaces and modular component structure for any project needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Section */}
      <div className="bg-neutral-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Easy to Implement
            </h2>
            <p className="text-lg text-neutral max-w-2xl mx-auto">
              Simple integration with your existing Next.js project using the Federal Standard color system.
            </p>
          </div>

          <div className="bg-surface border border-neutral-light rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">Quick Start</h3>
            <div className="bg-neutral-dark text-neutral-light p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`// 1. Import the Navigation component
import Navigation from './components/Navigation'

// 2. Add to your layout or page
export default function Layout() {
  return (
    <>
      <Navigation />
      <main>
        {/* Your content */}
      </main>
    </>
  )
}`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-neutral-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg mb-4">
            Built with the Federal Standard Color Palette
          </p>
          <p className="text-sm opacity-75">
            Professional, accessible, and responsive navigation for modern web applications.
          </p>
        </div>
      </footer>
    </div>
  )
}
