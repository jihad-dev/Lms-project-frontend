# Module Management System

This document describes the comprehensive module management system built for the LMS admin interface.

## Overview

The module management system allows administrators to create, edit, delete, and reorder course modules. Each module represents a section of a course and can contain multiple lectures (planned for future implementation).

## Features

### 🎯 Core Functionality
- **Create Modules**: Add new modules with title, description, and module number
- **Edit Modules**: Modify existing module details
- **Delete Modules**: Remove modules with confirmation
- **Publish/Unpublish**: Toggle module visibility status
- **Drag & Drop Reordering**: Reorder modules using drag and drop interface
- **Real-time Updates**: Automatic UI updates after API operations

### 🎨 User Interface
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Form Validation**: Required field validation and error handling
- **Status Indicators**: Visual indicators for published/draft modules

## Technical Implementation

### File Structure
```
src/
├── types/
│   └── module.ts              # TypeScript interfaces
├── Redux/
│   └── features/
│       └── course/
│           └── moduleApi.ts   # RTK Query API endpoints
├── data/
│   └── demoModules.ts         # Sample data for testing
└── app/
    └── (WithDashboardLayout)/
        └── dashboard/
            └── admin/
                └── courses/
                    └── [id]/
                        └── page.tsx  # Main module management page
```

### TypeScript Interfaces

#### IModule
```typescript
export interface IModule {
  _id?: string;
  title: string;
  moduleNumber: number;
  courseId: string;
  description?: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

#### CreateModuleData
```typescript
export interface CreateModuleData {
  title: string;
  moduleNumber: number;
  courseId: string;
  description?: string;
  isPublished?: boolean;
}
```

#### UpdateModuleData
```typescript
export interface UpdateModuleData {
  title?: string;
  moduleNumber?: number;
  description?: string;
  isPublished?: boolean;
}
```

### API Endpoints

The system uses RTK Query for API management with the following endpoints:

- `GET /modules/course/:courseId` - Get all modules for a course
- `GET /modules/:id` - Get single module by ID
- `POST /modules/create` - Create new module
- `PUT /modules/:id` - Update existing module
- `DELETE /modules/:id` - Delete module
- `PATCH /modules/:id/publish` - Toggle publish status
- `PATCH /modules/reorder` - Reorder modules

### State Management

The component uses React hooks for local state:
- `isCreating`: Controls create form visibility
- `editingModule`: Tracks which module is being edited
- `formData`: Manages form input values

## Usage

### Accessing the Module Management Page

1. Navigate to the admin dashboard
2. Go to Courses section
3. Click on "Create Modules" for any course
4. You'll be taken to `/dashboard/admin/courses/[courseId]`

### Creating a New Module

1. Click "Add New Module" button
2. Fill in the required fields:
   - **Title**: Module name (required)
   - **Description**: Optional module description
   - **Module Number**: Sequential number (auto-assigned)
3. Click "Create Module"

### Editing a Module

1. Click the edit (pencil) icon on any module
2. Modify the fields as needed
3. Click "Update Module" to save changes

### Publishing/Unpublishing

1. Click the eye/eye-off icon to toggle publish status
2. Published modules are visible to students
3. Draft modules are only visible to instructors

### Reordering Modules

1. Drag and drop modules using the grip handle
2. Modules automatically reorder
3. Changes are saved to the backend

### Deleting a Module

1. Click the trash icon on any module
2. Confirm deletion in the popup
3. Module is permanently removed

## Styling

The interface uses Tailwind CSS with:
- **Color Scheme**: Blue primary colors with gray accents
- **Spacing**: Consistent 4px grid system
- **Typography**: Clear hierarchy with proper font weights
- **Shadows**: Subtle shadows for depth
- **Transitions**: Smooth hover and focus effects

## Error Handling

- **Form Validation**: Required field validation
- **API Errors**: Toast notifications for API failures
- **Loading States**: Disabled buttons during operations
- **Confirmation Dialogs**: Delete confirmation prompts

## Future Enhancements

- **Lecture Management**: Add/remove lectures within modules
- **Bulk Operations**: Select multiple modules for batch actions
- **Module Templates**: Pre-defined module structures
- **Advanced Filtering**: Filter by status, date, etc.
- **Module Analytics**: Track student progress and engagement

## Dependencies

- **React 19**: Modern React with hooks
- **Next.js 15**: App Router and server components
- **RTK Query**: API state management
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- **Lazy Loading**: Components load on demand
- **Optimistic Updates**: UI updates immediately
- **Debounced Operations**: Prevents excessive API calls
- **Efficient Re-renders**: Minimal component updates

## Security

- **Admin Only**: Route protection for admin users
- **Input Validation**: Server-side validation required
- **CSRF Protection**: Built-in Next.js protection
- **Authentication**: JWT token-based auth

## Testing

The system is designed to work with:
- **Unit Tests**: Jest and React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright or Cypress
- **Mock Data**: Demo modules for development

## Troubleshooting

### Common Issues

1. **Modules not loading**: Check API endpoint and authentication
2. **Form submission fails**: Verify required fields and API response
3. **Drag and drop not working**: Ensure JavaScript is enabled
4. **Styling issues**: Check Tailwind CSS compilation

### Debug Mode

Enable debug logging by setting:
```typescript
const DEBUG = process.env.NODE_ENV === 'development';
```

## Contributing

When adding new features:
1. Update TypeScript interfaces
2. Add corresponding API endpoints
3. Implement UI components
4. Add proper error handling
5. Update documentation

## License

This module management system is part of the LMS Frontend project.
