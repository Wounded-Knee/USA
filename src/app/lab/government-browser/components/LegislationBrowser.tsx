'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

interface LegislationBrowserProps {
  isAuthorized: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  breadcrumbs?: BreadcrumbItem[];
  onLegislationSelect?: (legislation: any) => void;
  currentGoverningBodyFilter?: string | null;
}

const STATUS_OPTIONS = [
  'introduced', 'in_committee', 'passed_committee', 'passed_chamber', 'passed_other_chamber',
  'conference', 'enacted', 'vetoed', 'failed', 'withdrawn'
];

const BILL_TYPES = [
  'bill', 'resolution', 'joint_resolution', 'concurrent_resolution', 'memorial', 'proclamation'
];

export default function LegislationBrowser({ 
  isAuthorized, 
  isLoading, 
  setIsLoading,
  breadcrumbs = [],
  onLegislationSelect,
  currentGoverningBodyFilter
}: LegislationBrowserProps) {
  const { resolvedTheme } = useTheme();
  const [legislation, setLegislation] = useState<any[]>([]);
  const [governingBodyOptions, setGoverningBodyOptions] = useState<{ value: string; label: string }[]>([]);

  // Theme-aware class names
  const themeClasses = {
    text: resolvedTheme === 'dark' ? 'text-foreground' : 'text-foreground',
    textSecondary: resolvedTheme === 'dark' ? 'text-neutral-light' : 'text-neutral-dark',
    textMuted: resolvedTheme === 'dark' ? 'text-neutral' : 'text-neutral',
    link: resolvedTheme === 'dark' 
      ? 'text-primary-light hover:text-primary focus:ring-primary-light' 
      : 'text-primary hover:text-primary-dark focus:ring-primary',
    badge: {
      introduced: resolvedTheme === 'dark' ? 'bg-blue-900/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      in_committee: resolvedTheme === 'dark' ? 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      passed_committee: resolvedTheme === 'dark' ? 'bg-green-900/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-800 border-green-200',
      enacted: resolvedTheme === 'dark' ? 'bg-purple-900/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-800 border-purple-200',
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

  // Fetch governing bodies for dropdown
  useEffect(() => {
    const fetchGoverningBodies = async () => {
      try {
        // Use the new v1 API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/gov/governing-bodies?page_size=1000`);
        const data = await response.json();
        const options = data.data?.map((governingBody: any) => ({
          value: governingBody._id,
          label: governingBody.name
        })) || [];
        setGoverningBodyOptions([{ value: '', label: 'Select Governing Body' }, ...options]);
      } catch (error) {
        console.error('Error fetching governing bodies:', error);
      }
    };
    fetchGoverningBodies();
  }, []);

  // Fetch legislation data
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { key: 'bill_number', label: 'Bill Number', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'bill_type', label: 'Type', sortable: true },
    { key: 'governingBody', label: 'Governing Body', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'introduced_date', label: 'Introduced', sortable: true },
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
      if (currentGoverningBodyFilter) {
        params.append('filter[governingBodyId]', currentGoverningBodyFilter);
      }
      
      // Use the new v1 API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/gov/legislation?${params.toString()}`);
      const data = await response.json();
      
      if (data.data) {
        setLegislation(data.data);
      }
    } catch (error) {
      console.error('Error fetching legislation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, currentGoverningBodyFilter]);

  const getStatusBadgeClass = (status: string) => {
    return themeClasses.badge[status as keyof typeof themeClasses.badge] || themeClasses.badge.default;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const renderCell = (item: any, column: { key: string; label: string }) => {
    switch (column.key) {
      case 'bill_type':
        return (
          <span className="capitalize">
            {item.bill_type?.replace('_', ' ') || 'N/A'}
          </span>
        );
      case 'governingBody':
        return item.governingBody?.name || 'N/A';
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(item.status)}`}>
            {item.status?.replace('_', ' ') || 'N/A'}
          </span>
        );
      case 'introduced_date':
        return formatDate(item.introduced_date);
      case 'createdAt':
        return formatDate(item.createdAt);
      default:
        return item[column.key];
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral text-lg mb-4">📜</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Legislation</h3>
        <p className="text-neutral mb-6">Loading legislation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-neutral text-lg mb-4">📜</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Legislation</h3>
        <p className="text-neutral mb-6">Browse and manage bills, resolutions, and legislative actions.</p>
      </div>

      {/* Info */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-primary">
          {legislation.length === 0 
            ? 'No legislation found for the selected governing body.' 
            : `${legislation.length} bill${legislation.length !== 1 ? 's' : ''} found.`
          }
        </p>
      </div>

      {/* Results */}
      {legislation.length > 0 && (
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
                {legislation.map((bill) => (
                  <tr
                    key={bill._id}
                    className="hover:bg-neutral-light cursor-pointer"
                    onClick={() => onLegislationSelect?.(bill)}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {renderCell(bill, column)}
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
        <h4 className="text-lg font-semibold text-primary mb-2">Enhanced Legislation Management</h4>
        <p className="text-sm text-primary/80 mb-4">
          This feature will allow you to create, edit, and manage legislation with full bill tracking, 
          amendment management, and legislative workflow tools.
        </p>
        <div className="text-xs text-primary/60">
          <p>• Create and track bills and resolutions</p>
          <p>• Manage bill amendments and versions</p>
          <p>• Track legislative workflow and status</p>
          <p>• Generate legislative reports</p>
        </div>
      </div>
    </div>
  );
}
