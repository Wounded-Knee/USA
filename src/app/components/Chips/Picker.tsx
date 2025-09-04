'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import BaseChip from './BaseChip'
import EconomicIdentityChip from './EconomicIdentityChip'
import EducationalIdentityChip from './EducationalIdentityChip'
import IndustrialIdentityChip from './IndustrialIdentityChip'
import MaritalIdentityChip from './MaritalIdentityChip'
import PoliticalIdentityChip from './PoliticalIdentityChip'
import RacialIdentityChip from './RacialIdentityChip'
import ReligiousIdentityChip from './ReligiousIdentityChip'
import SexualIdentityChip from './SexualIdentityChip'

export type IdentityType = 
  | 'EconomicIdentity'
  | 'EducationalIdentity'
  | 'IndustrialIdentity'
  | 'MaritalIdentity'
  | 'PoliticalIdentity'
  | 'RacialIdentity'
  | 'ReligiousIdentity'
  | 'SexualIdentity'

export interface IdentityData {
  id: string
  name: string
  description: string
  abbr?: string
  parentId?: string | number | null
  slug: string
  identityType: IdentityType
  populationEstimate?: {
    year: number
    source: string
    estimate: number
  }
  isActive?: boolean
  incomeRange?: {
    low: number
    high: number
  }
}

export interface PickerProps {
  identityType: IdentityType
  selectedChip?: IdentityData | null
  onChipSelect: (chip: IdentityData | null) => void
  placeholder?: string
  className?: string
}

const Picker: React.FC<PickerProps> = ({
  identityType,
  selectedChip,
  onChipSelect,
  placeholder = "Select an identity...",
  className = ""
}) => {
  const { token, user, loading: authLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [availableChips, setAvailableChips] = useState<IdentityData[]>([])
  const [filteredChips, setFilteredChips] = useState<IdentityData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [navigationStack, setNavigationStack] = useState<IdentityData[]>([]) // Track navigation history
  const pickerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Helper function to update navigation stack properly
  const updateNavigationStack = (currentStack: IdentityData[], newChip: IdentityData): IdentityData[] => {
    // If the new chip is a top-level chip (parentId is null), start fresh
    if (newChip.parentId === null) {
      return [newChip]
    }
    
    // Find the parent of the new chip in the current stack
    const parentIndex = currentStack.findIndex(chip => chip.id === newChip.parentId?.toString())
    
    if (parentIndex !== -1) {
      // If parent is found, keep everything up to and including the parent, then add the new chip
      // This maintains the full path from root to the new chip
      return [...currentStack.slice(0, parentIndex + 1), newChip]
    } else {
      // If parent is not found in current stack, this might be a sibling or unrelated chip
      // In this case, we need to find the correct path from the mock data
      const allChips = mockData[identityType]
      const path: IdentityData[] = []
      
      // Build the path from root to the new chip
      let currentChip: IdentityData | null = newChip
      while (currentChip) {
        path.unshift(currentChip)
        if (currentChip.parentId === null) {
          break
        }
        currentChip = allChips.find(c => c.id === currentChip?.parentId?.toString()) || null
      }
      
      return path
    }
  }

  // Mock data - in real implementation, this would come from API calls
  const mockData: Record<IdentityType, IdentityData[]> = {
    EconomicIdentity: [
      {
        id: 'economic-1',
        name: 'Middle Class',
        description: 'Households with annual income between $50,000 and $150,000',
        abbr: 'MC',
        parentId: null,
        slug: 'middle-class',
        identityType: 'EconomicIdentity',
        populationEstimate: { year: 2025, source: 'Census Bureau', estimate: 45000000 },
        incomeRange: { low: 50000, high: 150000 }
      },
      {
        id: 'economic-2',
        name: 'Upper Class',
        description: 'Households with annual income above $150,000',
        abbr: 'UC',
        parentId: null,
        slug: 'upper-class',
        identityType: 'EconomicIdentity',
        populationEstimate: { year: 2025, source: 'Census Bureau', estimate: 15000000 },
        incomeRange: { low: 150000, high: 1000000 }
      },
      {
        id: 'economic-3',
        name: 'Working Class',
        description: 'Households with annual income between $25,000 and $50,000',
        abbr: 'WC',
        parentId: null,
        slug: 'working-class',
        identityType: 'EconomicIdentity',
        populationEstimate: { year: 2025, source: 'Census Bureau', estimate: 35000000 },
        incomeRange: { low: 25000, high: 50000 }
      }
    ],
    EducationalIdentity: [
      {
        id: 'educational-1',
        name: 'College Graduate',
        description: 'Individuals with a bachelor\'s degree or higher',
        abbr: 'CG',
        parentId: null,
        slug: 'college-graduate',
        identityType: 'EducationalIdentity',
        populationEstimate: { year: 2025, source: 'Census Bureau', estimate: 35000000 }
      },
      {
        id: 'educational-2',
        name: 'High School Graduate',
        description: 'Individuals with a high school diploma',
        abbr: 'HS',
        parentId: null,
        slug: 'high-school-graduate',
        identityType: 'EducationalIdentity',
        populationEstimate: { year: 2025, source: 'Census Bureau', estimate: 45000000 }
      }
    ],
    IndustrialIdentity: [
      {
        id: 'industrial-1',
        name: 'Technology Worker',
        description: 'Professionals working in the technology sector',
        abbr: 'TW',
        parentId: null,
        slug: 'technology-worker',
        identityType: 'IndustrialIdentity',
        populationEstimate: { year: 2025, source: 'BLS', estimate: 8500000 }
      }
    ],
    MaritalIdentity: [
      {
        id: 'marital-1',
        name: 'Married',
        description: 'Individuals who are currently married',
        abbr: 'M',
        parentId: null,
        slug: 'married',
        identityType: 'MaritalIdentity',
        populationEstimate: { year: 2025, source: 'Census Bureau', estimate: 125000000 }
      }
    ],
    PoliticalIdentity: [
      {
        id: 'political-1',
        name: 'Independent Voter',
        description: 'Registered voters who are not affiliated with a major political party',
        abbr: 'IV',
        parentId: null,
        slug: 'independent-voter',
        identityType: 'PoliticalIdentity',
        populationEstimate: { year: 2025, source: 'Election Commission', estimate: 45000000 }
      }
    ],
    RacialIdentity: [
      {
        id: 'racial-1',
        name: 'Multiracial',
        description: 'Individuals who identify with multiple racial backgrounds',
        abbr: 'MR',
        parentId: null,
        slug: 'multiracial',
        identityType: 'RacialIdentity',
        populationEstimate: { year: 2025, source: 'Census Bureau', estimate: 9500000 }
      }
    ],
    ReligiousIdentity: [
      // Level 0: Top-level categories only
      {
        id: 'religious-1',
        name: 'Christian',
        description: 'Individuals who identify as Christian',
        abbr: 'CHR',
        parentId: null,
        slug: 'christian',
        identityType: 'ReligiousIdentity',
        populationEstimate: { year: 2025, source: 'Pew Research', estimate: 180000000 }
      },
      {
        id: 'religious-2',
        name: 'Non-Religious',
        description: 'Individuals who do not identify with any organized religion',
        abbr: 'NR',
        parentId: null,
        slug: 'non-religious',
        identityType: 'ReligiousIdentity',
        populationEstimate: { year: 2025, source: 'Pew Research', estimate: 28000000 }
      },
      {
        id: 'religious-3',
        name: 'Jewish',
        description: 'Individuals who identify as Jewish',
        abbr: 'JEW',
        parentId: null,
        slug: 'jewish',
        identityType: 'ReligiousIdentity',
        populationEstimate: { year: 2025, source: 'Pew Research', estimate: 7000000 }
      },
      {
        id: 'religious-4',
        name: 'Muslim',
        description: 'Individuals who identify as Muslim',
        abbr: 'MUS',
        parentId: null,
        slug: 'muslim',
        identityType: 'ReligiousIdentity',
        populationEstimate: { year: 2025, source: 'Pew Research', estimate: 3500000 }
      },
      {
        id: 'religious-5',
        name: 'Buddhist',
        description: 'Individuals who identify as Buddhist',
        abbr: 'BUD',
        parentId: null,
        slug: 'buddhist',
        identityType: 'ReligiousIdentity',
        populationEstimate: { year: 2025, source: 'Pew Research', estimate: 1200000 }
      },
      {
        id: 'religious-6',
        name: 'Hindu',
        description: 'Individuals who identify as Hindu',
        abbr: 'HIN',
        parentId: null,
        slug: 'hindu',
        identityType: 'ReligiousIdentity',
        populationEstimate: { year: 2025, source: 'Pew Research', estimate: 800000 }
      },
      {
        id: 'religious-7',
        name: 'Other Religions',
        description: 'Individuals who identify with other religious traditions',
        abbr: 'OTH',
        parentId: null,
        slug: 'other-religions',
        identityType: 'ReligiousIdentity',
        populationEstimate: { year: 2025, source: 'Pew Research', estimate: 2000000 }
      }
    ],
    SexualIdentity: [
      {
        id: 'sexual-1',
        name: 'LGBTQ+',
        description: 'Individuals who identify as lesbian, gay, bisexual, transgender, queer, or other non-heteronormative identities',
        abbr: 'LGBTQ+',
        parentId: null,
        slug: 'lgbtq-plus',
        identityType: 'SexualIdentity',
        populationEstimate: { year: 2025, source: 'Gallup', estimate: 7500000 }
      }
    ]
  }

  // Load initial data (top-level chips)
  const loadTopLevelChips = async () => {
      if (authLoading) {
        setError('Loading authentication...')
        return
      }
      
      if (!token) {
        console.log('No authentication token, using mock data for demo')
        // Use mock data for demo purposes when not authenticated
        const topLevelChips = mockData[identityType].filter(chip => chip.parentId === null)
        setAvailableChips(topLevelChips)
        setFilteredChips(topLevelChips)
        return
      }
      
      if (!user) {
        setError('User not found')
        return
      }

      setIsLoading(true)
      setError(null)
      
      try {
        // Map identity types to category slugs for API calls
        const categoryMap: Record<IdentityType, string> = {
          EconomicIdentity: 'economic',
          EducationalIdentity: 'educational',
          IndustrialIdentity: 'industrial',
          MaritalIdentity: 'marital',
          PoliticalIdentity: 'political',
          RacialIdentity: 'racial',
          ReligiousIdentity: 'religious',
          SexualIdentity: 'sexual'
        }

        const category = categoryMap[identityType]
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/identities`
        
        console.log('API Request:', {
          url: apiUrl,
          category,
          identityType,
          token: token ? 'present' : 'missing'
        })
        
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            category: category,
            parentId: 'null', // Get top-level identities
            limit: 100
          }
        })

        console.log('API Response:', response.data)

        if (response.data && response.data.identities) {
          const apiChips = response.data.identities.map((identity: any) => ({
            id: identity.id.toString(),
            name: identity.name,
            description: identity.description,
            abbr: identity.abbr,
            parentId: identity.parentId,
            slug: identity.slug,
            identityType: identityType,
            populationEstimate: identity.populationEstimate,
            isActive: identity.isActive,
            incomeRange: identity.incomeRange
          }))
          
          console.log('Mapped API chips:', apiChips)
          setAvailableChips(apiChips)
          setFilteredChips(apiChips)
        } else {
          console.log('No identities in response, using mock data')
          // Fallback to mock data if API fails
          const topLevelChips = mockData[identityType].filter(chip => chip.parentId === null)
          setAvailableChips(topLevelChips)
          setFilteredChips(topLevelChips)
        }
      } catch (err: any) {
        console.error('Error fetching identities:', err)
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        })
        
        const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to load identities'
        
        setError(errorMessage)
        
        // Fallback to mock data
        const topLevelChips = mockData[identityType].filter(chip => chip.parentId === null)
        setAvailableChips(topLevelChips)
        setFilteredChips(topLevelChips)
      } finally {
        setIsLoading(false)
      }
  }

  useEffect(() => {
    if (isOpen) {
      loadTopLevelChips()
    }
  }, [isOpen, identityType, token, user, authLoading])

  // Filter chips based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredChips(availableChips)
    } else {
      const filtered = availableChips.filter(chip =>
        chip.name.toLowerCase().includes(searchText.toLowerCase()) ||
        chip.description.toLowerCase().includes(searchText.toLowerCase()) ||
        (chip.abbr && chip.abbr.toLowerCase().includes(searchText.toLowerCase()))
      )
      setFilteredChips(filtered)
    }
  }, [searchText, availableChips])

  // Handle chip selection
  const handleChipSelect = async (chip: IdentityData) => {
    console.log('handleChipSelect called with:', chip.name, chip.id, 'isOpen:', isOpen)
    onChipSelect(chip)
    setSearchText('')
    
    // Check if this chip has children OR siblings
    let hasChildren = false
    let hasSiblings = false
    
    // Load children of selected chip from API
    if (token && user) {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/identities`
        
        // First, check for children
        const childrenResponse = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            parentId: chip.id,
            limit: 100
          }
        })

        if (childrenResponse.data && childrenResponse.data.identities && childrenResponse.data.identities.length > 0) {
          hasChildren = true
          const children = childrenResponse.data.identities.map((identity: any) => ({
            id: identity.id.toString(),
            name: identity.name,
            description: identity.description,
            abbr: identity.abbr,
            parentId: identity.parentId,
            slug: identity.slug,
            identityType: identityType,
            populationEstimate: identity.populationEstimate,
            isActive: identity.isActive,
            incomeRange: identity.incomeRange
          }))
          
          setAvailableChips(children)
          setFilteredChips(children)
          setNavigationStack(prev => updateNavigationStack(prev, chip))
        } else {
          // No children found, check for siblings
          if (chip.parentId) {
            const siblingsResponse = await axios.get(apiUrl, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: {
                parentId: chip.parentId,
                limit: 100
              }
            })

            if (siblingsResponse.data && siblingsResponse.data.identities && siblingsResponse.data.identities.length > 0) {
              hasSiblings = true
              const siblings = siblingsResponse.data.identities.map((identity: any) => ({
                id: identity.id.toString(),
                name: identity.name,
                description: identity.description,
                abbr: identity.abbr,
                parentId: identity.parentId,
                slug: identity.slug,
                identityType: identityType,
                populationEstimate: identity.populationEstimate,
                isActive: identity.isActive,
                incomeRange: identity.incomeRange
              }))
              
              setAvailableChips(siblings)
              setFilteredChips(siblings)
              setNavigationStack(prev => updateNavigationStack(prev, chip))
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching children/siblings:', err)
        // Fallback to mock data
        const children = mockData[identityType].filter(c => c.parentId?.toString() === chip.id)
        if (children.length > 0) {
          hasChildren = true
          setAvailableChips(children)
          setFilteredChips(children)
          setNavigationStack(prev => updateNavigationStack(prev, chip))
        } else if (chip.parentId) {
          // Check for siblings in mock data
          const siblings = mockData[identityType].filter(c => c.parentId?.toString() === chip.parentId?.toString())
          if (siblings.length > 0) {
            hasSiblings = true
            setAvailableChips(siblings)
            setFilteredChips(siblings)
            setNavigationStack(prev => updateNavigationStack(prev, chip))
          }
        }
      }
    } else {
      // Use mock data when not authenticated
      const children = mockData[identityType].filter(c => c.parentId?.toString() === chip.id)
      if (children.length > 0) {
        hasChildren = true
        setAvailableChips(children)
        setFilteredChips(children)
        setNavigationStack(prev => updateNavigationStack(prev, chip))
      } else if (chip.parentId) {
        // Check for siblings in mock data
        const siblings = mockData[identityType].filter(c => c.parentId?.toString() === chip.parentId?.toString())
        if (siblings.length > 0) {
          hasSiblings = true
          setAvailableChips(siblings)
          setFilteredChips(siblings)
          setNavigationStack(prev => updateNavigationStack(prev, chip))
        }
      }
    }
    
    // Only close the panel if the chip has no children AND no siblings
    if (!hasChildren && !hasSiblings) {
      setIsOpen(false)
    }
  }

  // Handle going back in navigation
  const handleGoBack = async () => {
    if (navigationStack.length > 0) {
      const newStack = [...navigationStack]
      newStack.pop() // Remove the last item
      setNavigationStack(newStack)
      
      if (newStack.length === 0) {
        // Go back to top level
        loadTopLevelChips()
      } else {
        // Go back to the previous level - load children of the parent
        const parentChip = newStack[newStack.length - 1]
        
        // Load children of the parent chip
        if (token && user) {
          try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/identities`
            
            const response = await axios.get(apiUrl, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: {
                parentId: parentChip.id,
                limit: 100
              }
            })

            if (response.data && response.data.identities && response.data.identities.length > 0) {
              const children = response.data.identities.map((identity: any) => ({
                id: identity.id.toString(),
                name: identity.name,
                description: identity.description,
                abbr: identity.abbr,
                parentId: identity.parentId,
                slug: identity.slug,
                identityType: identityType,
                populationEstimate: identity.populationEstimate,
                isActive: identity.isActive,
                incomeRange: identity.incomeRange
              }))
              
              setAvailableChips(children)
              setFilteredChips(children)
            } else {
              // Fallback to mock data
              const children = mockData[identityType].filter(c => c.parentId?.toString() === parentChip.id)
              setAvailableChips(children)
              setFilteredChips(children)
            }
          } catch (err: any) {
            console.error('Error fetching children on back navigation:', err)
            // Fallback to mock data
            const children = mockData[identityType].filter(c => c.parentId === parseInt(parentChip.id.split('-')[1]))
            setAvailableChips(children)
            setFilteredChips(children)
          }
        } else {
          // Use mock data when not authenticated
          const children = mockData[identityType].filter(c => c.parentId === parseInt(parentChip.id.split('-')[1]))
          setAvailableChips(children)
          setFilteredChips(children)
        }
      }
    }
  }

  // Handle clear selection
  const handleClear = async () => {
    onChipSelect(null)
    setSearchText('')
    setNavigationStack([]) // Reset navigation stack
    
    // Reset to top-level chips from API
    if (token && user) {
      try {
        const categoryMap: Record<IdentityType, string> = {
          EconomicIdentity: 'economic',
          EducationalIdentity: 'educational',
          IndustrialIdentity: 'industrial',
          MaritalIdentity: 'marital',
          PoliticalIdentity: 'political',
          RacialIdentity: 'racial',
          ReligiousIdentity: 'religious',
          SexualIdentity: 'sexual'
        }

        const category = categoryMap[identityType]
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/identities`
        
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            category: category,
            parentId: 'null',
            limit: 100
          }
        })

        if (response.data && response.data.identities) {
          const topLevelChips = response.data.identities.map((identity: any) => ({
            id: identity.id.toString(),
            name: identity.name,
            description: identity.description,
            abbr: identity.abbr,
            parentId: identity.parentId,
            slug: identity.slug,
            identityType: identityType,
            populationEstimate: identity.populationEstimate,
            isActive: identity.isActive,
            incomeRange: identity.incomeRange
          }))
          
          setAvailableChips(topLevelChips)
          setFilteredChips(topLevelChips)
        } else {
          // Fallback to mock data
          const topLevelChips = mockData[identityType].filter(chip => chip.parentId === null)
          setAvailableChips(topLevelChips)
          setFilteredChips(topLevelChips)
        }
      } catch (err: any) {
        console.error('Error fetching top-level chips:', err)
        // Fallback to mock data
        const topLevelChips = mockData[identityType].filter(chip => chip.parentId === null)
        setAvailableChips(topLevelChips)
        setFilteredChips(topLevelChips)
      }
    } else {
      // Use mock data when not authenticated
      const topLevelChips = mockData[identityType].filter(chip => chip.parentId === null)
      setAvailableChips(topLevelChips)
      setFilteredChips(topLevelChips)
    }
  }

  // Handle focus
  const handleFocus = () => {
    console.log('handleFocus called, selectedChip:', selectedChip?.name)
    setIsOpen(true)
    
    // If there's a selected chip, show its siblings (same level) or parent's children
    if (selectedChip) {
      // Find the parent of the selected chip
      const parentId = selectedChip.parentId
      
      if (parentId === null) {
        // Selected chip is top-level, show all top-level chips
        setNavigationStack([])
        loadTopLevelChips()
      } else {
        // Selected chip has a parent, show siblings (children of the parent)
        const parentChip = mockData[identityType].find(c => c.id === parentId?.toString())
        if (parentChip) {
          setNavigationStack([parentChip])
          // Load children of the parent (siblings of selected chip)
          const siblings = mockData[identityType].filter(c => c.parentId?.toString() === parentId?.toString())
          setAvailableChips(siblings)
          setFilteredChips(siblings)
        } else {
          // Fallback to top level if parent not found
          setNavigationStack([])
          loadTopLevelChips()
        }
      }
    } else {
      // No selected chip, show top-level chips
      setNavigationStack([])
      loadTopLevelChips()
    }
    
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('handleClickOutside called, isOpen:', isOpen, 'target:', event.target)
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        console.log('Click outside detected, closing panel')
        setIsOpen(false)
        setSearchText('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Render appropriate chip component
  const renderChip = (chip: IdentityData, format: 'default' | 'compact' | 'comprehensive' | 'icon' = 'default', onClick?: (() => void) | null) => {
    const chipProps = {
      ...chip,
      format,
      onClick: onClick === null ? undefined : (onClick || (() => handleChipSelect(chip)))
    }

    switch (chip.identityType) {
      case 'EconomicIdentity':
        return <EconomicIdentityChip {...chipProps} />
      case 'EducationalIdentity':
        return <EducationalIdentityChip {...chipProps} />
      case 'IndustrialIdentity':
        return <IndustrialIdentityChip {...chipProps} />
      case 'MaritalIdentity':
        return <MaritalIdentityChip {...chipProps} />
      case 'PoliticalIdentity':
        return <PoliticalIdentityChip {...chipProps} />
      case 'RacialIdentity':
        return <RacialIdentityChip {...chipProps} />
      case 'ReligiousIdentity':
        return <ReligiousIdentityChip {...chipProps} />
      case 'SexualIdentity':
        return <SexualIdentityChip {...chipProps} />
      default:
        return <BaseChip {...chipProps} />
    }
  }

  return (
    <div ref={pickerRef} className={`relative inline-flex ${className}`}>
      {/* Selected Chip Display */}
      <div
        className="cursor-pointer"
        onClick={handleFocus}
      >
        {selectedChip ? (
          <div className="relative">
            {renderChip(selectedChip, 'default', null)}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="absolute cursor-pointer -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400 hover:bg-gray-100 transition-colors">
            <span className="text-sm">{placeholder}</span>
          </div>
        )}
      </div>

      {/* Search Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Navigation Header */}
          {navigationStack.length > 0 && (
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <div className="text-sm text-gray-600">
                  {navigationStack.map((chip, index) => (
                    <span key={chip.id}>
                      {chip.name}
                      {index < navigationStack.length - 1 && <span className="mx-1">›</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search identities..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 border-b border-red-200 bg-red-50">
              <div className="text-sm text-red-600">
                {error}
              </div>
            </div>
          )}

          {/* Chip List */}
          <div className="max-h-64 overflow-y-auto p-3">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">
                Loading...
              </div>
            ) : filteredChips.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchText ? 'No identities found matching your search.' : 'No identities available.'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredChips.map((chip) => (
                  <div key={chip.id}>
                    {renderChip(chip, 'compact')}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back Button (if not at top level) */}
          {selectedChip && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={handleClear}
                className="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              >
                ← Back to top level
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Picker
