# NewDay Frontend

This is the frontend application for the NewDay Platform - a personal development platform for transformative life programs.

## Overview

The frontend is a single HTML file application with embedded CSS and JavaScript that connects to the NewDay backend API at `http://45.153.189.27:8001`.

## Features

- **User Authentication**: Login and registration with JWT token management
- **Program Browser**: Browse available personal development programs
- **Course Enrollment**: Enroll in programs and track progress
- **Interactive Learning**: Day-by-day tasks with multiple question types
- **Progress Tracking**: Visual progress bars and completion tracking
- **Achievement System**: Badges and accomplishments for user motivation
- **Admin Panel**: Program management for administrators
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: User-selectable color themes

## Technical Details

### Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: No frameworks, pure JavaScript for all functionality
- **Fetch API**: For all HTTP requests to the backend
- **Local Storage**: For token persistence and theme preferences

### Key Components

1. **Authentication System**
   - Login with username/password
   - User registration
   - JWT token management
   - User profile display

2. **Program Management**
   - Browse public programs
   - Enroll in programs
   - View enrolled programs
   - Track progress through programs

3. **Course Interface**
   - Day-by-day content delivery
   - Multiple task types (multiple choice, text questions, completion)
   - Progress tracking and visualization
   - Task submission and feedback

4. **Admin Features**
   - Program creation and management
   - User management capabilities

## API Integration

The frontend connects to the NewDay backend API with the following endpoints:

- `/api/auth/login` - User authentication
- `/api/auth/register` - User registration
- `/api/auth/me` - Current user information
- `/api/maraphons/public` - Public program listing
- `/api/maraphons/{id}/enroll` - Program enrollment
- `/api/maraphons/my-enrollments` - User's enrolled programs
- `/api/maraphons/{id}/progress` - Program progress tracking
- `/api/maraphons/{id}/days/{day}/tasks` - Daily tasks
- `/api/progress/answer` - Task submission
- `/api/users/achievements` - User achievements
- `/api/admin/maraphons` - Admin program management

## Development

### Getting Started

1. Open `index.html` in a web browser
2. The application will automatically connect to the backend at `http://45.153.189.27:8001`
3. Use the test credentials:
   - Username: `testuser`
   - Password: `password123`

### File Structure

```
frontend/
├── index.html          # Main application file
├── css/                # (Future) Separate CSS files
├── js/                 # (Future) Separate JavaScript files
└── assets/             # (Future) Images and other assets
```

## Deployment

The frontend is designed to be served as a static file. It can be deployed using any static file server or CDN.

## Future Enhancements

Planned improvements include:
- Separation of CSS and JavaScript into separate files
- Component-based architecture
- Unit testing
- Internationalization support
- Offline capability with service workers
- Performance optimizations