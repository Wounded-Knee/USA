import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Press - Whitepine',
  description: 'Latest updates, press releases, and media coverage about Whitepine and civic engagement.',
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            News & Press
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Stay up to date with the latest news, press releases, and media coverage about Whitepine 
            and our mission to strengthen democracy through technology.
          </p>
        </div>

        {/* Latest News */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-8 text-center">Latest Updates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* News Item 1 */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg overflow-hidden border border-[var(--color-border)]">
              <div className="h-48 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                <svg className="w-16 h-16 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="p-6">
                <div className="text-sm text-[var(--color-text-muted)] mb-2">December 15, 2024</div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
                  Whitepine Launches New Civic Engagement Platform
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  Our comprehensive platform for civic engagement is now live, empowering citizens 
                  to participate in democracy like never before.
                </p>
                <Link 
                  href="#"
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </div>

            {/* News Item 2 */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg overflow-hidden border border-[var(--color-border)]">
              <div className="h-48 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] flex items-center justify-center">
                <svg className="w-16 h-16 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="p-6">
                <div className="text-sm text-[var(--color-text-muted)] mb-2">December 10, 2024</div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
                  Partnership with Civic Tech Alliance Announced
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  Whitepine joins forces with leading civic technology organizations to advance 
                  digital democracy initiatives nationwide.
                </p>
                <Link 
                  href="#"
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </div>

            {/* News Item 3 */}
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg overflow-hidden border border-[var(--color-border)]">
              <div className="h-48 bg-gradient-to-r from-[var(--color-success)] to-[var(--color-primary)] flex items-center justify-center">
                <svg className="w-16 h-16 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="p-6">
                <div className="text-sm text-[var(--color-text-muted)] mb-2">December 5, 2024</div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
                  Community Engagement Success Stories
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  Discover how communities across the country are using Whitepine to strengthen 
                  local democracy and civic participation.
                </p>
                <Link 
                  href="#"
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Press Resources */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Press Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">For Journalists</h3>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  Press releases and announcements
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  Expert interviews and quotes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  High-resolution images and logos
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  Background information and fact sheets
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Contact Information</h3>
              <div className="space-y-3 text-[var(--color-text-secondary)]">
                <p><strong>Press Inquiries:</strong> press@whitepine.org</p>
                <p><strong>General Media:</strong> media@whitepine.org</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg shadow-lg p-8 text-center text-[var(--color-text-on-primary)]">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6 opacity-90">
            Subscribe to our newsletter for the latest news, updates, and insights about 
            civic technology and democracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-[var(--color-text)] border-0 focus:ring-2 focus:ring-[var(--color-text-on-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-primary)]"
            />
            <button className="px-6 py-3 bg-[var(--color-text-on-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium">
              Subscribe
            </button>
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
