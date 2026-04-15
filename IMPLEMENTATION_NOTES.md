# Karthikeyan Analysis Implementation Notes

## Overview

Karthikeyan Analysis is a secure student portal and content management system built with React, TypeScript, Tailwind CSS, and React Router. This is a frontend prototype demonstrating the UI/UX for a full-stack educational platform.

## Design System

- **Primary Color**: Indigo (#4F46E5)
- **Secondary Color**: Slate (#0F172A)
- **Icons**: Lucide React
- **UI Framework**: Custom components built on Radix UI primitives
- **Styling**: Tailwind CSS v4

## Key Features Implemented

### Authentication & Authorization

- **Login Page**: Role-based authentication with toggle for Admin/Student
- **Demo Credentials**: Any email with password "password"
- **Protected Routes**: Separate routing for admin and student portals

### Admin Portal

1. **Dashboard**
   - Overview statistics (students, content, videos)
   - Recent activity feed
   - Quick action cards

2. **Student Management**
   - Data table with CRUD operations
   - Search and filter functionality
   - Student enrollment with status tracking

3. **Content Upload Hub**
   - Drag-and-drop interface for files
   - Support for PDFs, documents, and notes
   - Visibility settings modal (Public/Selective)
   - Multi-select student assignment

4. **Video Manager**
   - Video upload with metadata (title, description, duration)
   - Thumbnail management
   - Visibility controls
   - Security recommendations display

### Student Portal

1. **Dashboard**
   - Resource and video statistics
   - Recent content cards
   - Announcement section

2. **Resource Feed**
   - Grid layout of course materials
   - Search and filter by type
   - Download buttons for content

3. **Video Library**
   - Gallery view of assigned videos
   - Secure stream badges
   - Duration indicators

4. **Video Player** (Critical Security Feature)
   - Custom video player with disabled downloads
   - Dynamic watermark overlay (Student ID + Email)
   - Moving watermark animation
   - Secure stream badge
   - Security features panel
   - Right-click prevention

## Mobile Responsiveness

- **Breakpoints**: Tailwind's default (sm, md, lg, xl)
- **Mobile Menu**: Hamburger menu for sidebar on mobile
- **Responsive Grid**: Adapts from 1 to 3 columns based on screen size
- **Touch-friendly**: All interactive elements sized appropriately

## Data Structure

### Student

```typescript
{
  id: string;
  studentId: string; // e.g., "STU2024001"
  name: string;
  email: string;
  enrolledDate: string;
  status: "active" | "inactive";
}
```

### ContentItem

```typescript
{
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'doc' | 'note';
  uploadDate: string;
  visibilityType: 'ALL' | 'SELECTIVE';
  selectedStudents?: string[]; // for SELECTIVE visibility
  fileUrl?: string;
}
```

### Video

```typescript
{
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  visibilityType: 'ALL' | 'SELECTIVE';
  selectedStudents?: string[]; // for SELECTIVE visibility
  videoUrl?: string;
}
```

## Security Implementation Guide

### For Production Deployment:

#### 1. HLS Encryption (AES-128)

- **Purpose**: Prevents simple video downloads
- **Implementation**:
  - Use AWS MediaConvert or Cloudflare Stream
  - Video is broken into small chunks (.ts files)
  - Each chunk is encrypted with AES-128
  - Client needs decryption key from server

#### 2. Dynamic Watermarking

- **Current**: CSS-based moving overlay
- **Production**: Canvas-based watermark that:
  - Moves position every few seconds
  - Cannot be easily removed via CSS
  - Burns student ID into video frame
  - Changes opacity and rotation

#### 3. Signed URLs

- **Implementation Options**:
  - AWS S3 + CloudFront signed URLs
  - Google Cloud Storage signed URLs
  - Firebase Storage signed URLs
- **Expiration**: 2-4 hours recommended
- **One-time use**: Generate new URL per session

#### 4. DRM (Optional for High Security)

- Widevine (Chrome, Firefox)
- FairPlay (Safari, iOS)
- PlayReady (Edge, Windows)

#### 5. Additional Security Measures

- Screen recording detection (JavaScript)
- Rate limiting on video endpoints
- Geo-fencing (if needed)
- Device fingerprinting
- Access logging and audit trails

## Technical Stack

### Frontend

- React 18.3.1
- TypeScript
- React Router 7.13.0
- Tailwind CSS 4.1.12
- Lucide React (icons)
- Radix UI (components)

### State Management

- React Context API
  - AuthContext: User authentication state
  - DataContext: Application data (students, content, videos)

### Routing

- React Router Data mode
- Protected routes with role-based access
- Nested layouts for dashboard

## File Structure

```
/src/app/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── ui/ (Radix UI components)
│   └── SecurityNotice.tsx
├── context/
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── StudentManagement.tsx
│   │   ├── ContentUpload.tsx
│   │   └── VideoManager.tsx
│   ├── student/
│   │   ├── Dashboard.tsx
│   │   ├── ResourceFeed.tsx
│   │   ├── VideoLibrary.tsx
│   │   └── VideoPlayer.tsx
│   └── Login.tsx
├── App.tsx
└── routes.tsx
```

## Mock Data

The application uses mock data stored in DataContext for demonstration:

- 4 sample students
- 3 sample content items
- 3 sample videos

In production, this would be replaced with actual API calls to your backend.

## Next Steps for Production

1. **Backend Integration**
   - Set up authentication API (JWT tokens)
   - Create REST/GraphQL API for CRUD operations
   - Implement file upload to cloud storage
   - Set up video transcoding pipeline

2. **Database Setup**
   - User table (with roles)
   - Students table
   - Content table
   - Videos table
   - Permissions/Access table (for SELECTIVE visibility)

3. **Video Security**
   - Implement HLS encryption
   - Set up CDN with signed URLs
   - Add watermarking service
   - Optional: Integrate DRM

4. **Deployment**
   - Frontend: Vercel, Netlify, or AWS Amplify
   - Backend: AWS Lambda, Node.js server, or similar
   - Database: PostgreSQL, MySQL, or MongoDB
   - Storage: AWS S3, Google Cloud Storage, or Cloudflare R2

## Demo Credentials

- **Admin Login**: Any email + password: "password" + select "Admin" role
- **Student Login**: Any email + password: "password" + select "Student" role

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- This is a frontend prototype with mock data
- Video security features are demonstrated but require backend implementation
- All data is stored in memory and will reset on page refresh
- For production, implement proper authentication, authorization, and data persistence
