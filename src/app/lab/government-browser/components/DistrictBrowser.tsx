'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

interface DistrictBrowserProps {
  isAuthorized: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  breadcrumbs?: BreadcrumbItem[];
  onDistrictSelect?: (district: any) => void;
  currentJurisdictionFilter?: string | null;
}

const DISTRICT_TYPES = [
  'congressional', 'state_senate', 'state_house', 'county', 'city', 'school', 'special'
];

const DISTRICT_LEVELS = [
  'federal', 'state', 'county', 'city', 'local', 'special'
];

export default function DistrictBrowser({ 
  isAuthorized, 
  isLoading, 
  setIsLoading,
  breadcrumbs = [],
  onDistrictSelect,
  currentJurisdictionFilter
}: DistrictBrowserProps) {
  const { resolvedTheme } = useTheme();
  const [districts, setDistricts] = useState<any[]>([]);
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
      federal: resolvedTheme === 'dark' ? 'bg-blue-900/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      state: resolvedTheme === 'dark' ? 'bg-green-900/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-800 border-green-200',
      county: resolvedTheme === 'dark' ? 'bg-purple-900/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-800 border-purple-200',
      city: resolvedTheme === 'dark' ? 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/gov/jurisdictions?page_size=1000`);
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

  // Fetch districts data
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'district_type', label: 'Type', sortable: true },
    { key: 'level', label: 'Level', sortable: true },
    { key: 'jurisdiction', label: 'Jurisdiction', sortable: true },
    { key: 'district_number', label: 'Number', sortable: true },
    { key: 'population', label: 'Population', sortable: true },
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/gov/districts?${params.toString()}`);
      const data = await response.json();
      
      if (data.data) {
        setDistricts(data.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, currentJurisdictionFilter]);

  const getLevelBadgeClass = (level: string) => {
    return themeClasses.badge[level as keyof typeof themeClasses.badge] || themeClasses.badge.default;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPopulation = (population: number) => {
    if (!population) return 'N/A';
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`;
    }
    return population.toLocaleString();
  };

  const renderCell = (item: any, column: { key: string; label: string }) => {
    switch (column.key) {
      case 'district_type':
        return (
          <span className="capitalize">
            {item.district_type?.replace('_', ' ') || 'N/A'}
          </span>
        );
      case 'level':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelBadgeClass(item.level)}`}>
            {item.level?.charAt(0).toUpperCase() + item.level?.slice(1) || 'N/A'}
          </span>
        );
      case 'jurisdiction':
        return item.jurisdiction?.name || 'N/A';
      case 'population':
        return formatPopulation(item.population);
      case 'createdAt':
        return formatDate(item.createdAt);
      default:
        return item[column.key];
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral text-lg mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Districts</h3>
        <p className="text-neutral mb-6">Loading districts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-neutral text-lg mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Districts</h3>
        <p className="text-neutral mb-6">Browse and manage electoral and administrative districts.</p>
      </div>

      {/* Info */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-primary">
          {districts.length === 0 
            ? 'No districts found for the selected jurisdiction.' 
            : `${districts.length} district${districts.length !== 1 ? 's' : ''} found.`
          }
        </p>
      </div>

      {/* Results */}
      {districts.length > 0 && (
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
                {districts.map((district) => (
                  <tr
                    key={district._id}
                    className="hover:bg-neutral-light cursor-pointer"
                    onClick={() => onDistrictSelect?.(district)}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {renderCell(district, column)}
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
        <h4 className="text-lg font-semibold text-primary mb-2">Enhanced District Management</h4>
        <p className="text-sm text-primary/80 mb-4">
          This feature will allow you to create, edit, and manage districts with full boundary mapping, 
          demographic data, and electoral information tools.
        </p>
        <div className="text-xs text-primary/60">
          <p>• Create and manage district boundaries</p>
          <p>• Track demographic and population data</p>
          <p>• Manage electoral district assignments</p>
          <p>• Generate district reports and maps</p>
        </div>
      </div>
    </div>
  );
}
