'use client'

import React from 'react'
import Link from 'next/link'

interface UserVote {
  _id: string
  petition: {
    _id: string
    title: string
    description: string
    category: string
    voteCount: number
    targetVotes: number
    isActive: boolean
    jurisdiction?: {
      name: string
      level: string
    }
    governingBody?: {
      name: string
      branch: string
    }
  }
  totalVigor: number
  vigorCount: number
  signingStatement?: string
  createdAt: string
  capital?: number
}

interface UserVoteCardProps {
  vote: UserVote
}

export default function UserVoteCard({ vote }: UserVoteCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      environment: 'bg-[var(--fs-14260)]/10 text-[var(--fs-14260)] border-[var(--fs-14260)]/20',
      education: 'bg-[var(--fs-15056)]/10 text-[var(--fs-15056)] border-[var(--fs-15056)]/20',
      healthcare: 'bg-[var(--fs-16350)]/10 text-[var(--fs-16350)] border-[var(--fs-16350)]/20',
      economy: 'bg-[var(--fs-16357)]/10 text-[var(--fs-16357)] border-[var(--fs-16357)]/20',
      'civil-rights': 'bg-[var(--fs-15125)]/10 text-[var(--fs-15125)] border-[var(--fs-15125)]/20',
      'foreign-policy': 'bg-[var(--fs-15080)]/10 text-[var(--fs-15080)] border-[var(--fs-15080)]/20',
      other: 'bg-[var(--fs-16152)]/10 text-[var(--fs-16152)] border-[var(--fs-16152)]/20'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getProgressPercentage = (voteCount: number, targetVotes: number) => {
    return Math.min((voteCount / targetVotes) * 100, 100)
  }

  const formatCategory = (category: string) => {
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="p-6 hover:bg-neutral-light transition-colors duration-200 border-b border-neutral-light last:border-b-0">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          {/* Header with title and status */}
          <div className="flex items-start justify-between mb-2">
            <Link
              href={`/petitions/${vote.petition._id}`}
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors duration-200 flex-1"
            >
              {vote.petition.title}
            </Link>
                               <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                     vote.petition.isActive
                       ? 'bg-[var(--fs-14260)]/10 text-[var(--fs-14260)]'
                       : 'bg-[var(--fs-16152)]/10 text-[var(--fs-16152)]'
                   }`}>
                     {vote.petition.isActive ? 'Active' : 'Inactive'}
                   </span>
          </div>
          
          {/* Description */}
          <p className="text-neutral mb-3 line-clamp-2">{vote.petition.description}</p>
          
          {/* Petition Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm text-neutral mb-1">
              <span>Progress: {vote.petition.voteCount} / {vote.petition.targetVotes} votes</span>
              <span>{getProgressPercentage(vote.petition.voteCount, vote.petition.targetVotes).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-neutral-light rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(vote.petition.voteCount, vote.petition.targetVotes)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Tags and Metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(vote.petition.category)}`}>
              {formatCategory(vote.petition.category)}
            </span>
                               {vote.petition.jurisdiction && (
                     <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--fs-15056)]/10 text-[var(--fs-15056)] border border-[var(--fs-15056)]/20">
                       {vote.petition.jurisdiction.name} ({vote.petition.jurisdiction.level})
                     </span>
                   )}
                   {vote.petition.governingBody && (
                     <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--fs-15080)]/10 text-[var(--fs-15080)] border border-[var(--fs-15080)]/20">
                       {vote.petition.governingBody.name} ({vote.petition.governingBody.branch})
                     </span>
                   )}
          </div>
          
          {/* Signing Statement */}
          {vote.signingStatement && (
            <div className="mb-3 p-3 bg-neutral-light rounded-md">
              <p className="text-sm text-neutral italic">"{vote.signingStatement}"</p>
            </div>
          )}
          
          {/* Vote Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>Vigor: {vote.totalVigor}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Activities: {vote.vigorCount}</span>
            </div>
            {vote.capital !== undefined && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Capital: {vote.capital}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Voted: {new Date(vote.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
