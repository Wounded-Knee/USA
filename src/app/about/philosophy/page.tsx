import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Philosophy - Whitepine',
  description: 'Explore our values, guiding principles, and the brand narrative that drives our mission.',
}

export default function PhilosophyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/about" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
            ← Back to About
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-6">
            Our Philosophy
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            The guiding principles and values that shape our mission to strengthen democracy 
            through civic engagement and collective wisdom.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
            <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">Unity through Diversity</h3>
            <p className="text-[var(--color-text-secondary)]">
              Like the branches of the tree, every voice is distinct, yet all contribute to the same canopy. 
              We celebrate our differences while finding common ground.
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
            <div className="w-16 h-16 bg-[var(--color-secondary-light)] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">Consensus over Conflict</h3>
            <p className="text-[var(--color-text-secondary)]">
              Decisions arise not from division but from the strength of common ground. 
              We seek understanding before agreement.
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
            <div className="w-16 h-16 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">Transparency as Covenant</h3>
            <p className="text-[var(--color-text-secondary)]">
              Testimonies are sacred records, woven together like wampum belts, 
              preserving truth for all to see and verify.
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
            <div className="w-16 h-16 bg-[var(--color-accent-light)] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">Strength from Roots</h3>
            <p className="text-[var(--color-text-secondary)]">
              The platform is grounded in the will of the people, spreading outward 
              like the white pine's roots, creating an unshakeable foundation.
            </p>
          </div>
        </div>

        {/* Brand Narrative */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">Our Brand Narrative</h2>
          <div className="prose prose-lg max-w-none text-[var(--color-text-secondary)]">
            <p className="mb-6">
              Whitepine represents the digital evolution of ancient democratic principles. We believe that 
              technology, when designed with wisdom and purpose, can amplify the best aspects of human 
              collaboration and collective decision-making.
            </p>
            <p className="mb-6">
              Our platform serves as a modern wampum belt, where each citizen's contribution is a bead 
              of wisdom, each initiative a strand of progress, and each victory a testament to the power 
              of unified action.
            </p>
            <p>
              We are not just building software; we are cultivating a digital ecosystem where democracy 
              thrives, where voices are heard, and where the collective wisdom of the people guides our 
              shared future.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link 
            href="/about/story"
            className="inline-flex items-center px-6 py-3 border border-[var(--color-border)] text-base font-medium rounded-md text-[var(--color-text)] bg-[var(--color-surface)] hover:bg-[var(--color-background)] transition-colors duration-200"
          >
            ← Our Story
          </Link>
          <Link 
            href="/about/faq"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors duration-200"
          >
            FAQ →
          </Link>
        </div>
      </div>
    </div>
  )
}
