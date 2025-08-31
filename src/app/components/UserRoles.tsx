'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  hasRole, 
  hasAnyRole, 
  isAdmin, 
  getRoleBadgeClass, 
  getRoleDisplayName,
  type UserRole 
} from '../utils/roleUtils';
import axios from 'axios';

interface UserRolesProps {
  userId?: string;
  roles?: UserRole[];
  showManage?: boolean;
  onRolesUpdate?: (roles: UserRole[]) => void;
}

const UserRoles: React.FC<UserRolesProps> = ({ 
  userId, 
  roles = [], 
  showManage = false,
  onRolesUpdate 
}) => {
  const { user: currentUser } = useAuth();
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    if (showManage && isAdmin(currentUser)) {
      fetchAvailableRoles();
    }
  }, [showManage, currentUser]);

  const fetchAvailableRoles = async () => {
    try {
      const response = await api.get('/roles/available');
      setAvailableRoles(response.data.roles);
    } catch (error) {
      console.error('Failed to fetch available roles:', error);
    }
  };

  const assignRole = async (role: UserRole) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/roles/assign', { userId, role });
      if (onRolesUpdate) {
        onRolesUpdate(response.data.user.roles);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to assign role');
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (role: UserRole) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete('/roles/remove', { 
        data: { userId, role } 
      });
      if (onRolesUpdate) {
        onRolesUpdate(response.data.user.roles);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to remove role');
    } finally {
      setLoading(false);
    }
  };

  const canManageRoles = showManage && isAdmin(currentUser) && userId !== currentUser?._id;

  if (roles.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No roles assigned
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <div key={role} className="flex items-center gap-1">
            <span className={getRoleBadgeClass(role)}>
              {getRoleDisplayName(role)}
            </span>
            {canManageRoles && (
              <button
                onClick={() => removeRole(role)}
                disabled={loading}
                className="text-red-500 hover:text-red-700 text-xs ml-1"
                title={`Remove ${role} role`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {canManageRoles && (
        <div className="mt-3">
          <div className="text-sm text-gray-600 mb-2">Add role:</div>
          <div className="flex flex-wrap gap-1">
            {availableRoles
              .filter(role => !roles.includes(role))
              .map((role) => (
                <button
                  key={role}
                  onClick={() => assignRole(role)}
                  disabled={loading}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                >
                  + {getRoleDisplayName(role)}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoles;
