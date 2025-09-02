'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface TrendingPetition {
  _id: string; // MongoDB uses _id, not id
  title: string;
  description: string;
  category: string; // Backend returns category directly, not categoryId
  voteCount: number; // Backend returns voteCount directly, not in snapshot
  totalVigor: number; // Backend returns totalVigor directly, not in snapshot
  creator: {
    firstName: string;
    lastName: string;
  };
  jurisdiction: {
    name: string;
    level: string;
  };
}

const TrendingPetitions: React.FC = () => {
  const [petitions, setPetitions] = useState<TrendingPetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('week');

  useEffect(() => {
    fetchTrendingPetitions();
  }, [timeFrame]);

  const fetchTrendingPetitions = async () => {
    try {
      setLoading(true);
      
      // Use the public trending endpoint
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/petitions/trending?limit=6&timeFrame=${timeFrame}`);
      setPetitions(response.data);
    } catch (error: any) {
      console.error('Failed to fetch trending petitions:', error);
      if (error.response?.status === 401) {
        console.log('Authentication required for trending petitions');
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Environment': 'bg-[var(--color-success)] text-[var(--color-text-on-primary)]',
      'Healthcare': 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)]',
      'Education': 'bg-[var(--color-primary-light)] text-[var(--color-text-on-primary)]',
      'Transportation': 'bg-[var(--color-yellow)] text-[var(--color-text-on-primary)]',
      'Public Safety': 'bg-[var(--color-accent-light)] text-[var(--color-text-on-primary)]',
      'Economic Development': 'bg-[var(--color-secondary)] text-[var(--color-text-on-primary)]',
      'Social Services': 'bg-[var(--color-pink)] text-[var(--color-text-on-primary)]',
      'Infrastructure': 'bg-[var(--color-neutral)] text-[var(--color-text-on-primary)]',
      'Other': 'bg-[var(--color-neutral)] text-[var(--color-text-on-primary)]'
    };
    return colors[category] || colors['Other'];
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Trending Petitions</h2>
          <div className="animate-pulse bg-[var(--color-border)] h-8 w-24 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[var(--color-border)] h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-[var(--color-border)] h-3 w-1/2 rounded mb-2"></div>
              <div className="bg-[var(--color-border)] h-3 w-full rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Trending Petitions</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-[var(--color-text-secondary)]">Time frame:</span>
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-3 py-1 text-sm border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent bg-[var(--color-surface)] text-[var(--color-text)]"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {petitions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[var(--color-text-secondary)]">No trending petitions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {petitions.map((petition) => (
            <Link
              key={petition._id}
              href={`/petitions/${petition._id}`}
              className="group block"
            >
              <div className="bg-[var(--color-background)] rounded-lg p-4 hover:bg-[var(--color-background-secondary)] transition-colors border border-[var(--color-border)] hover:border-[var(--color-border-secondary)]">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(petition.category)}`}>
                    {petition.category}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {petition.jurisdiction.level}
                  </span>
                </div>
                
                <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-2 line-clamp-2">
                  {petition.title}
                </h3>
                
                <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
                  {petition.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
                  <span>By {petition.creator.firstName} {petition.creator.lastName}</span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {petition.voteCount}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {petition.totalVigor}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <Link
          href="/petitions"
          className="inline-flex items-center px-4 py-2 border border-[var(--color-border)] rounded-md shadow-sm text-sm font-medium text-[var(--color-text)] bg-[var(--color-surface)] hover:bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:ring-offset-2 transition-colors"
        >
          View All Petitions
          <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default TrendingPetitions;
