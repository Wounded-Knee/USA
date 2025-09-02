'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface VigorContribution {
  id: string;
  vigorType: string;
  vigorAmount: number;
  activity: {
    steps?: number;
    calories?: number;
    duration?: number;
    distance?: number;
    workout?: any;
    meditation?: any;
    reading?: any;
    volunteering?: any;
  };
  signingStatement?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  createdAt: string;
}

interface VigorDisplayProps {
  petitionId: string;
  totalVigor: number;
  contributionCount: number;
  contributions: VigorContribution[];
}

export default function VigorDisplay({ petitionId, totalVigor, contributionCount, contributions }: VigorDisplayProps) {
  const { user } = useAuth();
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [vigorAmount, setVigorAmount] = useState(1);
  const [signingStatement, setSigningStatement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setVigorAmount(1);
      setSigningStatement('');
      setShowContributeForm(false);
      
      // In a real app, you'd update the local state or refetch data
    } catch (error) {
      console.error('Failed to contribute vigor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Vigor Contributions</h3>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Sign in to contribute your energy to this petition and see how others are supporting it.
          </p>
          <button className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors">
            Sign In to Contribute
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vigor Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-primary)]">{totalVigor.toLocaleString()}</div>
            <div className="text-sm text-[var(--color-text-muted)]">Total Vigor</div>
          </div>
        </div>
        
        <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-success)]">{contributionCount}</div>
            <div className="text-sm text-[var(--color-text-muted)]">Contributions</div>
          </div>
        </div>
        
        <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-accent)]">
              {contributionCount > 0 ? Math.round(totalVigor / contributionCount) : 0}
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">Avg per Contribution</div>
          </div>
        </div>
      </div>

      {/* Contribute Section */}
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Contribute Your Vigor</h3>
        
        {!showContributeForm ? (
          <button
            onClick={() => setShowContributeForm(true)}
            className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Contribute Vigor
          </button>
        ) : (
          <form onSubmit={handleContribute} className="space-y-4">
            <div>
              <label htmlFor="vigorAmount" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Vigor Amount (1-10)
              </label>
              <input
                type="number"
                id="vigorAmount"
                min="1"
                max="10"
                value={vigorAmount}
                onChange={(e) => setVigorAmount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent bg-[var(--color-surface)] text-[var(--color-text)]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="signingStatement" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Signing Statement (Optional)
              </label>
              <textarea
                id="signingStatement"
                value={signingStatement}
                onChange={(e) => setSigningStatement(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent bg-[var(--color-surface)] text-[var(--color-text)]"
                placeholder="Share why you're supporting this petition..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-md hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Contributing...' : 'Contribute'}
              </button>
              <button
                type="button"
                onClick={() => setShowContributeForm(false)}
                className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-md hover:bg-[var(--color-background)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recent Contributions */}
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Recent Contributions</h3>
        
        {contributions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-[var(--color-text-muted)] text-6xl mb-4">⚡</div>
            <p className="text-[var(--color-text-secondary)] mb-2">No vigor contributions yet</p>
            <p className="text-sm text-[var(--color-text-muted)]">Be the first to contribute your energy to this petition!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((contribution) => (
              <div key={contribution.id} className="flex items-start space-x-4 p-4 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
                <div className="h-10 w-10 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center">
                  <span className="text-[var(--color-primary)] font-semibold text-sm">
                    {contribution.user.firstName.charAt(0)}{contribution.user.lastName.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {contribution.user.firstName} {contribution.user.lastName}
                    </span>
                    <span className="text-sm text-[var(--color-text-muted)]">@{contribution.user.username}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Contributed {contribution.vigorAmount} vigor
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">{formatDate(contribution.createdAt)}</span>
                  </div>
                  
                  {contribution.signingStatement && (
                    <div className="mt-2 p-3 bg-[var(--color-surface)] rounded border border-[var(--color-border)]">
                      <p className="text-sm text-[var(--color-text-secondary)] italic">"{contribution.signingStatement}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vigor Explanation */}
      <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">What is Vigor?</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          Vigor represents the energy and commitment you're willing to invest in a petition. 
          Higher vigor means stronger support and can help petitions gain momentum.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          You can contribute 1-10 vigor points per petition, with each point representing 
          increasing levels of personal investment and advocacy.
        </p>
      </div>
    </div>
  );
}
