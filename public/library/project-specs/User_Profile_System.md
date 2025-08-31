# User Profile System

## Overview
The User Profile System provides a comprehensive user management interface with avatars, voting history, and capital tracking. Users can view their profile, edit their information, and see their activity across all petitions.

## Features

### User Avatar Component
- **Location**: `src/app/components/UserAvatar.tsx`
- **Features**:
  - Displays user avatar or generated initials-based avatar
  - Dropdown menu with profile actions
  - Multiple size options (sm, md, lg)
  - Automatic fallback to DiceBear API for avatar generation

### Profile Pages
- **Main Profile**: `src/app/profile/page.tsx`
- **Edit Profile**: `src/app/profile/edit/page.tsx`

### Key Features
1. **Avatar System**
   - Custom avatar upload support
   - Automatic fallback to generated avatars using DiceBear API
   - Avatar utility functions in `src/app/utils/avatarUtils.ts`

2. **User Statistics**
   - Total votes cast
   - Total vigor contributed
   - Average vigor per vote
   - Number of petitions supported
   - Total capital earned

3. **Voting History**
   - Complete list of petitions voted on
   - Vigor and capital contributions per petition
   - Signing statements
   - Vote timestamps

4. **Profile Management**
   - Edit personal information
   - Update avatar
   - Change username and email
   - Real-time validation

## Backend API Endpoints

### User Routes (`server/routes/users.js`)
- `GET /api/users/:id/votes` - Get user's voting history with petition details
- `GET /api/users/:id/stats` - Get user statistics (votes, vigor, capital)
- `PUT /api/users/:id` - Update user profile (protected route)

### Models
- **User Model** (`server/models/User.js`)
  - Added `totalCapital` field for tracking overall capital
  - Avatar field for custom profile pictures

- **Capital Model** (`server/models/Capital.js`)
  - Tracks capital earned/spent on individual petitions
  - Supports different capital types (earned, spent, bonus)
  - Links to votes and petitions

## Navigation Integration

### UserAvatar in Navigation
- Replaces "Join the Tree" button when user is logged in
- Dropdown menu with:
  - View Profile
  - Edit Profile
  - Sign Out

### Authentication Dialog
- "Join the Tree" button opens registration dialog
- Seamless integration with existing auth system

## Technical Implementation

### Frontend Components
- **UserAvatar**: Reusable avatar component with dropdown
- **ProfilePage**: Main profile view with stats and voting history
- **EditProfilePage**: Profile editing interface
- **AvatarUtils**: Utility functions for avatar generation

### Backend Features
- **Protected Routes**: All profile endpoints require authentication
- **Data Aggregation**: Efficient calculation of user statistics
- **Capital Tracking**: Comprehensive capital management system
- **Error Handling**: Proper error responses and validation

### Database Design
- **User Model**: Enhanced with capital tracking
- **Capital Model**: New model for petition-specific capital
- **Indexes**: Optimized queries for user data retrieval

## Usage Examples

### Basic Avatar Usage
```tsx
import UserAvatar from '../components/UserAvatar'

// In navigation
<UserAvatar size="md" />

// In profile
<UserAvatar size="lg" showDropdown={false} />
```

### Profile Navigation
```tsx
// Navigate to profile
<Link href="/profile">View Profile</Link>

// Navigate to edit profile
<Link href="/profile/edit">Edit Profile</Link>
```

## Future Enhancements

1. **Avatar Upload**: Implement actual file upload to cloud storage
2. **Capital Spending**: Add ability to spend capital on petition features
3. **Achievement System**: Badges and achievements based on activity
4. **Social Features**: Follow other users, share profiles
5. **Activity Feed**: Real-time updates of user activity

## Security Considerations

- All profile endpoints require authentication
- Users can only access their own data
- Input validation on all profile updates
- Secure file upload handling (when implemented)
- Rate limiting on profile updates

## Performance Optimizations

- Efficient database queries with proper indexing
- Lazy loading of voting history
- Cached avatar generation
- Optimized image loading with Next.js Image component
