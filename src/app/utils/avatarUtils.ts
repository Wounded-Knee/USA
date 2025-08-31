/**
 * Generate a default avatar URL using DiceBear API
 * @param name - User's full name or initials
 * @param size - Size of the avatar (default: 200)
 * @returns URL to the generated avatar
 */
export function generateAvatarUrl(name: string, size: number = 200): string {
  const encodedName = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&size=${size}`;
}

/**
 * Get avatar URL for a user
 * @param user - User object with avatar and name properties
 * @param size - Size of the avatar (default: 200)
 * @returns URL to the user's avatar or a generated one
 */
export function getUserAvatarUrl(user: { avatar?: string; firstName: string; lastName: string }, size: number = 200): string {
  if (user.avatar) {
    return user.avatar;
  }
  
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  return generateAvatarUrl(initials, size);
}

/**
 * Get user initials
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns User's initials in uppercase
 */
export function getUserInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
