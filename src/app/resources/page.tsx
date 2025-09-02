import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources - Whitepine',
  description: 'Access documentation, media kit, news, and press resources for Whitepine.',
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Resources
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Access everything you need to understand, use, and promote Whitepine. From technical 
            documentation to media resources, we've got you covered.
          </p>
        </div>

        {/* Resource Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link href="/resources/documentation" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Documentation</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Technical guides, civic education materials, and our comprehensive library of resources.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  Guides & Library
                </span>
              </div>
            </div>
          </Link>

          <Link href="/resources/media-kit" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Media Kit</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Logos, branding guidelines, one-pagers, and promotional materials for Whitepine.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-secondary-light)] text-[var(--color-secondary)]">
                  Branding
                </span>
              </div>
            </div>
          </Link>

          <Link href="/resources/news" className="group">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">News & Press</h3>
              <p className="text-[var(--color-text-secondary)] text-center mb-6">
                Latest updates, press releases, and media coverage about Whitepine and civic engagement.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-success-light)] text-[var(--color-success)]">
                  Updates
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Access */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Quick Access</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">For Developers</h3>
              <ul className="space-y-2 text-[var(--color-text-secondary)]">
                <li>• <Link href="/library" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Project Library</Link></li>
                <li>• <Link href="/lab" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Laboratory</Link></li>
                <li>• <Link href="/participate/developer" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Contribution Guide</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">For Media</h3>
              <ul className="space-y-2 text-[var(--color-text-secondary)]">
                <li>• <Link href="/resources/media-kit" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Press Kit</Link></li>
                <li>• <Link href="/contact" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Press Inquiries</Link></li>
                <li>• <Link href="/about" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">About Whitepine</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Civic Education</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Learn about democracy, civic engagement, and how technology can strengthen our communities.
              </p>
              <Link 
                href="/about"
                className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
              >
                Learn More →
              </Link>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Community Support</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Get help, ask questions, and connect with other Whitepine users and contributors.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
              >
                Get Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
