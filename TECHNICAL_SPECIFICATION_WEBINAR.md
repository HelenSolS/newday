# NewDay Platform - Webinar Lead Magnet Technical Specification

## Overview

This document outlines the technical implementation of the webinar lead magnet (formerly 10-day anti-stress marathon) within the NewDay platform. The implementation will follow the flexible webinar format that can accommodate any number of days.

## System Architecture

### Backend Components (FastAPI)

1. **Webinar Model**
   - ID
   - Title
   - Description
   - Duration (number of days)
   - Start date
   - End date
   - Created/updated timestamps

2. **Webinar Day Model**
   - ID
   - Webinar ID (foreign key)
   - Day number
   - Title
   - Content (nutritional facts, exercises, etc.)
   - Visual test data
   - Questions for self-observation
   - Created/updated timestamps

3. **Participant Model**
   - ID
   - User ID (foreign key)
   - Webinar ID (foreign key)
   - Enrollment date
   - Completion status
   - Current day
   - Created/updated timestamps

4. **Response Model**
   - ID
   - Participant ID (foreign key)
   - Day ID (foreign key)
   - Question ID (foreign key)
   - Response text
   - Response timestamp

5. **Visual Test Model**
   - ID
   - Day ID (foreign key)
   - Image URL
   - Options
   - Correct answer (if applicable)
   - Created/updated timestamps

### API Endpoints

1. **Webinar Management**
   - `GET /api/webinars` - List all webinars
   - `GET /api/webinars/{id}` - Get webinar details
   - `POST /api/webinars` - Create new webinar
   - `PUT /api/webinars/{id}` - Update webinar
   - `DELETE /api/webinars/{id}` - Delete webinar

2. **Webinar Day Management**
   - `GET /api/webinars/{webinar_id}/days` - List all days for a webinar
   - `GET /api/webinars/{webinar_id}/days/{day_id}` - Get specific day details
   - `POST /api/webinars/{webinar_id}/days` - Create new day
   - `PUT /api/webinars/{webinar_id}/days/{day_id}` - Update day
   - `DELETE /api/webinars/{webinar_id}/days/{day_id}` - Delete day

3. **Participant Management**
   - `GET /api/webinars/{webinar_id}/participants` - List all participants
   - `GET /api/webinars/{webinar_id}/participants/{participant_id}` - Get participant details
   - `POST /api/webinars/{webinar_id}/enroll` - Enroll user in webinar
   - `PUT /api/webinars/{webinar_id}/participants/{participant_id}/progress` - Update participant progress

4. **Response Management**
   - `GET /api/webinars/{webinar_id}/participants/{participant_id}/responses` - Get all responses for participant
   - `POST /api/webinars/{webinar_id}/days/{day_id}/responses` - Submit response for a day
   - `GET /api/webinars/{webinar_id}/days/{day_id}/responses` - Get responses for a specific day

### Frontend Components (Angular)

1. **Webinar Dashboard**
   - List of available webinars
   - Enrollment functionality
   - Progress tracking

2. **Webinar Day View**
   - Daily content display
   - Visual test interface
   - Question submission forms
   - Exercise instructions
   - Response history

3. **Admin Interface**
   - Webinar creation/editing
   - Day content management
   - Participant progress monitoring
   - Response analysis

## Bot Integration

### Telegram Bot Features

1. **Daily Content Delivery**
   - Morning messages with:
     - Greeting
     - Daily affirmation
     - Visual test
     - Nutrition fact + question
     - Exercise/warm-up
     - Self-observation questions
   - Evening messages with:
     - Summary question
     - Gratitude/affirmation
     - Daily progress summary

2. **Response Handling**
   - Collect participant responses
   - Send reminders for unanswered questions
   - Provide supportive responses to "difficult" messages

3. **Progress Tracking**
   - Track participant completion
   - Send motivational messages
   - Facilitate transition to full marathon

## Database Operations

### Core Database Operations

1. **Webinar Operations**
   - **Create**: Insert new webinar with title, description, and duration
   - **Read**: Retrieve webinar details by ID or list all webinars
   - **Update**: Modify webinar information (title, description, dates)
   - **Delete**: Remove webinar and associated days, participants, and responses

2. **Webinar Day Operations**
   - **Create**: Add new day to webinar with content and questions
   - **Read**: Get specific day details or list all days for a webinar
   - **Update**: Modify day content, questions, or visual test data
   - **Delete**: Remove day and associated responses

3. **Participant Operations**
   - **Enroll**: Create new participant record when user enrolls in webinar
   - **Track**: Update participant progress as they complete days
   - **Query**: Retrieve participant details and progress status
   - **Unenroll**: Remove participant from webinar (if needed)

4. **Response Operations**
   - **Submit**: Store participant responses to daily questions
   - **Retrieve**: Get responses for analysis or participant review
   - **Update**: Modify responses if participant wants to edit answers
   - **Delete**: Remove responses (for data privacy requests)

### Database Business Processes

1. **Enrollment Process**
   - Validate user authentication
   - Check if user is already enrolled
   - Create participant record
   - Initialize progress tracking
   - Send welcome message via bot

2. **Content Delivery Process**
   - Calculate current day based on enrollment date
   - Retrieve day content from database
   - Format content for delivery (web interface or bot)
   - Track delivery status

3. **Response Collection Process**
   - Validate response data
   - Store response in database
   - Update participant progress
   - Trigger bot acknowledgment
   - Schedule follow-up reminders if needed

4. **Progress Tracking Process**
   - Calculate completion percentage
   - Update current day status
   - Identify participants needing encouragement
   - Generate progress reports for admins

5. **Completion Process**
   - Verify all days completed
   - Generate completion certificate
   - Update participant status
   - Trigger transition to full marathon offers

## Database Schema

### Tables

1. **webinars**
   - id (INTEGER, PRIMARY KEY)
   - title (TEXT)
   - description (TEXT)
   - duration_days (INTEGER)
   - start_date (DATE)
   - end_date (DATE)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **webinar_days**
   - id (INTEGER, PRIMARY KEY)
   - webinar_id (INTEGER, FOREIGN KEY)
   - day_number (INTEGER)
   - title (TEXT)
   - content (TEXT)
   - visual_test_data (JSON)
   - questions (JSON)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

3. **participants**
   - id (INTEGER, PRIMARY KEY)
   - user_id (INTEGER, FOREIGN KEY)
   - webinar_id (INTEGER, FOREIGN KEY)
   - enrollment_date (DATE)
   - completion_status (TEXT)
   - current_day (INTEGER)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

4. **responses**
   - id (INTEGER, PRIMARY KEY)
   - participant_id (INTEGER, FOREIGN KEY)
   - day_id (INTEGER, FOREIGN KEY)
   - question_id (INTEGER)
   - response_text (TEXT)
   - response_timestamp (TIMESTAMP)

5. **visual_tests**
   - id (INTEGER, PRIMARY KEY)
   - day_id (INTEGER, FOREIGN KEY)
   - image_url (TEXT)
   - options (JSON)
   - correct_answer (TEXT)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

## Implementation Phases

### Phase 1: Core Structure
- Implement webinar and webinar_day models
- Create basic API endpoints
- Set up database schema
- Create admin interface for content management

### Phase 2: Participant Features
- Implement participant enrollment
- Create dashboard for users
- Develop day view interface
- Add response submission functionality

### Phase 3: Bot Integration
- Integrate with Telegram bot
- Implement daily content delivery
- Add response collection and reminders
- Create progress tracking features

### Phase 4: Advanced Features
- Add visual test functionality
- Implement analytics dashboard
- Create completion certificates
- Develop transition pathway to full marathon

## Testing Requirements

1. **Unit Tests**
   - Model validation
   - API endpoint testing
   - Database operations

2. **Integration Tests**
   - End-to-end webinar flow
   - Bot message delivery
   - Response handling

3. **User Acceptance Tests**
   - Participant enrollment flow
   - Daily content delivery
   - Progress tracking
   - Transition to full marathon

## Deployment Considerations

1. **Database**
   - Ensure proper indexing for performance
   - Set up backup procedures
   - Monitor storage requirements

2. **API**
   - Implement rate limiting
   - Add proper error handling
   - Ensure security measures

3. **Bot**
   - Handle message queuing
   - Implement retry mechanisms
   - Monitor delivery success rates

4. **Frontend**
   - Optimize for mobile devices
   - Ensure accessibility
   - Implement caching strategies

## Future Enhancements

1. **Personalization**
   - Adaptive content based on responses
   - Customized exercise recommendations
   - Personalized affirmations

2. **Analytics**
   - Participant engagement metrics
   - Content effectiveness analysis
   - Conversion tracking to full marathon

3. **Multi-language Support**
   - Russian, English, Turkish support
   - Cultural adaptation of content
   - Localized visual tests

4. **Advanced Features**
   - Group discussions
   - Peer support functionality
   - Expert Q&A sessions