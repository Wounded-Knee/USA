import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works - Whitepine',
  description: 'Learn about the technology, processes, and methodologies that power our civic engagement platform.',
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            href="/public" 
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            ← Back to Public Resources
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            How Whitepine Works
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Discover the technology, processes, and principles that power our civic engagement platform. 
            Learn how we're making democracy more accessible, transparent, and effective.
          </p>
        </div>

        {/* Core Concepts */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Core Platform Concepts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Digital Petitions</h3>
              <p className="text-[var(--color-text-secondary)]">
                Create, sign, and track petitions with real-time progress updates and community engagement metrics.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Community Vigor</h3>
              <p className="text-[var(--color-text-secondary)]">
                Measure and reward community engagement through our unique vigor point system that tracks participation quality.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Transparent Tracking</h3>
              <p className="text-[var(--color-text-secondary)]">
                Monitor campaign progress, verify signatures, and track outcomes with full transparency and accountability.
              </p>
            </div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">How the Process Works</h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-[var(--color-text-on-primary)] font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Identify an Issue</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Community members identify local issues, concerns, or opportunities that need attention 
                  from government officials or community leaders.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-[var(--color-text-on-primary)] font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Create a Petition</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Use our platform to create a well-crafted petition with clear goals, supporting information, 
                  and specific requests for action.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--color-success)] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-[var(--color-text-on-primary)] font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Build Support</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Share the petition with your community, gather signatures, and build momentum 
                  through social media and community outreach.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--color-accent)] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-[var(--color-text-on-primary)] font-bold text-lg">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Deliver & Advocate</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Present the petition to decision-makers, advocate for your cause, and work 
                  toward implementing the requested changes.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--color-warning)] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-[var(--color-text-on-primary)] font-bold text-lg">5</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Track & Follow Up</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Monitor progress, maintain engagement, and ensure accountability for promised actions 
                  or policy changes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Technology & Infrastructure</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Frontend Technology</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full mr-3"></div>
                  <span className="text-[var(--color-text-secondary)]">Next.js 15 with React 18</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[var(--color-secondary)] rounded-full mr-3"></div>
                  <span className="text-[var(--color-text-secondary)]">TypeScript for type safety</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[var(--color-success)] rounded-full mr-3"></div>
                  <span className="text-[var(--color-text-secondary)]">Tailwind CSS for styling</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full mr-3"></div>
                  <span className="text-[var(--color-text-secondary)]">Responsive design principles</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Backend & Database</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full mr-3"></div>
                  <span className="text-[var(--color-text-secondary)]">Node.js with Express.js</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[var(--color-secondary)] rounded-full mr-3"></div>
                  <span className="text-[var(--color-text-secondary)]">MongoDB Atlas database</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[var(--color-success)] rounded-full mr-3"></div>
                  <span className="text-[var(--color-text-secondary)]">Mongoose ODM for data modeling</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full mr-3"></div>
                  <span className="text-[var(--color-text-secondary)]">RESTful API architecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Security & Privacy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Data Protection</h3>
              <p className="text-[var(--color-text-secondary)]">
                All user data is encrypted and protected using industry-standard security protocols.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Privacy Controls</h3>
              <p className="text-[var(--color-text-secondary)]">
                Users have full control over their personal information and can choose what to share publicly.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Verification Systems</h3>
              <p className="text-[var(--color-text-secondary)]">
                Advanced verification prevents fraud while maintaining accessibility for legitimate users.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg shadow-lg p-8 text-center text-[var(--color-text-on-primary)]">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 opacity-90">
            Now that you understand how Whitepine works, it's time to explore the platform 
            and start making a difference in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link 
              href="/participate"
              className="px-6 py-3 bg-[var(--color-text-on-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium"
            >
              Start Participating
            </Link>
            <Link 
              href="/public/guide-us"
              className="px-6 py-3 border-2 border-[var(--color-text-on-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-text-on-primary)] hover:text-[var(--color-primary)] transition-colors duration-200 font-medium"
            >
              Guide Development
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
