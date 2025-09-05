// Role-based access control utilities

export type UserRole = 'Developer' | 'Admin' | 'Moderator' | 'User';

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  avatar?: string;
  authMethod: 'local' | 'google';
  emailVerified: boolean;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

// Check if user has a specific role
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

// Check if user has any of the specified roles
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.some(role => roles.includes(role));
};

// Check if user has all of the specified roles
export const hasAllRoles = (user: User | null, roles: UserRole[]): boolean => {
  if (!user || !user.roles) return false;
  return roles.every(role => user.roles.includes(role));
};

// Get the highest priority role (Developer > Admin > Moderator > User)
export const getHighestRole = (user: User | null): UserRole | null => {
  if (!user || !user.roles || user.roles.length === 0) return null;
  
  const rolePriority: Record<UserRole, number> = {
    'Developer': 4,
    'Admin': 3,
    'Moderator': 2,
    'User': 1
  };

  return user.roles.reduce((highest, current) => {
    return rolePriority[current] > rolePriority[highest] ? current : highest;
  });
};

// Check if user has admin or developer privileges
export const isAdmin = (user: User | null): boolean => {
  return hasAnyRole(user, ['Developer', 'Admin']);
};

// Check if user has developer privileges
export const isDeveloper = (user: User | null): boolean => {
  return hasRole(user, 'Developer');
};

// Check if user has moderator or higher privileges
export const isModerator = (user: User | null): boolean => {
  return hasAnyRole(user, ['Developer', 'Admin', 'Moderator']);
};

// Get role display name with proper formatting
export const getRoleDisplayName = (role: UserRole): string => {
  return role;
};

// Get role color for UI display
export const getRoleColor = (role: UserRole): string => {
  const colors = {
    'Developer': 'text-purple-600 bg-purple-100',
    'Admin': 'text-red-600 bg-red-100',
    'Moderator': 'text-orange-600 bg-orange-100',
    'User': 'text-gray-600 bg-gray-100'
  };
  return colors[role] || colors['User'];
};

// Get role badge styling
export const getRoleBadgeClass = (role: UserRole): string => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const colorClasses = getRoleColor(role);
  return `${baseClasses} ${colorClasses}`;
};
