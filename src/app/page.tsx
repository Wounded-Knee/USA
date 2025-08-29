'use client'

import QOTD from './components/Hero/QOTD'
import Statistics from './components/Statistics'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <QOTD />
      <Statistics />
    </div>
  )
}
