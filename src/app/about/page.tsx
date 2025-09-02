import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Whitepine',
  description: 'Learn about Whitepine, our story, philosophy, and mission to strengthen democracy through civic engagement.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            About Whitepine
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            A civic platform rooted in the Great Tree of Peace, carrying forward the tradition of consensus, unity, and strength.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Our Story */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-4 text-center">Our Story</h3>
            <p className="text-[var(--color-text-secondary)] text-center">
              Born from the vision of digital democracy, Whitepine represents the convergence of ancient wisdom and modern technology.
            </p>
          </div>

          {/* Philosophy */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-4 text-center">Philosophy</h3>
            <p className="text-[var(--color-text-secondary)] text-center">
              We believe in the power of collective wisdom, transparent governance, and technology that serves the common good.
            </p>
          </div>

          {/* FAQ */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--color-success)] rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-[var(--color-text-on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-4 text-center">FAQ</h3>
            <p className="text-[var(--color-text-secondary)] text-center">
              Find answers to common questions about our platform, mission, and how to get involved.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-16 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-6 text-center max-w-4xl mx-auto">
            To democratize civic engagement through technology, making it easier for citizens to participate in governance, 
            propose solutions, and build consensus around important community issues.
          </p>
          <div className="text-center">
            <Link 
              href="/participate"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors duration-200"
            >
              Join Our Mission
            </Link>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 border border-[var(--color-border)]">
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Our Values</h3>
            <ul className="space-y-2 text-[var(--color-text-secondary)]">
              <li>• Transparency in all operations</li>
              <li>• Inclusivity and accessibility</li>
              <li>• Community-driven development</li>
              <li>• Ethical use of technology</li>
              <li>• Continuous improvement</li>
            </ul>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 border border-[var(--color-border)]">
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Get Involved</h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Whether you're a developer, civic leader, or concerned citizen, there's a place for you in the Whitepine community.
            </p>
            <Link 
              href="/participate"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
            >
              Learn more about participation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
