# USA Full-Stack Application - API Documentation

## Overview
This document provides comprehensive documentation for the USA Full-Stack Application backend API. The API is built with Express.js and provides endpoints for user management, petitions, voting, government data, and more.

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-production-domain.com/api`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow a consistent JSON format:
```json
{
  "message": "Success message",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Error Responses
Error responses include an error message and appropriate HTTP status code:
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "authMethod": "local",
    "createdAt": "date"
  },
  "token": "jwt-token"
}
```

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "identifier": "string", // username or email
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "lastLogin": "date"
  },
  "token": "jwt-token"
}
```

### GET /api/auth/google
Initiate Google OAuth authentication (if configured).

**Response:** Redirects to Google OAuth

### GET /api/auth/google/callback
Google OAuth callback endpoint.

**Response:** Redirects to frontend with token

### GET /api/auth/me
Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "roles": ["string"],
  "isActive": true,
  "createdAt": "date"
}
```

### POST /api/auth/logout
Logout user (client-side token removal).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### POST /api/auth/refresh
Refresh JWT token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "token": "new-jwt-token",
  "user": { ... }
}
```

---

## User Management Endpoints

### GET /api/users
Get all users with optional filtering.

**Query Parameters:**
- `username` (string): Filter by username
- `email` (string): Filter by email
- `limit` (number): Number of results (default: 50)
- `skip` (number): Number of results to skip (default: 0)

**Response:**
```json
{
  "users": [
    {
      "_id": "string",
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "isActive": true,
      "createdAt": "date"
    }
  ],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

### GET /api/users/:id
Get user by ID.

**Response:**
```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "roles": ["string"],
  "isActive": true,
  "createdAt": "date"
}
```

### PUT /api/users/:id
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "bio": "string",
  "location": "string",
  "website": "string"
}
```

### POST /api/users/:id/avatar
Upload user avatar.

**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `avatar`: Image file (max 5MB)

### POST /api/users/:id/banner
Upload user banner.

**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `banner`: Image file (max 10MB)

### DELETE /api/users/:id
Deactivate user account.

**Headers:** `Authorization: Bearer <token>`

---

## Role Management Endpoints

### GET /api/roles/available
Get all available roles (Admin/Developer only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "roles": ["Developer", "Admin", "Moderator", "User"]
}
```

### GET /api/roles/users
Get all users with their roles (Admin/Developer only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "roles": ["string"],
    "isActive": true,
    "createdAt": "date"
  }
]
```

### POST /api/roles/assign
Assign role to user (Admin/Developer only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "string",
  "role": "string"
}
```

### DELETE /api/roles/remove
Remove role from user (Admin/Developer only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "string",
  "role": "string"
}
```

### PUT /api/roles/update/:userId
Update user roles (Admin/Developer only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "roles": ["string"]
}
```

### GET /api/roles/my-roles
Get current user's roles.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "roles": ["string"]
}
```

---

## Petition Endpoints

### GET /api/petitions/jurisdictions
Get available jurisdictions for petition creation.

**Query Parameters:**
- `level` (string): Jurisdiction level
- `parent` (string): Parent jurisdiction ID

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "slug": "string",
    "level": "string",
    "path": "string",
    "parent": {
      "_id": "string",
      "name": "string",
      "slug": "string"
    }
  }
]
```

### GET /api/petitions/governing-bodies
Get governing bodies for a jurisdiction.

**Query Parameters:**
- `jurisdiction` (string): Jurisdiction ID (required)

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "slug": "string",
    "branch": "string",
    "entity_type": "string"
  }
]
```

### GET /api/petitions/legislation
Get legislation for a governing body.

**Query Parameters:**
- `governingBody` (string): Governing body ID
- `status` (string): Legislation status

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "bill_number": "string",
    "status": "string",
    "introduced_date": "date",
    "governing_body": {
      "_id": "string",
      "name": "string",
      "slug": "string"
    }
  }
]
```

### GET /api/petitions
Get all petitions with optional filtering.

**Query Parameters:**
- `category` (string): Filter by category
- `isActive` (boolean): Filter by active status
- `creator` (string): Filter by creator ID
- `jurisdiction` (string): Filter by jurisdiction
- `governingBody` (string): Filter by governing body
- `legislation` (string): Filter by legislation
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order (default: desc)
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)

**Response:**
```json
{
  "petitions": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "voteCount": 0,
      "isActive": true,
      "creator": {
        "_id": "string",
        "username": "string",
        "firstName": "string",
        "lastName": "string"
      },
      "jurisdiction": {
        "_id": "string",
        "name": "string",
        "slug": "string"
      },
      "createdAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### GET /api/petitions/:id
Get petition by ID.

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "voteCount": 0,
  "vigorCount": 0,
  "totalVigor": 0,
  "isActive": true,
  "creator": {
    "_id": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string"
  },
  "jurisdiction": {
    "_id": "string",
    "name": "string",
    "slug": "string"
  },
  "governingBody": {
    "_id": "string",
    "name": "string",
    "slug": "string"
  },
  "legislation": {
    "_id": "string",
    "title": "string",
    "bill_number": "string"
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

### POST /api/petitions
Create new petition.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "jurisdiction": "string",
  "governingBody": "string",
  "legislation": "string"
}
```

### PUT /api/petitions/:id
Update petition.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string"
}
```

### DELETE /api/petitions/:id
Delete petition.

**Headers:** `Authorization: Bearer <token>`

### GET /api/petitions/:id/trending
Get trending petitions.

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "voteCount": 0,
    "trendingScore": 0
  }
]
```

---

## Voting Endpoints

### GET /api/votes/user/:userId
Get all votes by a specific user.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)

**Response:**
```json
{
  "votes": [
    {
      "_id": "string",
      "petition": {
        "_id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "voteCount": 0,
        "isActive": true
      },
      "createdAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### GET /api/votes/stats
Get voting statistics.

**Response:**
```json
{
  "totalVotes": 1000,
  "totalPetitions": 50,
  "totalUsers": 200,
  "topPetitions": [
    {
      "_id": "string",
      "title": "string",
      "voteCount": 100,
      "creator": {
        "_id": "string",
        "username": "string",
        "firstName": "string",
        "lastName": "string"
      }
    }
  ],
  "recentVotes": [
    {
      "_id": "string",
      "user": {
        "_id": "string",
        "username": "string",
        "firstName": "string",
        "lastName": "string"
      },
      "petition": {
        "_id": "string",
        "title": "string"
      },
      "createdAt": "date"
    }
  ]
}
```

### GET /api/votes/check/:petitionId/:userId
Check if user has voted on a petition.

**Response:**
```json
{
  "hasVoted": true
}
```

### GET /api/votes/user/:userId/vote/:petitionId
Get specific vote by user and petition.

**Response:**
```json
{
  "vote": {
    "_id": "string",
    "user": "string",
    "petition": "string",
    "createdAt": "date"
  }
}
```

### GET /api/votes/category-stats
Get voting statistics by category.

**Response:**
```json
[
  {
    "_id": "string",
    "totalPetitions": 10,
    "totalVotes": 500,
    "avgVotes": 50
  }
]
```

---

## Vigor Endpoints

### POST /api/vigor/contribute
Contribute vigor to a vote.

**Request Body:**
```json
{
  "userId": "string",
  "voteId": "string",
  "vigorType": "string",
  "activityData": {
    "steps": 10000,
    "calories": 500,
    "duration": 60
  },
  "signingStatement": "string"
}
```

**Response:**
```json
{
  "vigor": {
    "_id": "string",
    "user": "string",
    "vote": "string",
    "petition": "string",
    "vigorType": "string",
    "vigorAmount": 100,
    "activityData": {},
    "signingStatement": "string",
    "createdAt": "date"
  },
  "vote": {
    "totalVigor": 100,
    "vigorCount": 1
  },
  "petition": {
    "totalVigor": 100,
    "vigorCount": 1
  },
  "shouldNotify": false
}
```

### GET /api/vigor/petition/:id
Get vigor statistics for a petition.

**Response:**
```json
{
  "totalVigor": 1000,
  "vigorCount": 50,
  "averageVigor": 20,
  "vigorByType": [
    {
      "type": "string",
      "count": 10,
      "totalAmount": 200
    }
  ],
  "recentContributions": [
    {
      "_id": "string",
      "user": {
        "_id": "string",
        "username": "string",
        "firstName": "string",
        "lastName": "string"
      },
      "vigorAmount": 50,
      "vigorType": "string",
      "createdAt": "date"
    }
  ]
}
```

### GET /api/vigor/user/:userId
Get vigor contributions by user.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)

**Response:**
```json
{
  "vigor": [
    {
      "_id": "string",
      "vote": "string",
      "petition": {
        "_id": "string",
        "title": "string"
      },
      "vigorType": "string",
      "vigorAmount": 100,
      "createdAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Government Data Endpoints

### GET /api/government/jurisdictions
Get all jurisdictions.

**Query Parameters:**
- `level` (string): Jurisdiction level
- `parent` (string): Parent jurisdiction ID
- `limit` (number): Number of results (default: 50)
- `skip` (number): Number of results to skip (default: 0)

**Response:**
```json
{
  "jurisdictions": [
    {
      "_id": "string",
      "name": "string",
      "slug": "string",
      "level": "string",
      "depth": 1,
      "path": "string",
      "parent": {
        "_id": "string",
        "name": "string",
        "slug": "string"
      }
    }
  ],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

### GET /api/government/jurisdictions/:id
Get jurisdiction by ID.

**Response:**
```json
{
  "jurisdiction": {
    "_id": "string",
    "name": "string",
    "slug": "string",
    "level": "string",
    "depth": 1,
    "path": "string",
    "parent": {
      "_id": "string",
      "name": "string",
      "slug": "string",
      "path": "string"
    }
  },
  "hierarchy": [
    {
      "_id": "string",
      "name": "string",
      "slug": "string",
      "level": "string"
    }
  ]
}
```

### GET /api/government/governing-bodies
Get governing bodies.

**Query Parameters:**
- `jurisdiction` (string): Jurisdiction ID
- `branch` (string): Government branch
- `entity_type` (string): Entity type
- `limit` (number): Number of results (default: 50)
- `skip` (number): Number of results to skip (default: 0)

**Response:**
```json
{
  "governingBodies": [
    {
      "_id": "string",
      "name": "string",
      "slug": "string",
      "branch": "string",
      "entity_type": "string",
      "jurisdiction": {
        "_id": "string",
        "name": "string",
        "slug": "string"
      }
    }
  ],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

### GET /api/government/offices
Get government offices.

**Query Parameters:**
- `governingBody` (string): Governing body ID
- `limit` (number): Number of results (default: 50)
- `skip` (number): Number of results to skip (default: 0)

**Response:**
```json
{
  "offices": [
    {
      "_id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "governingBody": {
        "_id": "string",
        "name": "string",
        "slug": "string"
      }
    }
  ],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

### GET /api/government/positions
Get government positions.

**Query Parameters:**
- `office` (string): Office ID
- `isCurrent` (boolean): Current positions only
- `limit` (number): Number of results (default: 50)
- `skip` (number): Number of results to skip (default: 0)

**Response:**
```json
{
  "positions": [
    {
      "_id": "string",
      "office": {
        "_id": "string",
        "name": "string",
        "slug": "string"
      },
      "person": {
        "_id": "string",
        "name": "string",
        "party": "string"
      },
      "startDate": "date",
      "endDate": "date",
      "isCurrent": true
    }
  ],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

### GET /api/government/elections
Get elections.

**Query Parameters:**
- `jurisdiction` (string): Jurisdiction ID
- `status` (string): Election status
- `limit` (number): Number of results (default: 50)
- `skip` (number): Number of results to skip (default: 0)

**Response:**
```json
{
  "elections": [
    {
      "_id": "string",
      "title": "string",
      "date": "date",
      "status": "string",
      "jurisdiction": {
        "_id": "string",
        "name": "string",
        "slug": "string"
      }
    }
  ],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

### GET /api/government/legislation
Get legislation.

**Query Parameters:**
- `governingBody` (string): Governing body ID
- `status` (string): Legislation status
- `limit` (number): Number of results (default: 50)
- `skip` (number): Number of results to skip (default: 0)

**Response:**
```json
{
  "legislation": [
    {
      "_id": "string",
      "title": "string",
      "bill_number": "string",
      "status": "string",
      "introduced_date": "date",
      "governing_body": {
        "_id": "string",
        "name": "string",
        "slug": "string"
      }
    }
  ],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

---

## Media Endpoints

### GET /api/media
Get all media with optional filtering.

**Query Parameters:**
- `entity_type` (string): Entity type (jurisdiction, governing_body, office, position)
- `entity_id` (string): Entity ID
- `media_type` (string): Media type
- `limit` (number): Number of results (default: 50)
- `skip` (number): Number of results to skip (default: 0)
- `sort` (string): Sort order (default: -createdAt)

**Response:**
```json
{
  "media": [
    {
      "_id": "string",
      "filename": "string",
      "original_name": "string",
      "media_type": "string",
      "file_size": 1000000,
      "mime_type": "string",
      "url": "string",
      "is_primary": false,
      "uploaded_by": {
        "_id": "string",
        "username": "string",
        "firstName": "string",
        "lastName": "string"
      },
      "createdAt": "date"
    }
  ],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

### GET /api/media/:id
Get media by ID.

**Response:**
```json
{
  "media": {
    "_id": "string",
    "filename": "string",
    "original_name": "string",
    "media_type": "string",
    "file_size": 1000000,
    "mime_type": "string",
    "url": "string",
    "is_primary": false,
    "uploaded_by": {
      "_id": "string",
      "username": "string",
      "firstName": "string",
      "lastName": "string"
    },
    "createdAt": "date"
  }
}
```

### POST /api/media/upload
Upload media file.

**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File to upload (max 10MB)
- `entity_type`: Entity type
- `entity_id`: Entity ID
- `media_type`: Media type
- `description`: Description (optional)

**Response:**
```json
{
  "media": {
    "_id": "string",
    "filename": "string",
    "original_name": "string",
    "media_type": "string",
    "file_size": 1000000,
    "mime_type": "string",
    "url": "string",
    "is_primary": false,
    "createdAt": "date"
  }
}
```

### PUT /api/media/:id
Update media metadata.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "description": "string",
  "is_primary": false
}
```

### DELETE /api/media/:id
Delete media file.

**Headers:** `Authorization: Bearer <token>`

---

## Data Endpoints

### GET /api/data
Get all data with optional filtering.

**Query Parameters:**
- `type` (string): Data type
- `category` (string): Data category
- `tags` (string): Comma-separated tags
- `isPublic` (boolean): Public data only
- `limit` (number): Number of results (default: 50)
- `page` (number): Page number (default: 1)

**Response:**
```json
{
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "type": "string",
      "category": "string",
      "tags": ["string"],
      "isPublic": true,
      "createdBy": {
        "_id": "string",
        "username": "string",
        "firstName": "string",
        "lastName": "string"
      },
      "createdAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

### GET /api/data/platform-stats
Get comprehensive platform statistics.

**Response:**
```json
{
  "totalUsers": 1000,
  "totalPetitions": 500,
  "totalVotes": 10000,
  "totalVigor": 5000,
  "totalVigorAmount": 50000,
  "recentActivity": {
    "votes": 100,
    "petitions": 10,
    "users": 20
  },
  "categoryStats": [
    {
      "_id": "string",
      "totalPetitions": 50,
      "totalVotes": 1000,
      "avgVotes": 20
    }
  ],
  "topPetitions": [
    {
      "_id": "string",
      "title": "string",
      "voteCount": 500,
      "category": "string",
      "creator": {
        "_id": "string",
        "username": "string",
        "firstName": "string",
        "lastName": "string"
      }
    }
  ],
  "vigorTypeStats": [
    {
      "_id": "string",
      "count": 100,
      "totalAmount": 5000
    }
  ]
}
```

---

## Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Messages
- `"All fields are required"` - Missing required fields
- `"Invalid credentials"` - Authentication failed
- `"User not found"` - User does not exist
- `"Access denied. Insufficient permissions."` - Insufficient role permissions
- `"Route not found"` - Invalid endpoint

---

## Rate Limiting
API endpoints are subject to rate limiting to prevent abuse. Limits are applied per IP address and user account.

### Rate Limits
- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **File uploads**: 10 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## File Upload Guidelines

### Supported File Types
- **Images**: JPEG, PNG, SVG
- **Documents**: PDF
- **Maximum file size**: 10MB

### Upload Endpoints
- `/api/users/:id/avatar` - User avatar (max 5MB)
- `/api/users/:id/banner` - User banner (max 10MB)
- `/api/media/upload` - General media upload (max 10MB)

### File Storage
- Files are stored in the server's uploads directory
- Files are served statically via `/uploads` endpoint
- File URLs are generated automatically

---

## Development Notes

### Environment Variables
Required environment variables for API functionality:
```
MONGODB_URI=mongodb://localhost:27017/usa
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CORS_ORIGIN=http://localhost:3000
```

### Local Development
1. Start MongoDB service
2. Set environment variables
3. Run `npm install` in server directory
4. Run `npm run dev` to start development server
5. API will be available at `http://localhost:5000/api`

### Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"testuser","password":"password"}'

# Test protected endpoint
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your-token>"
```

---

*Last Updated: $(date)*
*Version: 1.0*
*Maintainer: Development Team*
*Next Review: $(date -d '+3 months')*
