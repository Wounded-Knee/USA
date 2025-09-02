import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Public - Whitepine',
  description: 'Learn about Whitepine, understand why civic engagement matters, and discover how our platform works.',
}

export default function PublicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Welcome to Whitepine
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            A platform for strengthening democracy through technology and civic engagement. 
            Learn about our mission, understand why it matters, and discover how you can get involved.
          </p>
        </div>

        {/* Main Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link href="/public/guide-us" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Guide Our Development</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Help shape the future of Whitepine by providing feedback, suggestions, and guidance on our platform development.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  Feedback
                </span>
              </div>
            </div>
          </Link>

          <Link href="/public/why-it-matters" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Why It Matters</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Understand the importance of civic engagement and how technology can strengthen democracy in our communities.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-secondary-light)] text-[var(--color-secondary)]">
                  Impact
                </span>
              </div>
            </div>
          </Link>

          <Link href="/public/how-it-works" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.287.882l-.443.29a1 1 0 01-1.45-1.38l.408-1.624a1 1 0 00-.2-1.04L9.5 8.5a1 1 0 00-1.06 0l-2.5 2.5a1 1 0 00-.2 1.04l.408 1.624a1 1 0 01-1.45 1.38l-.443-.29a6 6 0 00-3.287.882l-2.387.477a2 2 0 00-1.022.547L2.5 17.5a2 2 0 001.022.547l2.387.477a6 6 0 003.287-.882l.443-.29a1 1 0 011.45 1.38l-.408 1.624a1 1 0 00.2 1.04l2.5 2.5a1 1 0 001.06 0l2.5-2.5a1 1 0 00.2-1.04l-.408-1.624a1 1 0 011.45-1.38l.443.29a6 6 0 003.287.882l2.387.477a2 2 0 001.022-.547L21.5 17.5a2 2 0 00-1.022-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">How It Works</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Learn about the technology, processes, and methodologies that power our civic engagement platform.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-success-light)] text-[var(--color-success)]">
                  Technology
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* About Whitepine */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">About Whitepine</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Our Mission</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Whitepine is dedicated to strengthening democracy through technology and civic engagement. 
                We believe that every citizen has a voice, and every voice matters.
              </p>
              <p className="text-[var(--color-text-secondary)]">
                Our platform provides tools and resources to help communities organize, advocate, 
                and create positive change at the local, state, and national levels.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Our Values</h3>
              <ul className="space-y-2 text-[var(--color-text-secondary)]">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Transparency and accountability
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Community-driven development
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Open source and accessibility
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Non-partisan civic engagement
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg shadow-lg p-8 text-center text-[var(--color-text-on-primary)]">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 opacity-90">
            Explore our platform, learn about civic engagement, and discover how you can 
            make a difference in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link 
              href="/about"
              className="px-6 py-3 bg-[var(--color-text-on-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium"
            >
              Learn More
            </Link>
            <Link 
              href="/participate"
              className="px-6 py-3 border-2 border-[var(--color-text-on-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-text-on-primary)] hover:text-[var(--color-primary)] transition-colors duration-200 font-medium"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
