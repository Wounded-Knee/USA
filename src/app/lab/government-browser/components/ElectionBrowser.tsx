'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

interface ElectionBrowserProps {
  isAuthorized: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  breadcrumbs?: BreadcrumbItem[];
  onElectionSelect?: (election: any) => void;
  currentJurisdictionFilter?: string | null;
}

const STATUS_OPTIONS = [
  'upcoming', 'active', 'completed', 'cancelled', 'postponed'
];

const ELECTION_TYPES = [
  'general', 'primary', 'special', 'runoff', 'recall', 'referendum', 'initiative'
];

export default function ElectionBrowser({ 
  isAuthorized, 
  isLoading, 
  setIsLoading,
  breadcrumbs = [],
  onElectionSelect,
  currentJurisdictionFilter
}: ElectionBrowserProps) {
  const { resolvedTheme } = useTheme();
  const [elections, setElections] = useState<any[]>([]);
  const [jurisdictionOptions, setJurisdictionOptions] = useState<{ value: string; label: string }[]>([]);

  // Theme-aware class names
  const themeClasses = {
    text: resolvedTheme === 'dark' ? 'text-foreground' : 'text-foreground',
    textSecondary: resolvedTheme === 'dark' ? 'text-neutral-light' : 'text-neutral-dark',
    textMuted: resolvedTheme === 'dark' ? 'text-neutral' : 'text-neutral',
    link: resolvedTheme === 'dark' 
      ? 'text-primary-light hover:text-primary focus:ring-primary-light' 
      : 'text-primary hover:text-primary-dark focus:ring-primary',
    badge: {
      upcoming: resolvedTheme === 'dark' ? 'bg-blue-900/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      active: resolvedTheme === 'dark' ? 'bg-green-900/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-800 border-green-200',
      completed: resolvedTheme === 'dark' ? 'bg-gray-900/20 text-gray-300 border-gray-500/30' : 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: resolvedTheme === 'dark' ? 'bg-red-900/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-800 border-red-200',
      default: resolvedTheme === 'dark' ? 'bg-neutral-900/20 text-neutral-300 border-neutral-500/30' : 'bg-neutral-100 text-neutral-800 border-neutral-200'
    },
    button: {
      edit: resolvedTheme === 'dark' 
        ? 'text-primary-light hover:text-primary focus:ring-primary-light' 
        : 'text-primary hover:text-primary-dark focus:ring-primary',
      delete: resolvedTheme === 'dark' 
        ? 'text-error hover:text-error/80 focus:ring-error/50' 
        : 'text-error hover:text-error/80 focus:ring-error/50'
    }
  };

  // Fetch jurisdictions for dropdown
  useEffect(() => {
    const fetchJurisdictions = async () => {
      try {
        // Use the new v1 API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gov/jurisdictions?page_size=1000`);
        const data = await response.json();
        const options = data.data?.map((jurisdiction: any) => ({
          value: jurisdiction._id,
          label: jurisdiction.name
        })) || [];
        setJurisdictionOptions([{ value: '', label: 'Select Jurisdiction' }, ...options]);
      } catch (error) {
        console.error('Error fetching jurisdictions:', error);
      }
    };
    fetchJurisdictions();
  }, []);

  // Fetch elections data
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'election_type', label: 'Type', sortable: true },
    { key: 'jurisdiction', label: 'Jurisdiction', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'election_date', label: 'Election Date', sortable: true },
    { key: 'registration_deadline', label: 'Registration Deadline', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true }
  ];

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Build query parameters for the new v1 API
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('page_size', '50');
      
      // Add filters using the new v1 API filter format
      if (currentJurisdictionFilter) {
        params.append('filter[jurisdictionId]', currentJurisdictionFilter);
      }
      
      // Use the new v1 API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gov/elections?${params.toString()}`);
      const data = await response.json();
      
      if (data.data) {
        setElections(data.data);
      }
    } catch (error) {
      console.error('Error fetching elections:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, currentJurisdictionFilter]);

  const getStatusBadgeClass = (status: string) => {
    return themeClasses.badge[status as keyof typeof themeClasses.badge] || themeClasses.badge.default;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const renderCell = (item: any, column: { key: string; label: string }) => {
    switch (column.key) {
      case 'election_type':
        return (
          <span className="capitalize">
            {item.election_type?.replace('_', ' ') || 'N/A'}
          </span>
        );
      case 'jurisdiction':
        return item.jurisdiction?.name || 'N/A';
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(item.status)}`}>
            {item.status}
          </span>
        );
      case 'election_date':
        return formatDate(item.election_date);
      case 'registration_deadline':
        return formatDate(item.registration_deadline);
      case 'createdAt':
        return formatDate(item.createdAt);
      default:
        return item[column.key];
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral text-lg mb-4">🗳️</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Elections</h3>
        <p className="text-neutral mb-6">Loading elections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-neutral text-lg mb-4">🗳️</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Elections</h3>
        <p className="text-neutral mb-6">Browse and manage elections with candidates and results.</p>
      </div>

      {/* Info */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-primary">
          {elections.length === 0 
            ? 'No elections found for the selected jurisdiction.' 
            : `${elections.length} election${elections.length !== 1 ? 's' : ''} found.`
          }
        </p>
      </div>

      {/* Results */}
      {elections.length > 0 && (
        <div className="bg-surface rounded-lg border border-neutral-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-light">
              <thead className="bg-neutral-light">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-neutral-light">
                {elections.map((election) => (
                  <tr
                    key={election._id}
                    className="hover:bg-neutral-light cursor-pointer"
                    onClick={() => onElectionSelect?.(election)}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {renderCell(election, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coming Soon Notice */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
        <h4 className="text-lg font-semibold text-primary mb-2">Enhanced Election Management</h4>
        <p className="text-sm text-primary/80 mb-4">
          This feature will allow you to create, edit, and manage elections with full candidate management, 
          voting results, and election administration tools.
        </p>
        <div className="text-xs text-primary/60">
          <p>• Create and schedule elections</p>
          <p>• Manage candidate registrations</p>
          <p>• Track voting results and turnout</p>
          <p>• Generate election reports</p>
        </div>
      </div>
    </div>
  );
}
