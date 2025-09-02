import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Participate - Whitepine',
  description: 'Find your role in strengthening democracy through Whitepine - as a developer, civic leader, or voter & advocate.',
}

export default function ParticipatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Participate
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Find your role in strengthening democracy through Whitepine. Whether you're a developer, 
            civic leader, or concerned citizen, there's a place for you in our community.
          </p>
        </div>

        {/* Participation Options */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Link href="/participate/developer" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">As a Developer</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Contribute to open-source development, explore our roadmap, and help build the future of civic technology.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  Open Source
                </span>
              </div>
            </div>
          </Link>

          <Link href="/participate/civic-leader" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">As a Civic Leader</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Learn how to pledge recognition of thresholds, request partnerships, and guide our development.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-secondary-light)] text-[var(--color-secondary)]">
                  Leadership
                </span>
              </div>
            </div>
          </Link>

          <Link href="/participate/voter-advocate" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">As a Voter & Advocate</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Discover your position in the republic, responsibilities, and voice in the collective chorus of democracy.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-success-light)] text-[var(--color-success)]">
                  Democracy
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-[var(--color-text-secondary)] mb-6">
            Ready to find your role in strengthening democracy?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-[var(--color-border)] text-base font-medium rounded-md text-[var(--color-text)] bg-[var(--color-surface)] hover:bg-[var(--color-background)] transition-colors duration-200"
            >
              Learn More About Us
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
