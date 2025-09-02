import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guide Our Development - Whitepine',
  description: 'Help shape the future of Whitepine by providing feedback, suggestions, and guidance on our platform development.',
}

export default function GuideUsPage() {
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
            Guide Our Development
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Your voice matters in shaping the future of Whitepine. Help us build a better platform 
            for civic engagement by sharing your insights, feedback, and ideas.
          </p>
        </div>

        {/* How to Guide Us */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">How You Can Help</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Share Feedback</h3>
              <p className="text-[var(--color-text-secondary)]">
                Tell us what works, what doesn't, and what you'd like to see improved on our platform.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Suggest Features</h3>
              <p className="text-[var(--color-text-secondary)]">
                Propose new tools, integrations, or improvements that would enhance civic engagement.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Join Discussions</h3>
              <p className="text-[var(--color-text-secondary)]">
                Participate in community conversations about the future of digital democracy.
              </p>
            </div>
          </div>
        </div>

        {/* Development Process */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Our Development Process</h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-[var(--color-text-on-primary)] font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Community Input</h3>
                <p className="text-[var(--color-text-secondary)]">
                  We actively seek and collect feedback from users, civic leaders, and community members 
                  through various channels including surveys, focus groups, and direct communication.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-[var(--color-text-on-primary)] font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Analysis & Prioritization</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Our team analyzes all feedback to identify patterns, assess feasibility, and prioritize 
                  development efforts based on community impact and technical considerations.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--color-success)] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-[var(--color-text-on-primary)] font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Development & Testing</h3>
                <p className="text-[var(--color-text-secondary)]">
                  We develop new features and improvements using agile methodologies, with regular 
                  community testing and feedback loops to ensure quality and usability.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--color-accent)] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-[var(--color-text-on-primary)] font-bold text-lg">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Release & Iteration</h3>
                <p className="text-[var(--color-text-secondary)]">
                  New features are released to the community with ongoing monitoring and iteration 
                  based on real-world usage and continued feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Focus Areas */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Current Focus Areas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Mobile Experience</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Improving the mobile interface and ensuring the platform works seamlessly across all devices.
              </p>
              <div className="flex items-center text-sm text-[var(--color-text-muted)]">
                <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-2"></span>
                In Development
              </div>
            </div>
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Accessibility</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Enhancing accessibility features to ensure the platform is usable by people with diverse abilities.
              </p>
              <div className="flex items-center text-sm text-[var(--color-text-muted)]">
                <span className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-2"></span>
                Planning Phase
              </div>
            </div>
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Data Visualization</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Creating better tools for visualizing civic data and campaign progress.
              </p>
              <div className="flex items-center text-sm text-[var(--color-text-muted)]">
                <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mr-2"></span>
                Research Phase
              </div>
            </div>
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Integration APIs</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Building APIs to integrate with other civic technology platforms and tools.
              </p>
              <div className="flex items-center text-sm text-[var(--color-text-muted)]">
                <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full mr-2"></span>
                Concept Phase
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Community-Driven Success Stories</h2>
          <div className="space-y-6">
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Enhanced Petition Creation</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Based on community feedback, we completely redesigned the petition creation process, 
                making it more intuitive and user-friendly. The new interface has increased successful 
                petition submissions by 40%.
              </p>
              <div className="text-sm text-[var(--color-text-muted)]">
                "The new petition form is so much easier to use. I was able to create my first petition 
                in under 10 minutes!" - Sarah M., Community Organizer
              </div>
            </div>
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Improved Search & Discovery</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Users consistently requested better ways to find relevant petitions and initiatives. 
                We implemented advanced search filters and recommendation algorithms, resulting in 
                a 60% increase in user engagement with petitions.
              </p>
              <div className="text-sm text-[var(--color-text-muted)]">
                "I can now easily find petitions that match my interests and location. 
                The platform feels much more personalized." - Michael R., Civic Volunteer
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg shadow-lg p-8 text-center text-[var(--color-text-on-primary)]">
          <h2 className="text-3xl font-bold mb-4">Ready to Guide Our Future?</h2>
          <p className="text-lg mb-6 opacity-90">
            Your insights and feedback are invaluable in building a better platform for civic engagement. 
            Join our community of citizen advisors and help shape the future of digital democracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link 
              href="/contact"
              className="px-6 py-3 bg-[var(--color-text-on-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium"
            >
              Share Feedback
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
