'use client'

import Hero from './components/Hero'
import Statistics from './components/Statistics'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Statistics />
    </div>
  )
}
