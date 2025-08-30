'use client'

import QOTD from './components/Hero/QOTD'
import Statistics from './components/Statistics'
import TrendingPetitions from './components/TrendingPetitions'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <QOTD />
      <Statistics />
      <TrendingPetitions />
    </div>
  )
}
