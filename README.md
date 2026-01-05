# Puls Backend API

A robust Node.js/Express backend server for video management and processing. Built with **Express.js**, **MongoDB**, **Socket.io**, and **FFmpeg**, this API provides comprehensive video uploading, processing, streaming, and real-time progress tracking capabilities.

## 🎯 Overview

Puls Backend is a scalable video management server that handles user authentication, video uploads, real-time processing with FFmpeg, and WebSocket-powered live updates. It implements multi-tenant architecture with role-based access control and secure video streaming.

### Key Features

- **User Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Video Upload & Processing**: Handle large video uploads with FFmpeg processing
- **Real-time Updates**: WebSocket integration for live progress tracking
- **Video Streaming**: Secure video streaming with range request support
- **Multi-tenant Support**: Organize users and videos by organizations
- **Role-Based Access Control**: Admin, Editor, and Viewer roles
- **Database Integration**: MongoDB with Mongoose ORM
- **CORS Support**: Handle cross-origin requests safely
- **Password Security**: Bcrypt hashing for secure password storage

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Architecture](#api-architecture)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Middleware](#middleware)
- [WebSocket Events](#websocket-events)
- [Video Processing](#video-processing)
- [Error Handling](#error-handling)
- [Development](#development)
- [Deployment](#deployment)

## 🛠️ Tech Stack

### Core Framework
- **Express.js** (v5.2.1) - Fast, unopinionated web framework
- **Node.js** - JavaScript runtime
- **Nodemon** (v3.1.11) - Auto-reload during development

### Database & ORM
- **MongoDB** - NoSQL database
- **Mongoose** (v9.1.1) - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** (v9.0.3) - Token-based authentication
- **Bcryptjs** (v3.0.3) - Password hashing
- **Cookie Parser** (v1.4.7) - Parse HTTP cookies

### File & Video Processing
- **Multer** (v2.0.2) - Middleware for file uploads
- **FFmpeg** (fluent-ffmpeg v2.1.3) - Video processing library
- **FFmpeg Static** (v5.3.0) - FFmpeg binary wrapper

### Real-time Communication
- **Socket.io** (v4.8.3) - Real-time bidirectional communication
- **http** (Node.js built-in) - HTTP server creation

### Utilities
- **CORS** (v2.8.5) - Enable cross-origin requests
- **dotenv** (v17.2.3) - Environment variable management

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.js        # Authentication logic
│   │   └── video.controller.js       # Video management logic
│   │
│   ├── models/              # Database schemas
│   │   ├── user.js                   # User model with password hashing
│   │   ├── video.js                  # Video metadata model
│   │   └── organization.js           # Organization/tenant model
│   │
│   ├── routes/              # API route definitions
│   │   ├── auth.routes.js            # Auth endpoints
│   │   └── video.routes.js           # Video endpoints
│   │
│   ├── middleware/          # Express middlewares
│   │   ├── auth.middleware.js        # JWT verification
│   │   ├── role.middleware.js        # Role-based authorization
│   │   ├── tenant.middleware.js      # Multi-tenant validation
│   │   ├── multer.middleware.js      # File upload handling
│   │   └── attachIO.js               # Attach Socket.io to requests
│   │
│   ├── services/            # Business logic
│   │   └── videoProcessor.js         # FFmpeg video processing
│   │
│   ├── socket/              # Real-time communication
│   │   ├── index.js                  # Socket.io initialization
│   │   └── events.js                 # Socket event handlers
│   │
│   ├── utils/               # Utility functions
│   │   └── generateToken.js          # JWT token generation
│   │
│   ├── db/                  # Database connection
│   │   └── index.js                  # MongoDB connection setup
│   │
│   ├── uploads/             # File storage
│   │   └── Videos/                   # Video upload directory
│   │
│   ├── index.js             # Server startup & initialization
│   ├── server.js            # Express app configuration
│
├── package.json             # Project dependencies
└── .env                     # Environment variables (create this)
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- FFmpeg (installed and available in PATH)
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishna7602/puls-backend.git
   cd puls-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify FFmpeg installation**
   ```bash
   ffmpeg -version
   ```
   If not installed:
   - **Windows**: Download from https://ffmpeg.org/download.html or `choco install ffmpeg`
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt-get install ffmpeg`

4. **Create environment variables file**
   ```bash
   # Create .env file in root directory
   touch .env
   ```

5. **Configure environment variables** (see Configuration section)

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONODB_URI=mongodb://localhost:27017
DB_NAME=puls

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRY=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
FRONTEND_URL=https://puls-frontend.vercel.app

# Video Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600  # 100MB in bytes

# FFmpeg Configuration
FFMPEG_PATH=/usr/bin/ffmpeg  # Adjust based on OS
```

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development, production |
| `MONODB_URI` | MongoDB connection string | mongodb://localhost:27017 |
| `DB_NAME` | Database name | puls |
| `JWT_SECRET` | JWT signing secret | your-secret-key |
| `JWT_EXPIRY` | Token expiration time | 7d |
| `CLIENT_URL` | Frontend development URL | http://localhost:5173 |
| `FRONTEND_URL` | Production frontend URL | https://puls-frontend.vercel.app |
| `UPLOAD_DIR` | Directory for uploads | ./uploads |
| `MAX_FILE_SIZE` | Max upload size (bytes) | 104857600 |

## ▶️ Running the Server

### Development Mode
```bash
npm run dev
```
Starts the server with Nodemon for automatic reloading
- Server runs on `http://localhost:3000`
- Watches for file changes and restarts automatically

### Production Mode
```bash
npm start
```
Starts the server without file watching

## 🏗️ API Architecture

### Request-Response Flow
```
Client Request
    ↓
CORS Middleware
    ↓
Body Parser (JSON/URL-encoded)
    ↓
Cookie Parser
    ↓
Authentication Middleware (if needed)
    ↓
Authorization Middleware (if needed)
    ↓
File Upload Middleware (if file upload)
    ↓
Route Handler/Controller
    ↓
Service Layer (business logic)
    ↓
Database Operations
    ↓
Response to Client
```

### Middleware Stack
1. **CORS** - Allow cross-origin requests
2. **Body Parser** - Parse incoming JSON/URL-encoded data
3. **Cookie Parser** - Parse cookies
4. **Socket.io Middleware** - Attach socket instance
5. **Authentication** - Verify JWT tokens
6. **Authorization** - Check user roles
7. **File Upload** - Handle multipart form data

## 🗄️ Database Models

### User Model
```javascript
{
  organization: ObjectId,      // Reference to Organization
  name: String,                 // User's full name
  email: String,                // Unique email address
  password: String,             // Bcrypt hashed password
  role: String,                 // "viewer" | "editor" | "admin"
  timestamps: true              // createdAt, updatedAt
}
```

**Password Hashing**: Passwords are automatically hashed using bcrypt with salt rounds of 10 before saving.

### Video Model
```javascript
{
  organization: ObjectId,       // Reference to Organization
  uploadedBy: ObjectId,         // Reference to User
  originalName: String,         // Original filename
  filename: String,             // Stored filename
  mimeType: String,             // Video MIME type
  size: Number,                 // File size in bytes
  duration: Number,             // Video duration in seconds
  storagePath: String,          // Path to stored file
  status: String,               // "uploaded" | "processing" | "completed" | "failed"
  sensitivity: String,          // "safe" | "flagged" | "unknown"
  description: String,          // Video description
  tags: [String],               // Video tags
  timestamps: true              // createdAt, updatedAt
}
```

### Organization Model
```javascript
{
  name: String,                 // Organization name
  email: String,                // Organization email
  plan: String,                 // "free" | "pro" | "enterprise"
  storage: Number,              // Total storage in bytes
  usedStorage: Number,          // Used storage in bytes
  timestamps: true              // createdAt, updatedAt
}
```

## 📡 API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "organization": "org_id"
}

Response: {
  "user": { id, name, email, role, organization },
  "token": "jwt_token",
  "message": "User registered successfully"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response: {
  "user": { id, name, email, role, organization },
  "token": "jwt_token",
  "message": "Login successful"
}
```

### Video Endpoints

#### Upload Video
```
POST /api/videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- video: <file>
- title: "Video Title"
- description: "Video Description"

Response: {
  "video": { id, filename, status, ... },
  "message": "Video uploaded successfully"
}
```

**Requirements**:
- Requires authentication
- Requires `editor` or `admin` role
- File type: video/*
- Max size: 100MB (configurable)

#### List Videos
```
GET /api/videos
Authorization: Bearer <token>

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- status: "processing" | "completed" | "failed"
- sort: "-createdAt" | "createdAt" | "-duration"

Response: {
  "videos": [{ id, filename, status, duration, ... }],
  "total": number,
  "page": number,
  "pages": number
}
```

#### Stream Video
```
GET /api/videos/:id/stream
Authorization: Bearer <token>

Headers:
- Range: bytes=0-1023 (optional for range requests)

Response: Video file stream (206 Partial Content or 200 OK)
```

## 🔐 Authentication

### JWT Token Structure
```
Header: { alg: "HS256", typ: "JWT" }
Payload: {
  userId: "user_id",
  email: "user@example.com",
  role: "editor",
  organization: "org_id",
  iat: timestamp,
  exp: timestamp
}
Signature: HMACSHA256(header + payload, JWT_SECRET)
```

### Token Generation (`utils/generateToken.js`)
```javascript
import jwt from 'jsonwebtoken';

const generateToken = (userId, email, role, organization) => {
  return jwt.sign(
    { userId, email, role, organization },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};
```

### Authentication Flow
1. User submits credentials (email + password)
2. Backend verifies password against bcrypt hash
3. If valid, JWT token is generated
4. Token is sent to client
5. Client includes token in Authorization header
6. Middleware verifies token on each request

## 🔄 Middleware

### `auth.middleware.js` - JWT Verification
Verifies JWT token from Authorization header and attaches user to request
```javascript
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify token and attach decoded data to req.user
}
```

### `role.middleware.js` - Role-Based Authorization
Checks if user has required role
```javascript
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Error('Access denied');
    }
    next();
  }
}
```

### `multer.middleware.js` - File Upload
Handles multipart form data for video uploads
```javascript
export const uploadVideoMulter = multer({
  storage: multer.diskStorage({
    destination: './uploads/Videos',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});
```

### `tenant.middleware.js` - Multi-tenant Isolation
Ensures users can only access their organization's data

### `attachIO.js` - Socket.io Attachment
Attaches Socket.io instance to request for real-time updates

## 🔌 WebSocket Events

### Connection Events
```javascript
socket.on('connection', (socket) => {
  console.log('User connected:', socket.id);
});

socket.on('disconnect', (socket) => {
  console.log('User disconnected:', socket.id);
});
```

### Video Processing Events
```javascript
// Server emits progress updates
socket.emit('video:processing', {
  videoId: 'video_id',
  progress: 45,
  status: 'processing',
  message: 'Converting to MP4...'
});

// Client listens for updates
socket.on('video:progress', (data) => {
  console.log(`Video ${data.videoId} is ${data.progress}% complete`);
});
```

### Available Events
- `video:processing` - Video processing progress
- `video:completed` - Video processing completed
- `video:failed` - Video processing failed
- `upload:progress` - File upload progress

## 🎬 Video Processing

### Processing Service (`services/videoProcessor.js`)
Handles FFmpeg video conversion and optimization

```javascript
export const processVideo = async (inputPath, outputPath, videoId, io) => {
  // Convert video to optimized format
  // Emit progress updates via Socket.io
  // Extract metadata (duration, bitrate, etc.)
  // Save processed video
}
```

### Processing Steps
1. Verify video file integrity
2. Extract video metadata
3. Transcode to H.264 MP4 (if needed)
4. Generate thumbnail (optional)
5. Update database with processing status
6. Emit completion event via Socket.io

### FFmpeg Commands Used
```bash
# Get video metadata
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:nounits=1 input.mp4

# Transcode video
ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output.mp4
```

## ❌ Error Handling

### Global Error Handler
Catches and formats all errors consistently

```javascript
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": "Additional error details"
}
```

### HTTP Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created
- `206 Partial Content` - Range request fulfilled
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Common Errors
| Code | Message | Cause |
|------|---------|-------|
| 400 | Invalid video file | Non-video file uploaded |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Access denied | Insufficient role permissions |
| 413 | File too large | Upload exceeds size limit |
| 500 | FFmpeg error | Video processing failed |

## 💻 Development

### Project Setup
1. Install dependencies: `npm install`
2. Create `.env` file with configuration
3. Ensure MongoDB is running
4. Ensure FFmpeg is installed
5. Start development server: `npm run dev`

### Code Structure Standards
- Controllers handle HTTP requests/responses
- Services contain business logic
- Models define database schemas
- Middleware handles cross-cutting concerns
- Routes define API endpoints

### Adding New Endpoints
1. Create controller method in `controllers/`
2. Define route in `routes/`
3. Add middleware if needed
4. Test with appropriate tools

### Debugging
- Use `console.log()` for quick debugging
- Check `process.env` for configuration
- Monitor MongoDB connection logs
- Verify FFmpeg is in PATH

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Update `JWT_SECRET` to strong secret
- [ ] Configure MongoDB Atlas or production DB
- [ ] Update CORS origins to production domain
- [ ] Set appropriate file size limits
- [ ] Enable HTTPS
- [ ] Set up error logging
- [ ] Configure backup strategy

### Deployment Platforms
The backend can be deployed to:
- **Heroku** - `git push heroku main`
- **AWS** - EC2, Elastic Beanstalk, or Lambda
- **DigitalOcean** - App Platform or Droplets
- **Render** - Web services
- **Railway** - Cloud platform

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
DB_NAME=puls
JWT_SECRET=<strong-random-secret>
JWT_EXPIRY=7d
CLIENT_URL=https://puls.yoursite.com
FRONTEND_URL=https://puls.yoursite.com
UPLOAD_DIR=/tmp/uploads  # Use temporary directory or cloud storage
```

### Docker Deployment (Optional)
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t puls-backend .
docker run -p 3000:3000 --env-file .env puls-backend
```

## 📊 Performance Optimization

### Best Practices
- Use database indexes on frequently queried fields
- Implement pagination for large datasets
- Cache video metadata to reduce DB queries
- Use CDN for video delivery
- Implement rate limiting for API endpoints
- Monitor server resources and logs
- Use clustering for multi-core systems

### Monitoring
- Monitor API response times
- Track video processing queue
- Monitor database connection pool
- Track storage usage
- Monitor server CPU and memory

## 🔗 Frontend Integration

The backend integrates with the Puls Frontend via:
- **HTTP API** for data operations
- **WebSocket** for real-time updates
- **CORS** for cross-origin requests

Frontend expects:
- Token in `Authorization: Bearer <token>` header
- CORS-enabled endpoints
- WebSocket connection to `/socket.io`

## 📚 API Documentation Tools

For interactive API testing:
- **Postman** - Import and test endpoints
- **Thunder Client** - VS Code extension
- **Insomnia** - REST client
- **cURL** - Command-line testing

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 Code Standards

- Use async/await for asynchronous operations
- Implement proper error handling with try/catch
- Use meaningful variable and function names
- Add comments for complex logic
- Follow Express.js best practices
- Use environment variables for configuration

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Krishna (krishna7602)

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## 🔗 Related Repositories

- [Puls Frontend](https://github.com/krishna7602/puls-frontend) - React frontend application
- [Puls Database Schema](https://github.com/krishna7602/puls) - Database documentation

---

**Last Updated**: January 2026
**Backend Version**: 1.0.0
