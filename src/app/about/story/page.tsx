import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story - Whitepine',
  description: 'Discover the origins of Whitepine, inspired by the Peacemaker and the Whitepine vision.',
}

export default function OurStoryPage() {
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
            Our Story
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            From the Great Tree of Peace to the digital age, discover how Whitepine continues 
            the legacy of consensus, unity, and strength.
          </p>
        </div>

        {/* Story Content */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">The Great Tree of Peace</h2>
          <div className="prose prose-lg max-w-none text-[var(--color-text-secondary)]">
            <p className="mb-6">
              Long before the founding of the United States, the Haudenosaunee Peacemaker planted a great white pine 
              as the Tree of Peace. Beneath its roots, weapons of war were buried, never to rise again. Its branches 
              stretched outward, offering shelter to all nations who sought harmony. Its roots spread in every direction, 
              inviting others to join in peace.
            </p>
            <p className="mb-6">
              This tree became a symbol of unity, where the eagle perched to watch for approaching danger, 
              and where the nations gathered to make decisions through consensus rather than conflict.
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--color-border)]">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">The Whitepine Vision</h2>
          <div className="prose prose-lg max-w-none text-[var(--color-text-secondary)]">
            <p className="mb-6">
              Whitepine continues this legacy in the digital age. Each citizen's voice is a bead of silicon wampum, 
              each testimony a covenant woven into the living record. Together, these voices grow into a sheltering 
              tree of democracy, too strong to be uprooted, too vast to be ignored.
            </p>
            <p className="mb-6">
              We believe that technology can amplify the wisdom of collective decision-making, creating a platform 
              where every voice matters and every contribution strengthens the whole community.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              To create a digital platform where every citizen's voice contributes to collective wisdom, 
              where transparency builds trust, and where consensus emerges from the strength of diverse perspectives. 
              We are building the Great Tree of Peace for the digital age.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link 
            href="/about"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            ← Back to About
          </Link>
          <Link 
            href="/about/philosophy"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Our Philosophy →
          </Link>
        </div>
      </div>
    </div>
  )
}
