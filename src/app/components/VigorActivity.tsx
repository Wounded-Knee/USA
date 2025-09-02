'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface VigorActivityProps {
  petitionId: string;
  onVigorContributed?: () => void;
}

interface VigorFormData {
  vigorType: 'steps' | 'calories' | 'duration' | 'custom';
  vigorAmount: number;
  activityData: {
    steps?: number;
    calories?: number;
    duration?: number;
    distance?: number;
    custom?: {
      label: string;
      value: number;
      unit: string;
    };
  };
  signingStatement: string;
}

const VigorActivity: React.FC<VigorActivityProps> = ({ petitionId, onVigorContributed }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<VigorFormData>({
    vigorType: 'steps',
    vigorAmount: 0,
    activityData: {},
    signingStatement: ''
  });

  const vigorTypes = [
    { value: 'steps', label: 'Steps', icon: '👟', description: 'Daily step count' },
    { value: 'calories', label: 'Calories', icon: '🔥', description: 'Calories burned' },
    { value: 'duration', label: 'Duration', icon: '⏱️', description: 'Time spent (minutes)' },
    { value: 'custom', label: 'Custom', icon: '⚡', description: 'Custom activity' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vigorType') {
      setFormData(prev => ({
        ...prev,
        vigorType: value as VigorFormData['vigorType'],
        vigorAmount: 0,
        activityData: {}
      }));
    } else if (name === 'vigorAmount') {
      setFormData(prev => ({
        ...prev,
        vigorAmount: parseInt(value) || 0
      }));
    } else if (name === 'signingStatement') {
      setFormData(prev => ({
        ...prev,
        signingStatement: value
      }));
    } else if (name.startsWith('activity_')) {
      const field = name.replace('activity_', '');
      setFormData(prev => ({
        ...prev,
        activityData: {
          ...prev.activityData,
          [field]: parseInt(value) || 0
        }
      }));
    }
  };

  const handleCustomActivityChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      activityData: {
        ...prev.activityData,
        custom: {
          ...prev.activityData.custom,
          [field]: value
        }
      }
    }));
  };

  const validateForm = (): boolean => {
    if (formData.vigorAmount <= 0) {
      setError('Please enter a valid vigor amount');
      return false;
    }

    if (formData.vigorType === 'custom' && (!formData.activityData.custom?.label || !formData.activityData.custom?.unit)) {
      setError('Please provide a label and unit for custom activity');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to contribute vigor');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use the new v1 API endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/obligations/${petitionId}/vigor`, {
        vigorType: formData.vigorType,
        vigorAmount: formData.vigorAmount,
        activityData: formData.activityData,
        signingStatement: formData.signingStatement
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.status === 201) {
        setSuccess('Vigor contribution successful!');
        setFormData({
          vigorType: 'steps',
          vigorAmount: 0,
          activityData: {},
          signingStatement: ''
        });
        setShowForm(false);
        
        // Notify parent component
        if (onVigorContributed) {
          onVigorContributed();
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error: any) {
      console.error('Failed to contribute vigor:', error);
      setError(error.response?.data?.detail || 'Failed to contribute vigor');
    } finally {
      setLoading(false);
    }
  };

  const getVigorTypeIcon = (type: string) => {
    const vigorType = vigorTypes.find(t => t.value === type);
    return vigorType?.icon || '⚡';
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-gray-400 text-4xl mb-4">⚡</div>
        <p className="text-gray-600 mb-4">Log in to contribute your energy to this petition</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Contribute Vigor</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <span className="mr-2">⚡</span>
          {showForm ? 'Cancel' : 'Contribute'}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Vigor Contribution Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vigor Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Activity Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {vigorTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, vigorType: type.value as VigorFormData['vigorType'] }))}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    formData.vigorType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Vigor Amount */}
          <div>
            <label htmlFor="vigorAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Vigor Amount
            </label>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getVigorTypeIcon(formData.vigorType)}</span>
              <input
                type="number"
                id="vigorAmount"
                name="vigorAmount"
                value={formData.vigorAmount}
                onChange={handleInputChange}
                min="1"
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${formData.vigorType} amount`}
              />
              <span className="text-sm text-gray-500">
                {formData.vigorType === 'steps' && 'steps'}
                {formData.vigorType === 'calories' && 'calories'}
                {formData.vigorType === 'duration' && 'minutes'}
                {formData.vigorType === 'custom' && 'units'}
              </span>
            </div>
          </div>

          {/* Activity Data Fields */}
          {formData.vigorType === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Label
                </label>
                <input
                  type="text"
                  value={formData.activityData.custom?.label || ''}
                  onChange={(e) => handleCustomActivityChange('label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Meditation, Reading"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  value={formData.activityData.custom?.value || ''}
                  onChange={(e) => handleCustomActivityChange('value', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.activityData.custom?.unit || ''}
                  onChange={(e) => handleCustomActivityChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="minutes, pages, etc."
                  required
                />
              </div>
            </div>
          )}

          {/* Signing Statement */}
          <div>
            <label htmlFor="signingStatement" className="block text-sm font-medium text-gray-700 mb-2">
              Signing Statement (Optional)
            </label>
            <textarea
              id="signingStatement"
              name="signingStatement"
              value={formData.signingStatement}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share why this petition matters to you..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.signingStatement.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Contributing...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">⚡</span>
                  Contribute Vigor
                </span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Info Section */}
      {!showForm && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">⚡</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to contribute your energy?</h4>
          <p className="text-gray-600 mb-4">
            Vigor represents your physical and mental energy invested in this petition. 
            Every contribution strengthens the collective voice for change.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
            <div>
              <div className="text-2xl mb-2">👟</div>
              <div className="font-medium">Steps</div>
              <div>Daily walking or exercise</div>
            </div>
            <div>
              <div className="text-2xl mb-2">🔥</div>
              <div className="font-medium">Calories</div>
              <div>Energy burned through activity</div>
            </div>
            <div>
              <div className="text-2xl mb-2">⏱️</div>
              <div className="font-medium">Time</div>
              <div>Minutes spent on activities</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VigorActivity;
