'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import CreatePetitionForm from '../components/CreatePetitionForm';
import TrendingPetitions from '../components/TrendingPetitions';
import axios from 'axios';

interface Jurisdiction {
  id: string;
  name: string;
  level: string;
}

interface Petition {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  creator: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  snapshot: {
    voteCount: number;
    totalVigor: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  jurisdiction: {
    id: string;
    name: string;
    level: string;
  };
  governingBody?: {
    id: string;
    name: string;
    branch: string;
  };
}

const PetitionsPage: React.FC = () => {
  const { user } = useAuth();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    jurisdiction: '',
    sort: '-createdAt'
  });

  useEffect(() => {
    fetchJurisdictions();
    fetchPetitions();
  }, [filters]);

  const fetchJurisdictions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/gov/jurisdictions`);
      setJurisdictions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch jurisdictions:', error);
    }
  };

  const fetchPetitions = async () => {
    try {
      setLoading(true);
      
      // Build query parameters for v1 API
      const params = new URLSearchParams();
      
      if (filters.category) {
        params.append('filter[categoryId]', filters.category);
      }
      
      if (filters.jurisdiction) {
        params.append('filter[jurisdictionId]', filters.jurisdiction);
      }
      
      if (filters.sort) {
        params.append('sort', filters.sort);
      }
      
      // Add pagination
      params.append('page', '1');
      params.append('page_size', '20');
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/petitions?${params}`);
      setPetitions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch petitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handlePetitionCreated = () => {
    setShowCreateForm(false);
    fetchPetitions(); // Refresh the list
  };

  const categories = [
    'Environment',
    'Healthcare',
    'Education',
    'Transportation',
    'Public Safety',
    'Economic Development',
    'Social Services',
    'Infrastructure',
    'Other'
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-voteCount', label: 'Most Votes' },
    { value: '-totalVigor', label: 'Most Vigor' }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Petitions</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Discover and support petitions that matter to your community
          </p>
        </div>

        {/* Trending Petitions */}
        <div className="mb-8">
          <TrendingPetitions />
        </div>

        {/* Filters and Create Button */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Category Filter */}
              <div className="min-w-[150px]">
                <label htmlFor="category" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Jurisdiction Filter */}
              <div className="min-w-[200px]">
                <label htmlFor="jurisdiction" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Jurisdiction
                </label>
                <select
                  id="jurisdiction"
                  value={filters.jurisdiction}
                  onChange={(e) => handleFilterChange('jurisdiction', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
                >
                  <option value="">All Jurisdictions</option>
                  {jurisdictions.map(jurisdiction => (
                    <option key={jurisdiction._id} value={jurisdiction._id}>
                      {jurisdiction.name} ({jurisdiction.level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="min-w-[150px]">
                <label htmlFor="sort" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Sort By
                </label>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Create Petition Button */}
            {user && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:ring-offset-2 font-medium transition-colors"
              >
                Create Petition
              </button>
            )}
          </div>
        </div>

        {/* Create Petition Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreatePetitionForm onPetitionCreated={handlePetitionCreated} />
          </div>
        )}

        {/* Petitions List */}
        <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
              <p className="mt-4 text-[var(--color-text-secondary)]">Loading petitions...</p>
            </div>
          ) : petitions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[var(--color-text-secondary)]">No petitions found matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {petitions.map((petition) => (
                <div key={petition.id} className="p-6 hover:bg-[var(--color-background)] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                          {petition.categoryId}
                        </span>
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {petition.jurisdiction.name} ({petition.jurisdiction.level})
                        </span>
                      </div>
                      
                      <Link href={`/petitions/${petition.id}`}>
                        <h3 className="text-xl font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors mb-2">
                          {petition.title}
                        </h3>
                      </Link>
                      
                      <p className="text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                        {petition.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
                        <span>By {petition.creator.firstName} {petition.creator.lastName}</span>
                        <span>{petition.snapshot.voteCount} votes</span>
                        <span>{petition.snapshot.totalVigor} vigor</span>
                        <span>{new Date(petition.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        href={`/petitions/${petition.id}`}
                        className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:ring-offset-2 text-sm font-medium transition-colors"
                      >
                        View Petition
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetitionsPage;
