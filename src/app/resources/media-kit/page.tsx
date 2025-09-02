import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Media Kit - Whitepine',
  description: 'Logos, branding guidelines, one-pagers, and promotional materials for Whitepine.',
}

export default function MediaKitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Media Kit
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Access logos, branding guidelines, one-pagers, and promotional materials to help you 
            accurately represent Whitepine in your communications.
          </p>
        </div>

        {/* Brand Assets */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-8 text-center">Brand Assets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Logo Downloads */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 text-center">Logos</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                High-resolution logos in various formats for print and digital use.
              </p>
              <div className="space-y-2">
                <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 text-sm">
                  Download PNG
                </a>
                <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 text-sm">
                  Download SVG
                </a>
                <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 text-sm">
                  Download EPS
                </a>
              </div>
            </div>

            {/* Brand Guidelines */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 text-center">Brand Guidelines</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Complete brand guidelines including colors, typography, and usage rules.
              </p>
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-secondary-hover)] transition-colors duration-200">
                Download PDF
              </a>
            </div>

            {/* One-Pagers */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 text-center">One-Pagers</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Concise overview documents for different audiences and use cases.
              </p>
              <div className="space-y-2">
                <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-success)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-success-hover)] transition-colors duration-200 text-sm">
                  General Overview
                </a>
                <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-success)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-success-hover)] transition-colors duration-200 text-sm">
                  For Developers
                </a>
                <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-success)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-success-hover)] transition-colors duration-200 text-sm">
                  For Civic Leaders
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Press Materials */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Press Materials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Press Releases</h3>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  <a href="#" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Platform Launch Announcement</a>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  <a href="#" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Partnership with Civic Tech Alliance</a>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  <a href="#" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Community Success Stories</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Fact Sheets</h3>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mr-3"></span>
                  <a href="#" className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-hover)]">Platform Features Overview</a>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mr-3"></span>
                  <a href="#" className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-hover)]">Technology Stack</a>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mr-3"></span>
                  <a href="#" className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-hover)]">Impact Metrics</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg shadow-lg p-8 text-center text-[var(--color-text-on-primary)]">
          <h2 className="text-3xl font-bold mb-4">Need Additional Assets?</h2>
          <p className="text-lg mb-6 opacity-90">
            Can't find what you're looking for? Our media team is here to help with custom 
            requests and additional materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <a 
              href="mailto:media@whitepine.org"
              className="px-6 py-3 bg-[var(--color-text-on-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium"
            >
              Contact Media Team
            </a>
            <a 
              href="/contact"
              className="px-6 py-3 border-2 border-[var(--color-text-on-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-text-on-primary)] hover:text-[var(--color-primary)] transition-colors duration-200 font-medium"
            >
              General Contact
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Link 
            href="/resources"
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
          >
            ← Back to Resources
          </Link>
        </div>
      </div>
    </div>
  )
}
