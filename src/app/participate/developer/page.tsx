import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Developer - Whitepine',
  description: 'Contribute to open-source development, explore our roadmap, and help build the future of civic technology.',
}

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Developer
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Contribute to open-source development, explore our roadmap, and help build the future of civic technology.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Build Democracy's Future</h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <p>
                  As a developer, you have the power to shape the tools that strengthen democracy. 
                  Whitepine is built on open-source principles, and we welcome contributions from developers 
                  who share our vision.
                </p>
                <p>
                  Whether you're a frontend specialist, backend engineer, or full-stack developer, 
                  there's a place for you in our community.
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Contribution Areas</h2>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Frontend development with Next.js and React
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Backend APIs and database optimization
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Civic data visualization and analytics
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Security and accessibility improvements
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Testing and documentation
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Getting Started</h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-[var(--color-primary)] font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Explore the Codebase</h3>
                    <p>Fork our repository and explore the current implementation.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-[var(--color-primary)] font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Join the Community</h3>
                    <p>Connect with other developers and discuss ideas.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-[var(--color-primary)] font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Submit Contributions</h3>
                    <p>Create pull requests and help improve the platform.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Ready to Code?</h2>
              <div className="space-y-4">
                <p className="text-[var(--color-text-secondary)]">
                  Start contributing to the future of civic technology. Every line of code you write 
                  helps strengthen democracy.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="/lab"
                    className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 font-medium"
                  >
                    Explore the Lab
                  </Link>
                  <Link 
                    href="/resources/documentation"
                    className="inline-flex items-center px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-surface)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium"
                  >
                    View Documentation
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
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
          >
            ← Back to Participation Options
          </Link>
        </div>
      </div>
    </div>
  )
}
