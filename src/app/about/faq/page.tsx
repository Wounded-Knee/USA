import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Whitepine',
  description: 'Find answers to common questions and concerns about our platform and mission.',
}

const faqs = [
  {
    question: "What is Whitepine?",
    answer: "Whitepine is a civic platform that strengthens democracy through collective decision-making and civic engagement. We provide tools for citizens to participate in initiatives, voice their concerns, and contribute to community decisions."
  },
  {
    question: "How does Whitepine work?",
    answer: "Our platform operates on three core principles: votes (citizen input), vigor (engagement metrics), and capital (resource allocation). Citizens can participate in petitions, initiatives, and community discussions to drive positive change."
  },
  {
    question: "Is Whitepine affiliated with any political party?",
    answer: "No, Whitepine is non-partisan and independent. We believe in the power of citizen voices across all political spectrums and focus on consensus-building rather than partisan division."
  },
  {
    question: "How do you ensure the security of user data?",
    answer: "We implement industry-standard security measures, including encryption, secure authentication, and regular security audits. Your privacy and data security are our top priorities."
  },
  {
    question: "Can anyone participate in Whitepine?",
    answer: "Yes! Whitepine is open to all citizens who want to make a difference in their communities. While some features require registration, most content is publicly accessible."
  },
  {
    question: "How do you measure the impact of initiatives?",
    answer: "We track various metrics including participation rates, community engagement, and real-world outcomes. Success is measured not just by numbers, but by tangible improvements in communities."
  },
  {
    question: "What makes Whitepine different from other civic platforms?",
    answer: "Whitepine combines ancient democratic principles with modern technology. We focus on consensus-building, transparency, and collective wisdom rather than just voting or petitioning."
  },
  {
    question: "How can I get involved as a developer?",
    answer: "We welcome open-source contributions! Visit our Participate section for developers to learn about our roadmap, GitHub repositories, and how you can contribute to building the platform."
  }
]

export default function FAQPage() {
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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Find answers to common questions about Whitepine, our platform, and how you can get involved.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6 mb-16">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 border border-[var(--color-border)]">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                {faq.question}
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-center">
            Still Have Questions?
          </h2>
          <p className="text-[var(--color-text-secondary)] text-center mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="text-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link 
            href="/about/philosophy"
            className="inline-flex items-center px-6 py-3 border border-[var(--color-border)] text-base font-medium rounded-md text-[var(--color-text)] bg-[var(--color-surface)] hover:bg-[var(--color-background)] transition-colors duration-200"
          >
            ← Our Philosophy
          </Link>
          <Link 
            href="/participate"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--color-text-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors duration-200"
          >
            Get Involved →
          </Link>
        </div>
      </div>
    </div>
  )
}
