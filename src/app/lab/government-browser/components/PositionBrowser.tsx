'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

interface PositionBrowserProps {
  isAuthorized: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  breadcrumbs?: BreadcrumbItem[];
  onPositionSelect?: (position: any) => void;
  currentOfficeFilter?: string | null;
}

const STATUS_OPTIONS = [
  'current', 'former', 'elected', 'appointed', 'acting', 'interim', 'vacant'
];

const PARTY_OPTIONS = [
  'democratic', 'republican', 'independent', 'green', 'libertarian', 'other'
];

export default function PositionBrowser({ 
  isAuthorized, 
  isLoading, 
  setIsLoading,
  breadcrumbs = [],
  onPositionSelect,
  currentOfficeFilter
}: PositionBrowserProps) {
  const { resolvedTheme } = useTheme();
  const [positions, setPositions] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<{ value: string; label: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  // Theme-aware class names
  const themeClasses = {
    text: resolvedTheme === 'dark' ? 'text-foreground' : 'text-foreground',
    textSecondary: resolvedTheme === 'dark' ? 'text-neutral-light' : 'text-neutral-dark',
    textMuted: resolvedTheme === 'dark' ? 'text-neutral' : 'text-neutral',
    link: resolvedTheme === 'dark' 
      ? 'text-primary-light hover:text-primary focus:ring-primary-light' 
      : 'text-primary hover:text-primary-dark focus:ring-primary',
    badge: {
      current: resolvedTheme === 'dark' ? 'bg-green-900/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-800 border-green-200',
      former: resolvedTheme === 'dark' ? 'bg-gray-900/20 text-gray-300 border-gray-500/30' : 'bg-gray-100 text-gray-800 border-gray-200',
      elected: resolvedTheme === 'dark' ? 'bg-blue-900/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      appointed: resolvedTheme === 'dark' ? 'bg-purple-900/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-800 border-purple-200',
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

  // Fetch offices for dropdown
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        // Use the new v1 API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gov/offices?page_size=1000`);
        const data = await response.json();
        const options = data.data?.map((office: any) => ({
          value: office._id,
          label: office.name
        })) || [];
        setOfficeOptions([{ value: '', label: 'Select Office' }, ...options]);
      } catch (error) {
        console.error('Error fetching offices:', error);
      }
    };
    fetchOffices();
  }, []);

  // Fetch positions data
  useEffect(() => {
    fetchData();
  }, [activeFilters]);

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'person', label: 'Person', sortable: true },
    { key: 'office', label: 'Office', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'party', label: 'Party', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
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
      if (activeFilters.status) {
        params.append('filter[status]', activeFilters.status);
      }
      if (activeFilters.party) {
        params.append('filter[party]', activeFilters.party);
      }
      if (activeFilters.officeId) {
        params.append('filter[officeId]', activeFilters.officeId);
      }
      if (activeFilters.isCurrent) {
        params.append('filter[isCurrent]', activeFilters.isCurrent.toString());
      }
      if (searchTerm) {
        params.append('filter[title]', searchTerm);
      }
      
      // Use the new v1 API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gov/positions?${params.toString()}`);
      const data = await response.json();
      
      if (data.data) {
        setPositions(data.data);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, activeFilters, searchTerm]);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusBadgeClass = (status: string) => {
    return themeClasses.badge[status as keyof typeof themeClasses.badge] || themeClasses.badge.default;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const renderCell = (item: any, column: { key: string; label: string }) => {
    switch (column.key) {
      case 'person':
        return item.person ? `${item.person.firstName} ${item.person.lastName}` : 'Vacant';
      case 'office':
        return item.office?.name || 'N/A';
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(item.status)}`}>
            {item.status}
          </span>
        );
      case 'startDate':
        return formatDate(item.startDate);
      case 'endDate':
        return formatDate(item.endDate);
      case 'createdAt':
        return formatDate(item.createdAt);
      default:
        return item[column.key];
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral text-lg mb-4">👤</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Positions</h3>
        <p className="text-neutral mb-6">Loading positions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-neutral text-lg mb-4">👤</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Positions</h3>
        <p className="text-neutral mb-6">Browse and manage person assignments to offices with terms.</p>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-lg border border-neutral-light p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search positions..."
              className="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              value={activeFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Party</label>
            <select
              value={activeFilters.party || ''}
              onChange={(e) => handleFilterChange('party', e.target.value)}
              className="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Parties</option>
              {PARTY_OPTIONS.map(party => (
                <option key={party} value={party}>
                  {party.charAt(0).toUpperCase() + party.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Office</label>
            <select
              value={activeFilters.officeId || ''}
              onChange={(e) => handleFilterChange('officeId', e.target.value)}
              className="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Offices</option>
              {officeOptions.map(office => (
                <option key={office.value} value={office.value}>
                  {office.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
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
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-neutral">
                    No positions found
                  </td>
                </tr>
              ) : (
                positions.map((position, index) => (
                  <tr
                    key={position._id}
                    className="hover:bg-neutral-light cursor-pointer"
                    onClick={() => onPositionSelect?.(position)}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {renderCell(position, column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="text-center text-sm text-neutral">
        {positions.length} position{positions.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
