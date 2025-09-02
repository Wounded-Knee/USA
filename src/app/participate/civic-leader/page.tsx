import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Civic Leader - Whitepine',
  description: 'Learn how to pledge recognition of thresholds, request partnerships, and guide our development.',
}

export default function CivicLeaderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Civic Leader
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Learn how to pledge recognition of thresholds, request partnerships, and guide our development.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Leadership in Democracy</h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <p>
                  Civic leaders are the bridge between citizens and institutions. You have the power to 
                  recognize thresholds, build partnerships, and guide the development of tools that strengthen democracy.
                </p>
                <p>
                  Whitepine provides you with the platform and resources to amplify your impact and 
                  create lasting change in your community.
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Key Capabilities</h2>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pledge recognition of community thresholds
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Request partnerships with other organizations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Guide platform development priorities
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Access advanced civic tools and analytics
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Lead community initiatives and campaigns
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">How Whitepine Empowers You</h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-[var(--color-secondary)] font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Threshold Recognition</h3>
                    <p>Identify and document community needs that require attention and action.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-[var(--color-secondary)] font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Partnership Building</h3>
                    <p>Connect with other organizations and leaders to amplify your impact.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-[var(--color-secondary)] font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Development Guidance</h3>
                    <p>Shape the future of civic technology by guiding our development priorities.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Ready to Lead?</h2>
              <div className="space-y-4">
                <p className="text-[var(--color-text-secondary)]">
                  Take the first step toward becoming a civic leader. Start by exploring our platform 
                  and understanding how you can make a difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-[var(--color-secondary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-secondary-hover)] transition-colors duration-200 font-medium"
                  >
                    Get Started
                  </Link>
                  <Link 
                    href="/resources"
                    className="inline-flex items-center px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-surface)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link 
            href="/participate"
            className="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-secondary-hover)] font-medium transition-colors"
          >
            ← Back to Participation Options
          </Link>
        </div>
      </div>
    </div>
  )
}
