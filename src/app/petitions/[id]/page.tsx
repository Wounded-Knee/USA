'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import VigorDisplay from '../../components/VigorDisplay';
import VigorActivity from '../../components/VigorActivity';
import Link from 'next/link';

interface Petition {
  _id: string;
  title: string;
  description: string;
  category: string;
  creator: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  voteCount: number;
  totalVigor: number;
  targetVotes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  jurisdiction: {
    _id: string;
    name: string;
    level: string;
    slug: string;
  };
  governingBody?: {
    _id: string;
    name: string;
    branch: string;
    slug: string;
  };
  legislation?: {
    _id: string;
    title: string;
    bill_number: string;
    status: string;
  };
}

interface PetitionStats {
  totalVotes: number;
  totalVigor: number;
  votesThisWeek: number;
  vigorThisWeek: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
}

interface OfficePosition {
  _id: string;
  title: string;
  person?: {
    _id: string;
    firstName: string;
    lastName: string;
    bio?: string;
  };
  isCurrent: boolean;
  startDate?: string;
  endDate?: string;
}

interface AssociatedPetition {
  _id: string;
  title: string;
  voteCount: number;
  category: string;
}

interface MediaItem {
  _id: string;
  filename: string;
  url: string;
  mediaType: string;
  description?: string;
  isPrimary: boolean;
}

const PetitionDetailPage: React.FC = () => {
  const params = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  
  const [petition, setPetition] = useState<Petition | null>(null);
  const [stats, setStats] = useState<PetitionStats | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [currentVoteId, setCurrentVoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOffice, setLoadingOffice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [showVigorForm, setShowVigorForm] = useState(false);
  
  const [officePosition, setOfficePosition] = useState<OfficePosition | null>(null);
  const [associatedPetitions, setAssociatedPetitions] = useState<AssociatedPetition[]>([]);
  const [officeMedia, setOfficeMedia] = useState<MediaItem[]>([]);
  const [personMedia, setPersonMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchPetition();
      fetchPetitionStats();
    }
  }, [params.id]);

  useEffect(() => {
    if (petition) {
      fetchOfficeInformation();
    }
  }, [petition]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      checkVoteStatus();
    }
  }, [isAuthenticated, currentUser, params.id]);

  const checkVoteStatus = async () => {
    if (!currentUser) return;
    
    try {
      // Use the new v1 API endpoint with proper filtering
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/votes?filter[petitionId]=${params.id}&filter[userId]=${currentUser.id}`);
      
      if (response.data.data && response.data.data.length > 0) {
        setHasVoted(true);
        setCurrentVoteId(response.data.data[0]._id);
      }
    } catch (err) {
      console.error('Error checking vote status:', err);
    }
  };

  const fetchPetition = async () => {
    try {
      setLoading(true);
      // Use the new v1 obligations API endpoint
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/obligations/${params.id}`);
      setPetition(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching petition:', err);
      setError('Failed to load petition');
    } finally {
      setLoading(false);
    }
  };

  const fetchPetitionStats = async () => {
    try {
      // Use the new v1 analytics endpoint for petition statistics
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/analytics/petitions/${params.id}`);
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching petition stats:', err);
    }
  };

  const fetchOfficeInformation = async () => {
    if (!petition?.governingBody?._id) return;
    
    try {
      setLoadingOffice(true);
      
      // Use the new v1 gov API endpoints
      const officeResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/gov/offices?filter[governingBodyId]=${petition.governingBody._id}`);
      
      if (officeResponse.data.data && officeResponse.data.data.length > 0) {
        const office = officeResponse.data.data[0];
        
        // Get the current position for this office
        const positionResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/gov/positions?filter[officeId]=${office._id}&filter[isCurrent]=true`);
        
        if (positionResponse.data.data && positionResponse.data.data.length > 0) {
          setOfficePosition(positionResponse.data.data[0]);
        }
        
        // Get associated petitions for this office using the new v1 obligations API
        const petitionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/obligations?type=petition&filter[officeId]=${office._id}&page=1&page_size=5`);
        setAssociatedPetitions(petitionsResponse.data.obligations || []);
        
        // Fetch office media using the new v1 unified media endpoint
        const officeMediaResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/media?filter[entityType]=office&filter[entityId]=${office._id}&filter[mediaType]=seal`);
        setOfficeMedia(officeMediaResponse.data.data || []);
        
        // Fetch person media if position exists
        if (positionResponse.data.data && positionResponse.data.data.length > 0) {
          const position = positionResponse.data.data[0];
          if (position.person?._id) {
            const personMediaResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/media?filter[entityType]=position&filter[entityId]=${position._id}&filter[mediaType]=headshot`);
            setPersonMedia(personMediaResponse.data.data || []);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching office information:', err);
    } finally {
      setLoadingOffice(false);
    }
  };

  const handleVote = async () => {
    if (!currentUser) {
      setVoteError('Please log in to vote');
      return;
    }

    try {
      setVoteError(null);
      
      // Use the new v1 obligations API endpoint for creating votes
      const voteResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/obligations/${params.id}/votes`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (voteResponse.status === 201) {
        setCurrentVoteId(voteResponse.data.data._id);
        setHasVoted(true);
        // Refresh petition data to update vote count
        await fetchPetition();
        await fetchPetitionStats();
      }
    } catch (err: any) {
      console.error('Error creating vote:', err);
      if (err.response?.status === 409) {
        setVoteError('You have already voted on this petition');
        setHasVoted(true);
      } else {
        setVoteError(err.response?.data?.detail || 'Failed to create vote');
      }
    }
  };

  const handleVigorUpdate = () => {
    setShowVigorForm(false);
    // Refresh vigor data
    if (petition) {
      // This will trigger a re-render of VigorDisplay component
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !petition) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Petition</h1>
            <p className="text-gray-600 mb-6">{error || 'Petition not found'}</p>
            <Link
              href="/petitions"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Petitions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/petitions" className="hover:text-gray-700">
                Petitions
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium">{petition.title}</li>
          </ol>
        </nav>

        {/* Petition Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {petition.category}
                </span>
                <span className="text-sm text-gray-500">
                  {petition.jurisdiction.name} ({petition.jurisdiction.level})
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{petition.title}</h1>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {petition.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                <span>By {petition.creator.firstName} {petition.creator.lastName}</span>
                <span>{new Date(petition.createdAt).toLocaleDateString()}</span>
                <span>{petition.voteCount} votes</span>
                <span>{petition.totalVigor} vigor</span>
              </div>
            </div>
            
            {/* Vote Button */}
            <div className="ml-6 flex-shrink-0">
              {!hasVoted ? (
                <button
                  onClick={handleVote}
                  disabled={!isAuthenticated}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {!isAuthenticated ? 'Log In to Vote' : 'Vote'}
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-green-600 text-2xl mb-2">✓</div>
                  <span className="text-sm text-green-600 font-medium">Voted</span>
                </div>
              )}
            </div>
          </div>

          {/* Vote Error */}
          {voteError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{voteError}</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{petition.voteCount} / {petition.targetVotes}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((petition.voteCount / petition.targetVotes) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((petition.voteCount / petition.targetVotes) * 100)}% complete
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Petition Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Government Information */}
            {petition.governingBody && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Government Information</h3>
                
                <div className="space-y-6">
                  {/* Jurisdiction Information */}
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Jurisdiction</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p className="text-gray-700 font-medium">{petition.jurisdiction.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Level:</span>
                        <p className="text-gray-700 font-medium capitalize">{petition.jurisdiction.level}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm text-gray-500">Slug:</span>
                        <p className="text-gray-700 font-mono text-sm">{petition.jurisdiction.slug}</p>
                      </div>
                    </div>
                  </div>

                  {/* Governing Body Information */}
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Governing Body</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p className="text-gray-700 font-medium">{petition.governingBody.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Slug:</span>
                        <p className="text-gray-700 font-mono text-sm">{petition.governingBody.slug}</p>
                      </div>
                      {petition.governingBody.branch && (
                        <div>
                          <span className="text-sm text-gray-500">Branch:</span>
                          <p className="text-gray-700 font-medium capitalize">{petition.governingBody.branch}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Office and Position Information */}
                  {loadingOffice ? (
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Office Information</h4>
                      <div className="animate-pulse space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
                        ))}
                      </div>
                    </div>
                  ) : officePosition ? (
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Current Office</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Position:</span>
                          <p className="text-gray-700 font-medium">{officePosition.title}</p>
                        </div>
                        {officePosition.person && (
                          <div>
                            <span className="text-sm text-gray-500">Current Holder:</span>
                            <p className="text-gray-700 font-medium">
                              {officePosition.person.firstName} {officePosition.person.lastName}
                            </p>
                          </div>
                        )}
                        {officePosition.startDate && (
                          <div>
                            <span className="text-sm text-gray-500">Start Date:</span>
                            <p className="text-gray-700">{new Date(officePosition.startDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Office Information</h4>
                      <p className="text-gray-500 text-sm">No office information available for this governing body.</p>
                    </div>
                  )}

                  {/* Legislation Information */}
                  {petition.legislation ? (
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Related Legislation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Bill Number:</span>
                          <p className="text-gray-700 font-medium">{petition.legislation.bill_number}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            petition.legislation.status === 'active' ? 'bg-green-100 text-green-800' :
                            petition.legislation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {petition.legislation.status}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-sm text-gray-500">Title:</span>
                          <p className="text-gray-700">{petition.legislation.title}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Related Legislation</h4>
                      <p className="text-gray-500 text-sm">No legislation is currently associated with this petition.</p>
                    </div>
                  )}

                  {/* Media Display */}
                  {(officeMedia.length > 0 || personMedia.length > 0) && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Official Media</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {officeMedia.map((media) => (
                          <div key={media._id} className="text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                              <span className="text-xs text-gray-500">{media.mediaType}</span>
                            </div>
                            <p className="text-xs text-gray-600">{media.description || 'Official Seal'}</p>
                          </div>
                        ))}
                        {personMedia.map((media) => (
                          <div key={media._id} className="text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                              <span className="text-xs text-gray-500">{media.mediaType}</span>
                            </div>
                            <p className="text-xs text-gray-600">{media.description || 'Official Photo'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Government Context */}
                  <div className="pt-2">
                    <h4 className="font-medium text-gray-900 mb-2">Government Context</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-800">
                            This petition is addressed to <strong>{petition.governingBody?.name || 'the governing body'}</strong> 
                            within <strong>{petition.jurisdiction.name}</strong> ({petition.jurisdiction.level} level). 
                            The petition requires {petition.targetVotes.toLocaleString()} votes to reach its target.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Associated Petitions */}
            {associatedPetitions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Petitions</h3>
                <div className="space-y-3">
                  {associatedPetitions.map((relatedPetition) => (
                    <Link
                      key={relatedPetition._id}
                      href={`/petitions/${relatedPetition._id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{relatedPetition.title}</h4>
                          <p className="text-sm text-gray-500">{relatedPetition.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{relatedPetition.voteCount} votes</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Vigor and Stats */}
          <div className="space-y-8">
            {/* Vigor Display */}
            <VigorDisplay 
              petitionId={params.id as string} 
              totalVigor={petition.totalVigor}
              contributionCount={petition.voteCount}
              contributions={[]}
            />
            
            {/* Vigor Activity */}
            <VigorActivity petitionId={params.id as string} onVigorContributed={handleVigorUpdate} />
            
            {/* Petition Statistics */}
            {stats && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Votes</span>
                    <span className="font-medium">{stats.totalVotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Vigor</span>
                    <span className="font-medium">{stats.totalVigor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Votes This Week</span>
                    <span className="font-medium">{stats.votesThisWeek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vigor This Week</span>
                    <span className="font-medium">{stats.vigorThisWeek}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetitionDetailPage;
