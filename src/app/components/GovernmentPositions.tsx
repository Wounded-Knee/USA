'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '../contexts/ThemeContext'

interface Position {
  _id: string
  office: {
    _id: string
    name: string
    office_type: string
    jurisdiction?: {
      _id: string
      name: string
      slug: string
      level: string
    }
    governing_body?: {
      _id: string
      name: string
      slug: string
      branch: string
    }
    district?: {
      _id: string
      name: string
      district_type: string
      district_number: number
    }
  }
  term_start: string
  term_end?: string
  is_current: boolean
  status: string
  party?: string
  election?: {
    _id: string
    election_date: string
    election_type: string
  }
}

interface CommitteeMembership {
  _id: string
  name: string
  committee_type: string
  governing_body: {
    _id: string
    name: string
    slug: string
  }
  jurisdiction: {
    _id: string
    name: string
    slug: string
    level: string
  }
  chair?: string
  vice_chair?: string
  members: string[]
}

interface GovernmentPositionsProps {
  currentPositions: Position[]
  pastPositions: Position[]
  committeeMemberships: CommitteeMembership[]
  userId: string
}

export default function GovernmentPositions({ 
  currentPositions, 
  pastPositions, 
  committeeMemberships,
  userId 
}: GovernmentPositionsProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'committees'>('current')
  const { resolvedTheme } = useTheme()

  const getOfficeTypeColor = (officeType: string) => {
    const colors = {
      president: 'bg-[var(--fs-16350)]/10 text-[var(--fs-16350)] border-[var(--fs-16350)]/20',
      governor: 'bg-[var(--fs-15056)]/10 text-[var(--fs-15056)] border-[var(--fs-15056)]/20',
      senator: 'bg-[var(--fs-15125)]/10 text-[var(--fs-15125)] border-[var(--fs-15125)]/20',
      representative: 'bg-[var(--fs-14260)]/10 text-[var(--fs-14260)] border-[var(--fs-14260)]/20',
      mayor: 'bg-[var(--fs-15080)]/10 text-[var(--fs-15080)] border-[var(--fs-15080)]/20',
      judge: 'bg-[var(--fs-16357)]/10 text-[var(--fs-16357)] border-[var(--fs-16357)]/20',
      commissioner: 'bg-[var(--fs-16165)]/10 text-[var(--fs-16165)] border-[var(--fs-16165)]/20',
      other: 'bg-[var(--fs-16152)]/10 text-[var(--fs-16152)] border-[var(--fs-16152)]/20'
    }
    return colors[officeType as keyof typeof colors] || colors.other
  }

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent && status === 'active') {
      return 'bg-[var(--fs-14260)]/10 text-[var(--fs-14260)]'
    } else if (status === 'resigned') {
      return 'bg-[var(--fs-16350)]/10 text-[var(--fs-16350)]'
    } else if (status === 'removed') {
      return 'bg-[var(--fs-16350)]/10 text-[var(--fs-16350)]'
    } else {
      return 'bg-[var(--fs-16152)]/10 text-[var(--fs-16152)]'
    }
  }

  const getBranchColor = (branch: string) => {
    const colors = {
      executive: 'bg-[var(--fs-15056)]/10 text-[var(--fs-15056)] border-[var(--fs-15056)]/20',
      legislative: 'bg-[var(--fs-14260)]/10 text-[var(--fs-14260)] border-[var(--fs-14260)]/20',
      judicial: 'bg-[var(--fs-15125)]/10 text-[var(--fs-15125)] border-[var(--fs-15125)]/20',
      independent: 'bg-[var(--fs-16357)]/10 text-[var(--fs-16357)] border-[var(--fs-16357)]/20'
    }
    return colors[branch as keyof typeof colors] || 'bg-[var(--fs-16152)]/10 text-[var(--fs-16152)] border-[var(--fs-16152)]/20'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatOfficeType = (officeType: string) => {
    return officeType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const renderPosition = (position: Position) => (
    <div key={position._id} className={`p-4 border rounded-lg transition-colors duration-200 ${
      resolvedTheme === 'dark' 
        ? 'border-neutral-light bg-surface hover:bg-surface-dark' 
        : 'border-neutral-light bg-surface hover:bg-neutral-light'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-foreground mb-1">
            {position.office.name}
          </h4>
          <p className="text-neutral text-sm mb-2">
            {position.office.jurisdiction?.name || position.office.governing_body?.name || 'Unknown Organization'} 
            {position.office.jurisdiction?.level && ` (${position.office.jurisdiction.level})`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(position.status, position.is_current)}`}>
            {position.is_current ? 'Current' : position.status}
          </span>
                     {position.party && (
             <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--fs-15056)]/10 text-[var(--fs-15056)] border border-[var(--fs-15056)]/20">
               {position.party}
             </span>
           )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getOfficeTypeColor(position.office.office_type)}`}>
          {formatOfficeType(position.office.office_type)}
        </span>
        {position.office.governing_body && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBranchColor(position.office.governing_body.branch)}`}>
            {position.office.governing_body.branch}
          </span>
        )}
                 {position.office.district && (
           <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--fs-15080)]/10 text-[var(--fs-15080)] border border-[var(--fs-15080)]/20">
             {position.office.district.name}
           </span>
         )}
      </div>

      <div className="text-sm text-neutral">
        <div className="flex items-center gap-4">
          <span>Term: {formatDate(position.term_start)}</span>
          {position.term_end && <span>- {formatDate(position.term_end)}</span>}
          {position.election && (
            <span>Elected: {formatDate(position.election.election_date)} ({position.election.election_type})</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderCommitteeMembership = (committee: CommitteeMembership) => {
    const userRole = committee.chair === userId ? 'Chair' : 
                    committee.vice_chair === userId ? 'Vice Chair' : 
                    committee.members.includes(userId) ? 'Member' : 'Unknown'

    return (
      <div key={committee._id} className={`p-4 border rounded-lg transition-colors duration-200 ${
        resolvedTheme === 'dark' 
          ? 'border-neutral-light bg-surface hover:bg-surface-dark' 
          : 'border-neutral-light bg-surface hover:bg-neutral-light'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-foreground mb-1">
              {committee.name}
            </h4>
            <p className="text-neutral text-sm mb-2">
              {committee.governing_body.name} • {committee.jurisdiction.name}
            </p>
          </div>
                     <div className="flex items-center gap-2">
             <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--fs-15056)]/10 text-[var(--fs-15056)] border border-[var(--fs-15056)]/20">
               {userRole}
             </span>
             <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--fs-16152)]/10 text-[var(--fs-16152)] border border-[var(--fs-16152)]/20">
               {committee.committee_type}
             </span>
           </div>
        </div>

        <div className="text-sm text-neutral">
          <p>Jurisdiction: {committee.jurisdiction.name} ({committee.jurisdiction.level})</p>
          <p>Governing Body: {committee.governing_body.name}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg shadow-sm border ${
      resolvedTheme === 'dark' 
        ? 'bg-surface border-neutral-light' 
        : 'bg-white border-neutral-light'
    }`}>
      <div className="p-6 border-b border-neutral-light">
        <h2 className="text-xl font-semibold text-foreground mb-2">Government Positions</h2>
        <p className="text-neutral text-sm">
          Your current and past government offices, positions, and committee memberships
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-light">
        <nav className="flex space-x-8 px-6" aria-label="Government tabs">
          <button
            onClick={() => setActiveTab('current')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-t ${
              activeTab === 'current'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral hover:text-neutral-dark'
            }`}
          >
            Current ({currentPositions.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-t ${
              activeTab === 'past'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral hover:text-neutral-dark'
            }`}
          >
            Past ({pastPositions.length})
          </button>
          <button
            onClick={() => setActiveTab('committees')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-t ${
              activeTab === 'committees'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral hover:text-neutral-dark'
            }`}
          >
            Committees ({committeeMemberships.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'current' && (
          <div>
            {currentPositions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral mb-4">You don't currently hold any government positions.</p>
                <Link
                  href="/lab/government-browser"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
                >
                  Browse Government Positions
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {currentPositions.map(renderPosition)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div>
            {pastPositions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral">No past government positions found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pastPositions.map(renderPosition)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'committees' && (
          <div>
            {committeeMemberships.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral mb-4">You're not currently a member of any committees.</p>
                <Link
                  href="/lab/government-browser"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
                >
                  Browse Committees
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {committeeMemberships.map(renderCommitteeMembership)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
