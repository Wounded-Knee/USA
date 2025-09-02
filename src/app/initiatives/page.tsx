import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Initiatives - Whitepine',
  description: 'Explore active petitions, past victories, and learn how to start your own initiative.',
}

export default function InitiativesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Initiatives
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Discover active petitions, celebrate past victories, and learn how to start 
            your own initiative to make a difference in your community.
          </p>
        </div>

        {/* Initiative Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link href="/initiatives/community" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Community Initiatives</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Live data feeds and charts showing current initiatives and their progress.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  Live Data
                </span>
              </div>
            </div>
          </Link>

          <Link href="/initiatives/victories" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Past Victories</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Proof and case studies of successful community initiatives and their impact.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-success-light)] text-[var(--color-success)]">
                  Success Stories
                </span>
              </div>
            </div>
          </Link>

          <Link href="/initiatives/start" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Start an Initiative</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Learn how to create and launch your own community initiative on the platform.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-secondary-light)] text-[var(--color-secondary)]">
                  Get Started
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Featured Initiative */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Featured Initiative</h2>
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">Community Green Spaces</h3>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-2xl mx-auto">
              A successful initiative that transformed vacant lots into community gardens and green spaces, 
              bringing neighbors together and improving local environmental quality.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-primary)]">1,247</div>
                <div className="text-sm text-[var(--color-text-muted)]">Supporters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-success)]">15</div>
                <div className="text-sm text-[var(--color-text-muted)]">Gardens Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-secondary)]">$45K</div>
                <div className="text-sm text-[var(--color-text-muted)]">Funds Raised</div>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                href="/initiatives/community-green-spaces"
                className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">How Initiatives Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--color-primary)]">1</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Identify Need</h3>
              <p className="text-[var(--color-text-secondary)]">
                Community members identify local issues or opportunities that need attention.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--color-secondary)]">2</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Build Support</h3>
              <p className="text-[var(--color-text-secondary)]">
                Gather signatures, supporters, and resources to demonstrate community backing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--color-success)]">3</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Take Action</h3>
              <p className="text-[var(--color-text-secondary)]">
                Implement solutions and track progress toward achieving community goals.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-[var(--color-text-secondary)] mb-6">
            Ready to make a difference in your community?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/initiatives/start"
              className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 font-medium"
            >
              Start an Initiative
            </Link>
            <Link 
              href="/initiatives"
              className="inline-flex items-center px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-surface)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium"
            >
              Browse Initiatives
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
