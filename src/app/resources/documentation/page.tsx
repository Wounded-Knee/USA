import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation - Whitepine',
  description: 'Technical guides, civic education materials, and our comprehensive library of resources.',
}

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Documentation
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Access comprehensive technical guides, civic education materials, and our library of 
            resources to help you understand and use Whitepine effectively.
          </p>
        </div>

        {/* Documentation Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Technical Documentation */}
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
            <div className="w-20 h-20 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Technical Guides</h3>
            <p className="text-[var(--color-text-secondary)] text-center mb-6">
              API documentation, development guides, and technical specifications for developers.
            </p>
            <div className="space-y-2">
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 text-sm">
                API Reference
              </a>
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 text-sm">
                Development Setup
              </a>
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 text-sm">
                Architecture Guide
              </a>
            </div>
          </div>

          {/* Civic Education */}
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
            <div className="w-20 h-20 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-10 h-10 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Civic Education</h3>
            <p className="text-[var(--color-text-secondary)] text-center mb-6">
              Materials to help citizens understand democracy, civic engagement, and their role.
            </p>
            <div className="space-y-2">
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-secondary-hover)] transition-colors duration-200 text-sm">
                Democracy 101
              </a>
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-secondary-hover)] transition-colors duration-200 text-sm">
                Civic Engagement Guide
              </a>
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-secondary-hover)] transition-colors duration-200 text-sm">
                Community Organizing
              </a>
            </div>
          </div>

          {/* Project Library */}
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
            <div className="w-20 h-20 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">Project Library</h3>
            <p className="text-[var(--color-text-secondary)] text-center mb-6">
              Explore our collection of civic technology projects and initiatives.
            </p>
            <div className="space-y-2">
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-success)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-success-hover)] transition-colors duration-200 text-sm">
                Browse Projects
              </a>
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-success)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-success-hover)] transition-colors duration-200 text-sm">
                Case Studies
              </a>
              <a href="#" className="block w-full text-center px-4 py-2 bg-[var(--color-success)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-success-hover)] transition-colors duration-200 text-sm">
                Success Stories
              </a>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Getting Started</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">For Developers</h3>
              <div className="space-y-3 text-[var(--color-text-secondary)]">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Set up your development environment</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Explore the API documentation</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Join our developer community</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">For Citizens</h3>
              <div className="space-y-3 text-[var(--color-text-secondary)]">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Learn about civic engagement</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Understand your role in democracy</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Discover community initiatives</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Video Tutorials</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Step-by-step video guides for common tasks and features.
              </p>
              <Link 
                href="#"
                className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
              >
                Watch Tutorials →
              </Link>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Community Forum</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Connect with other users, ask questions, and share experiences.
              </p>
              <Link 
                href="#"
                className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
              >
                Join Discussion →
              </Link>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg shadow-lg p-8 text-center text-[var(--color-text-on-primary)]">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-lg mb-6 opacity-90">
            Can't find what you're looking for? Our documentation team is here to help 
            with any questions or clarifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <a 
              href="/contact"
              className="px-6 py-3 bg-[var(--color-text-on-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium"
            >
              Contact Support
            </a>
            <a 
              href="#"
              className="px-6 py-3 border-2 border-[var(--color-text-on-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-text-on-primary)] hover:text-[var(--color-primary)] transition-colors duration-200 font-medium"
            >
              Request Documentation
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
