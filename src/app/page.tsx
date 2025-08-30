'use client'

import QOTD from './components/Hero/QOTD'
import Statistics from './components/Statistics'
import TrendingPetitions from './components/TrendingPetitions'
import VigorLeaderboard from './components/VigorLeaderboard'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <QOTD />
      <Statistics />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TrendingPetitions />
          <VigorLeaderboard />
        </div>
      </div>
    </div>
  )
}
