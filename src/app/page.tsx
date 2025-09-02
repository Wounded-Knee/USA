'use client'

import QOTD from './components/Hero/QOTD'
import Statistics from './components/Statistics'
import VigorLeaderboard from './components/VigorLeaderboard'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <QOTD />
      <Statistics />
      
      {/* Public-Facing Pages Summary Section */}
      <section className="bg-gradient-to-br from-[var(--color-background-secondary)] via-[var(--color-background)] to-[var(--color-surface-secondary)] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--color-text)] mb-6">
              Discover Whitepine
            </h2>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
              Explore our platform, learn about our mission, and find your role in strengthening democracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* About Section */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-[var(--color-border)]">
              <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 text-center">About Whitepine</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-4">
                Learn about our story, philosophy, and mission rooted in the Great Tree of Peace.
              </p>
              <div className="text-center">
                <Link 
                  href="/about"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* For the Public Section */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-[var(--color-border)]">
              <div className="w-16 h-16 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 text-center">For the Public</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-4">
                Discover how Whitepine works, why it matters, and how you can guide our development.
              </p>
              <div className="text-center">
                <Link 
                  href="/public"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] transition-colors duration-200"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Participate Section */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-[var(--color-border)]">
              <div className="w-16 h-16 bg-[var(--color-success)] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 text-center">Get Involved</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-4">
                Find your role as a developer, civic leader, or voter & advocate.
              </p>
              <div className="text-center">
                <Link 
                  href="/participate"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-success)] hover:bg-[var(--color-success)]/80 transition-colors duration-200"
                >
                  Participate
                </Link>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Resources Section */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-[var(--color-border)]">
              <div className="w-16 h-16 bg-[var(--color-accent-light)] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 text-center">Resources</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-4">
                Access documentation, media kit, news, and press resources for Whitepine.
              </p>
              <div className="text-center">
                <Link 
                  href="/resources"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors duration-200"
                >
                  Browse Resources
                </Link>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-[var(--color-border)]">
              <div className="w-16 h-16 bg-[var(--color-warning)] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 text-center">Get in Touch</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-4">
                Have questions? Want to partner with us? We'd love to hear from you.
              </p>
              <div className="text-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-warning)] hover:bg-[var(--color-warning)]/80 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Components */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <VigorLeaderboard />
        </div>
      </div>
    </div>
  )
}
