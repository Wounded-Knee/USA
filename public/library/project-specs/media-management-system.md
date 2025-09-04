# Media Management System Documentation

## Overview

The Media Management System provides comprehensive functionality for uploading, managing, and linking various types of media files to government entities in the US Government Database. This system supports seals, flags, headshots, logos, buildings, documents, signatures, and other media types.

## Architecture

### Database Schema

#### Media Model
```javascript
const MediaSchema = new Schema({
  filename: { type: String, required: true },
  original_name: { type: String, required: true },
  mime_type: { type: String, required: true },
  size: { type: Number, required: true }, // in bytes
  path: { type: String, required: true }, // file system path
  url: { type: String, required: true }, // public URL

  media_type: { type: String, enum: MEDIA_TYPES, required: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  alt_text: { type: String, trim: true },

  // Entity references
  jurisdiction: { type: Types.ObjectId, ref: 'Jurisdiction' },
  governing_body: { type: Types.ObjectId, ref: 'GoverningBody' },
  office: { type: Types.ObjectId, ref: 'Office' },
  position: { type: Types.ObjectId, ref: 'Position' },

  // Metadata
  width: { type: Number }, // for images
  height: { type: Number }, // for images
  duration: { type: Number }, // for videos/audio in seconds

  is_primary: { type: Boolean, default: false },
  is_public: { type: Boolean, default: true },

  uploaded_by: { type: Types.ObjectId, ref: 'User', required: true },

  metadata: { type: Map, of: Schema.Types.Mixed }
}, { timestamps: true });
```

#### Supported Media Types
```javascript
const MEDIA_TYPES = [
  'seal', 'flag', 'headshot', 'logo', 'building', 'document', 'signature', 'other'
];
```

#### Entity Model Updates
All government entity models now include:
```javascript
media: [{ type: Types.ObjectId, ref: 'Media' }],
primary_media: { type: Types.ObjectId, ref: 'Media' }
```

## API Endpoints

### Media Management

#### GET /api/media
List all media with optional filtering.

**Query Parameters:**
- `entity_type`: Filter by entity type (jurisdiction, governing_body, office, position)
- `entity_id`: Filter by specific entity ID
- `media_type`: Filter by media type
- `limit`: Number of results (default: 50)
- `skip`: Number to skip (default: 0)
- `sort`: Sort field (default: -createdAt)

**Response:**
```json
{
  "media": [...],
  "total": 1,
  "limit": 50,
  "skip": 0
}
```

#### GET /api/media/:id
Get specific media by ID.

**Response:**
```json
{
  "media": {
    "_id": "...",
    "filename": "seal_1234567890_abc123.png",
    "title": "Great Seal of the United States",
    "media_type": "seal",
    "is_primary": true,
    "jurisdiction": {...},
    "uploaded_by": {...}
  }
}
```

#### POST /api/media/upload
Upload new media file.

**Form Data:**
- `file`: The media file
- `media_type`: Type of media (seal, flag, etc.)
- `title`: Media title
- `description`: Media description
- `alt_text`: Alt text for accessibility
- `entity_type`: Type of entity to link to
- `entity_id`: ID of entity to link to
- `is_primary`: Whether this is primary media
- `uploaded_by`: User ID (if not authenticated)

**Response:**
```json
{
  "message": "Media uploaded successfully",
  "media": {...}
}
```

#### PUT /api/media/:id
Update media metadata.

**Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "alt_text": "Updated alt text",
  "is_public": true
}
```

#### PUT /api/media/:id/set-primary
Set media as primary for an entity.

**Body:**
```json
{
  "entity_type": "jurisdiction",
  "entity_id": "entity_id_here"
}
```

#### DELETE /api/media/:id
Delete media file and record.

#### GET /api/media/entity/:entityType/:entityId
Get media associated with a specific entity.

#### POST /api/media/link
Link existing media to an entity.

**Body:**
```json
{
  "media_id": "media_id_here",
  "entity_type": "jurisdiction",
  "entity_id": "entity_id_here"
}
```

#### POST /api/media/unlink
Unlink media from an entity.

**Body:**
```json
{
  "media_id": "media_id_here",
  "entity_type": "jurisdiction",
  "entity_id": "entity_id_here"
}
```

## Frontend Components

### MediaBrowser
Located at: `src/app/lab/government-browser/components/MediaBrowser.tsx`

**Features:**
- Browse all media with filtering options
- Upload new media files
- Link/unlink media to entities
- Set primary media
- Delete media
- View media details and metadata

**Props:**
```typescript
interface MediaBrowserProps {
  breadcrumbs: BreadcrumbItem[];
  onJurisdictionSelect: (jurisdiction: any) => void;
  currentJurisdictionFilter: string | null;
}
```

### Integration with GovernmentBrowser
The MediaBrowser is integrated into the main GovernmentBrowser component as a new tab, providing seamless access to media management functionality alongside other government entity browsers.

## File Storage

### Directory Structure
```
server/uploads/media/
├── seal_1234567890_abc123.png
├── flag_1234567890_def456.png
└── ...
```

### File Naming Convention
Files are automatically renamed using the pattern:
`{media_type}_{timestamp}_{random_string}.{extension}`

### Supported File Types
- **Images**: JPEG, PNG, SVG
- **Documents**: PDF
- **Media Type Specific**:
  - Seal: JPEG, PNG, SVG
  - Flag: JPEG, PNG, SVG
  - Headshot: JPEG, PNG
  - Logo: JPEG, PNG, SVG
  - Building: JPEG, PNG
  - Document: PDF, JPEG, PNG
  - Signature: JPEG, PNG, SVG
  - Other: JPEG, PNG, SVG, PDF

## Security Features

### File Validation
- MIME type validation
- File size limits
- File extension validation
- Media type-specific allowed formats

### Access Control
- Role-based access control for editing
- User authentication for uploads
- Public/private media flags

### File System Security
- Unique file naming to prevent conflicts
- Proper file permissions
- Secure file serving

## Usage Examples

### Uploading Media via API
```bash
curl -X POST \
  -F "file=@great_seal.png" \
  -F "media_type=seal" \
  -F "title=Great Seal of the United States" \
  -F "description=Official seal of the United States of America" \
  -F "entity_type=jurisdiction" \
  -F "entity_id=68b48fc38f21cae7a7b2b3c9" \
  -F "is_primary=true" \
  -F "uploaded_by=68b244b1d9bd1067422b8712" \
  http://localhost:5000/api/media/upload
```

### Setting Primary Media
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{"entity_type": "jurisdiction", "entity_id": "68b48fc38f21cae7a7b2b3c9"}' \
  http://localhost:5000/api/media/68b4a105d73973efcc72c494/set-primary
```

### Getting Entity Media
```bash
curl "http://localhost:5000/api/media?entity_type=jurisdiction&entity_id=68b48fc38f21cae7a7b2b3c9"
```

## Error Handling

### Common Error Responses
- `400 Bad Request`: Invalid file type or missing required fields
- `404 Not Found`: Media or entity not found
- `500 Internal Server Error`: Server-side processing errors

### Validation Errors
```json
{
  "error": "Invalid media data",
  "details": ["Media type is required", "Entity ID is required"]
}
```

## Performance Considerations

### Database Indexing
The Media model includes indexes for:
- Entity references (jurisdiction, governing_body, office, position)
- Media type
- Uploaded by user
- Created date

### File Optimization
- Automatic image dimension extraction
- File size tracking
- Efficient file serving via static middleware

## Future Enhancements

### Planned Features
- Image resizing and optimization
- Video/audio support
- Cloud storage integration
- Advanced search and filtering
- Media galleries and collections
- Bulk upload operations
- Media versioning

### Technical Improvements
- CDN integration for better performance
- Image format conversion (WebP support)
- Thumbnail generation
- Metadata extraction from files
- Advanced caching strategies

## Dependencies

### Backend
- `multer`: File upload handling
- `sharp`: Image processing (planned)
- `fs.promises`: File system operations
- `path`: File path utilities

### Frontend
- `axios`: HTTP client for API calls
- `react-dropzone`: File upload interface (planned)
- `react-image-crop`: Image editing (planned)

## Configuration

### Environment Variables
```bash
# File upload settings
UPLOAD_MAX_SIZE=10485760  # 10MB
UPLOAD_DIR=server/uploads/media
PUBLIC_URL_BASE=/uploads/media

# Media processing
ENABLE_IMAGE_PROCESSING=true
MAX_IMAGE_DIMENSIONS=2048x2048
```

### Server Configuration
The media routes are automatically registered in `server/index.js`:
```javascript
app.use('/api/media', require('./routes/media'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

## Testing

### API Testing
All endpoints can be tested using curl or Postman. Example test scripts are provided in the documentation.

### Frontend Testing
The MediaBrowser component can be tested through the Government Browser interface at `/lab/government-browser`.

## Troubleshooting

### Common Issues
1. **File upload fails**: Check file type and size limits
2. **Media not linking**: Verify entity ID and type
3. **Images not displaying**: Check file permissions and URL configuration
4. **Primary media not setting**: Ensure entity exists and media is linked

### Debug Information
Enable debug logging by setting `DEBUG=media:*` environment variable.

## Related Documentation
- [Government Database Schema](./government.md)
- [API Documentation](./api.md)
- [Frontend Components](./frontend.md)
