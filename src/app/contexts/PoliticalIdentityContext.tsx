'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface PoliticalIdentity {
  id: string
  name: string
  abbreviation: string
  color: string
  description?: string
}

export type PoliticalIdentityContextType = {
  selectedIdentity: PoliticalIdentity | null
  setSelectedIdentity: (identity: PoliticalIdentity | null) => void
  availableIdentities: PoliticalIdentity[]
}

const PoliticalIdentityContext = createContext<PoliticalIdentityContextType | undefined>(undefined)

// Default political identities with California democracy theme colors
const defaultIdentities: PoliticalIdentity[] = [
  {
    id: 'democrat',
    name: 'Democrat',
    abbreviation: 'D',
    color: '#1e40af', // blue-600
    description: 'Democratic Party affiliation'
  },
  {
    id: 'republican',
    name: 'Republican',
    abbreviation: 'R',
    color: '#dc2626', // red-600
    description: 'Republican Party affiliation'
  },
  {
    id: 'independent',
    name: 'Independent',
    abbreviation: 'I',
    color: '#7c3aed', // violet-600
    description: 'Independent voter'
  },
  {
    id: 'green',
    name: 'Green',
    abbreviation: 'G',
    color: '#059669', // emerald-600
    description: 'Green Party affiliation'
  },
  {
    id: 'libertarian',
    name: 'Libertarian',
    abbreviation: 'L',
    color: '#d97706', // amber-600
    description: 'Libertarian Party affiliation'
  },
  {
    id: 'progressive',
    name: 'Progressive',
    abbreviation: 'P',
    color: '#be185d', // pink-600
    description: 'Progressive movement'
  },
  {
    id: 'conservative',
    name: 'Conservative',
    abbreviation: 'C',
    color: '#9d174d', // rose-600
    description: 'Conservative movement'
  },
  {
    id: 'moderate',
    name: 'Moderate',
    abbreviation: 'M',
    color: '#6b7280', // gray-600
    description: 'Moderate political position'
  }
]

export function PoliticalIdentityProvider({ children }: { children: React.ReactNode }) {
  const [selectedIdentity, setSelectedIdentity] = useState<PoliticalIdentity | null>(null)
  const [availableIdentities] = useState<PoliticalIdentity[]>(defaultIdentities)

  useEffect(() => {
    // Load selected identity from localStorage on mount
    const savedIdentityId = localStorage.getItem('politicalIdentity')
    if (savedIdentityId) {
      const savedIdentity = availableIdentities.find(id => id.id === savedIdentityId)
      if (savedIdentity) {
        setSelectedIdentity(savedIdentity)
      }
    }
  }, [availableIdentities])

  const handleSetIdentity = (identity: PoliticalIdentity | null) => {
    setSelectedIdentity(identity)
    if (identity) {
      localStorage.setItem('politicalIdentity', identity.id)
    } else {
      localStorage.removeItem('politicalIdentity')
    }
  }

  return (
    <PoliticalIdentityContext.Provider
      value={{
        selectedIdentity,
        setSelectedIdentity: handleSetIdentity,
        availableIdentities
      }}
    >
      {children}
    </PoliticalIdentityContext.Provider>
  )
}

export function usePoliticalIdentity() {
  const context = useContext(PoliticalIdentityContext)
  if (context === undefined) {
    throw new Error('usePoliticalIdentity must be used within a PoliticalIdentityProvider')
  }
  return context
}
