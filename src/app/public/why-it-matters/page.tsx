import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Why It Matters - Whitepine',
  description: 'Understand the importance of civic engagement and how technology can strengthen democracy in our communities.',
}

export default function WhyItMattersPage() {
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
            Why Civic Engagement Matters
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            In an increasingly digital world, the need for accessible, transparent, and effective 
            civic engagement has never been greater. Discover why strengthening democracy through 
            technology is crucial for our communities.
          </p>
        </div>

        {/* Core Values */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Core Democratic Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Transparency</h3>
              <p className="text-[var(--color-text-secondary)]">
                Open access to information about government decisions, policies, and processes 
                builds trust and enables informed participation.
              </p>
            </div>
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Accountability</h3>
              <p className="text-[var(--color-text-secondary)]">
                Citizens must be able to hold their representatives and institutions accountable 
                for their actions and decisions.
              </p>
            </div>
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Participation</h3>
              <p className="text-[var(--color-text-secondary)]">
                Active citizen involvement in democratic processes ensures diverse perspectives 
                are represented and considered.
              </p>
            </div>
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Representation</h3>
              <p className="text-[var(--color-text-secondary)]">
                Democratic systems must accurately reflect the diversity and interests 
                of the communities they serve.
              </p>
            </div>
          </div>
        </div>

        {/* Democratic Challenges */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Modern Democratic Challenges</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[var(--color-error)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-4 h-4 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Low Voter Turnout</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Many citizens feel disconnected from the political process, leading to decreased 
                  participation in elections and civic activities.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[var(--color-warning)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-4 h-4 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Information Overload</h3>
                <p className="text-[var(--color-text-secondary)]">
                  The abundance of information and misinformation makes it difficult for citizens 
                  to make informed decisions about civic matters.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-4 h-4 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Geographic Barriers</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Physical distance and transportation challenges prevent many citizens from 
                  participating in local government meetings and civic events.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-4 h-4 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Accessibility Issues</h3>
                <p className="text-[var(--color-text-secondary)]">
                  Many civic processes and platforms are not designed with accessibility in mind, 
                  excluding citizens with disabilities from full participation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Solutions */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">How Technology Can Help</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Digital Democracy</h3>
              <p className="text-[var(--color-text-secondary)]">
                Online platforms enable citizens to participate in civic processes from anywhere, 
                breaking down geographic and time barriers.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Transparency Tools</h3>
              <p className="text-[var(--color-text-secondary)]">
                Technology can make government data and processes more accessible, 
                helping citizens understand and engage with civic issues.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Community Building</h3>
              <p className="text-[var(--color-text-secondary)]">
                Digital platforms can connect citizens with similar interests and concerns, 
                fostering stronger community bonds and collective action.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Stories */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Real-World Impact</h2>
          <div className="space-y-6">
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Local Policy Change</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                A community used digital petitioning to gather 2,000+ signatures in support of 
                a new bike lane project. The city council approved the project within 3 months, 
                demonstrating the power of organized civic engagement.
              </p>
              <div className="text-sm text-[var(--color-text-muted)]">
                "Digital tools made it possible for us to organize and advocate effectively. 
                We couldn't have reached so many people through traditional methods alone." - Local Advocacy Group
              </div>
            </div>
            <div className="p-6 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">Increased Voter Registration</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                A civic technology platform helped increase voter registration by 35% in underserved 
                communities by providing accessible information and simplified registration processes.
              </p>
              <div className="text-sm text-[var(--color-text-muted)]">
                "Technology removed the barriers that were preventing people from participating 
                in our democracy." - Civic Engagement Director
              </div>
            </div>
          </div>
        </div>

        {/* Future Vision */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Our Vision for the Future</h2>
          <div className="text-center">
            <p className="text-lg text-[var(--color-text-secondary)] mb-6">
              We envision a future where every citizen has easy access to civic participation tools, 
              where government processes are transparent and accessible, and where technology 
              strengthens rather than weakens democratic values.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Universal Access</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Civic participation tools available to all citizens regardless of location or ability
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Transparent Governance</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Open access to government data and decision-making processes
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Active Communities</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Engaged citizens working together to improve their communities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg shadow-lg p-8 text-center text-[var(--color-text-on-primary)]">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg mb-6 opacity-90">
            Understanding why civic engagement matters is the first step. Now it's time to get involved 
            and help strengthen democracy in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link 
              href="/participate"
              className="px-6 py-3 bg-[var(--color-text-on-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-background)] transition-colors duration-200 font-medium"
            >
              Get Involved
            </Link>
            <Link 
              href="/public/how-it-works"
              className="px-6 py-3 border-2 border-[var(--color-text-on-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-text-on-primary)] hover:text-[var(--color-primary)] transition-colors duration-200 font-medium"
            >
              Learn How
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
