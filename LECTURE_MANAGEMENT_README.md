# Lecture Management System

This document describes the comprehensive lecture management system built for the LMS admin interface, allowing administrators to create, edit, delete, and manage lectures within course modules.

## Overview

The lecture management system extends the existing module management functionality, providing a complete CRUD interface for lectures. Each lecture represents a learning unit within a module and can contain various types of content including text, video URLs, and duration information.

## Features

### 🎯 Core Functionality
- **Create Lectures**: Add new lectures with title, description, content, video URL, and duration
- **Edit Lectures**: Modify existing lecture details
- **Delete Lectures**: Remove lectures with confirmation
- **Publish/Unpublish**: Toggle lecture visibility status
- **Drag & Drop Reordering**: Reorder lectures within modules using drag and drop interface
- **Real-time Updates**: Automatic UI updates after API operations
- **Lecture Statistics**: Display lecture counts and total duration per module

### 🎨 User Interface
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Form Validation**: Required field validation and error handling
- **Status Indicators**: Visual indicators for published/draft lectures
- **Content Preview**: Preview lecture content in a formatted display

## Technical Implementation

### File Structure
```
src/
├── types/
│   └── lecture.ts              # TypeScript interfaces for lectures
├── Redux/
│   └── features/
│       └── course/
│           └── lectureApi.ts   # RTK Query API endpoints
├── data/
│   └── demoLectures.ts         # Sample data for testing
└── app/
    └── (WithDashboardLayout)/
        └── dashboard/
            └── admin/
                └── courses/
                    └── [id]/
                        └── modules/
                            └── [moduleId]/
                                └── lectures/
                                    └── page.tsx  # Lecture management page
```

### TypeScript Interfaces

#### ILecture
```typescript
export interface ILecture {
  _id?: string;
  title: string;
  description?: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  lectureNumber: number;
  moduleId: string;
  courseId: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

#### CreateLectureData
```typescript
export interface CreateLectureData {
  title: string;
  description?: string;
  content: string;
  videoUrl?: string;
  duration: number;
  lectureNumber: number;
  moduleId: string;
  courseId: string;
  isPublished?: boolean;
}
```

#### UpdateLectureData
```typescript
export interface UpdateLectureData {
  title?: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  lectureNumber?: number;
  isPublished?: boolean;
}
```

### API Endpoints

The system uses RTK Query for API management with the following endpoints:

- `GET /lectures/module/:moduleId` - Get all lectures for a module
- `GET /lectures/course/:courseId` - Get all lectures for a course
- `GET /lectures/:id` - Get single lecture by ID
- `POST /lectures/create` - Create new lecture
- `PUT /lectures/:id` - Update existing lecture
- `DELETE /lectures/:id` - Delete lecture
- `PATCH /lectures/:id/publish` - Toggle publish status
- `PATCH /lectures/reorder` - Reorder lectures within a module

### State Management

The component uses React hooks for local state:
- `isCreating`: Controls create form visibility
- `editingLecture`: Tracks which lecture is being edited
- `formData`: Manages form input values

## Usage

### Accessing the Lecture Management Page

1. Navigate to the admin dashboard
2. Go to Courses section
3. Click on "Create Modules" for any course
4. Click "Create Lectures" button on any module
5. You'll be taken to `/dashboard/admin/courses/[courseId]/modules/[moduleId]/lectures`

### Creating a New Lecture

1. Click "Add New Lecture" button
2. Fill in the required fields:
   - **Title**: Lecture name (required)
   - **Description**: Optional lecture description
   - **Content**: Lecture content, notes, or instructions (required)
   - **Video URL**: Optional external video link
   - **Duration**: Lecture duration in minutes
   - **Lecture Number**: Sequential number (auto-assigned)
3. Click "Create Lecture"

### Editing a Lecture

1. Click the edit (pencil) icon on any lecture
2. Modify the fields as needed
3. Click "Update Lecture" to save changes

### Publishing/Unpublishing

1. Click the publish/unpublish button to toggle lecture status
2. Published lectures are visible to students
3. Draft lectures are only visible to instructors

### Reordering Lectures

1. Drag and drop lectures to reorder them within the module
2. Lecture numbers are automatically updated
3. Changes are saved immediately

## Integration with Existing Systems

### Module Management Integration

- Lecture counts and total duration are displayed in the module list
- The "Create Lectures" button links directly to the lecture management page
- Module statistics are updated in real-time as lectures are added/removed

### Course Management Integration

- Total lecture counts are displayed in course overview
- Course statistics include published vs. draft lecture counts
- Navigation between course, module, and lecture levels

## Data Flow

1. **Course Selection**: User selects a course from the admin dashboard
2. **Module Management**: User manages modules within the selected course
3. **Lecture Management**: User creates and manages lectures within specific modules
4. **Real-time Updates**: All changes are reflected immediately across the system
5. **Data Persistence**: Changes are saved to the backend via API calls

## Error Handling

- Form validation for required fields
- API error handling with user-friendly messages
- Loading states for all async operations
- Confirmation dialogs for destructive actions
- Graceful fallbacks for missing data

## Future Enhancements

- **Rich Text Editor**: WYSIWYG editor for lecture content
- **File Uploads**: Support for PDFs, images, and other file types
- **Video Integration**: Direct video upload and streaming
- **Quiz Integration**: Built-in quiz creation tools
- **Progress Tracking**: Student progress monitoring
- **Analytics**: Lecture engagement and completion statistics

## Testing

The system includes demo data for testing:
- Sample lectures with realistic content
- Various publish states (published/draft)
- Different durations and content types
- Proper relationships between courses, modules, and lectures

## Security Considerations

- Admin-only access to lecture management
- Proper authentication and authorization
- Input validation and sanitization
- Secure API endpoints with proper error handling

## Performance Optimizations

- RTK Query for efficient API caching
- Optimistic updates for better UX
- Lazy loading of lecture content
- Efficient re-rendering with React hooks
- Proper dependency management in useEffect hooks
