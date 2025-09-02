import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voter & Advocate - Whitepine',
  description: 'Discover your position in the republic, responsibilities, and voice in the collective chorus of democracy.',
}

export default function VoterAdvocatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background-secondary)] to-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Voter & Advocate
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Discover your position in the republic, responsibilities, and voice in the collective chorus of democracy.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Your Role in Democracy</h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <p>
                  As a voter and advocate, you are the foundation of our democratic system. Your voice, 
                  your vote, and your participation shape the future of our communities and nation.
                </p>
                <p>
                  Whitepine provides you with the tools and information you need to be an informed, 
                  engaged citizen who can make a real difference.
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Key Responsibilities</h2>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Stay informed about local and national issues
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Vote in all elections and participate in civic processes
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Engage with your representatives and community leaders
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Support initiatives that align with your values
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Educate others about important civic issues
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">How Whitepine Helps</h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-[var(--color-primary)] font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Access Information</h3>
                    <p>Get comprehensive, unbiased information about issues, candidates, and initiatives.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-[var(--color-primary)] font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Connect with Others</h3>
                    <p>Join communities of like-minded citizens and share your perspectives.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-[var(--color-primary)] font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Take Action</h3>
                    <p>Support petitions, contact representatives, and participate in civic initiatives.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Get Started Today</h2>
              <div className="space-y-4">
                <p className="text-[var(--color-text-secondary)]">
                  Ready to become a more engaged citizen? Start by exploring our platform and discovering 
                  the issues that matter most to you.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                                  <Link
                  href="/initiatives"
                  className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-200 font-medium"
                >
                  Browse Initiatives
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
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
          >
            ← Back to Participation Options
          </Link>
        </div>
      </div>
    </div>
  )
}
