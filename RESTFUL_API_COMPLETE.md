# RESTful API Refactoring - Complete Summary

## Overview
All APIs across all apps have been refactored to follow strict RESTful principles:
- **Nouns only** in URLs (no verbs like `/create/`, `/review/`, `/register/`)
- **Proper HTTP methods** (GET, POST, PATCH, PUT, DELETE)
- **Resource-based URLs** with proper nesting

## Base URL
All API endpoints are prefixed with `/api/`

**Example:** `http://localhost:8000/api/auth/login/`

## Authentication
All endpoints (except login/signup) require token authentication:
- Header: `Authorization: Token <token>`
- Or via session cookie (for web frontend)

---

## Authentication APIs (`/api/auth/`)

### Authentication Endpoints (Actions Allowed)
- `POST /api/auth/login/` - User authentication
- `POST /api/auth/admin-login/` - Admin authentication
- `POST /api/auth/signup/` - Registration with approval
- `POST /api/auth/logout/` - Session termination
- `POST /api/auth/change-password/` - Change user password

### User Management (RESTful)
- `GET /api/auth/users/me/` - Get current user profile
- `PATCH /api/auth/users/me/` - Update current user profile
- `GET /api/auth/users/` - List all users (admin only)
- `GET /api/auth/users/?status=pending` - List pending users
- `GET /api/auth/users/<id>/` - Get user details
- `PATCH /api/auth/users/<id>/` - Approve/reject/deactivate user

### Admin Reports (RESTful)
- `GET /api/auth/admin/reports/summary/` - Get comprehensive reports summary
- `GET /api/auth/admin/reports/users/` - Get user registrations report
- `GET /api/auth/admin/reports/complaints/` - Get complaints report
- `GET /api/auth/admin/reports/licenses/` - Get business licenses report
- `GET /api/auth/admin/reports/towns/` - Get town statistics report

### User Documents (RESTful)
- `GET /api/auth/documents/` - List user documents
- `POST /api/auth/documents/` - Upload document
- `DELETE /api/auth/documents/<id>/` - Delete document

---

## Citizen APIs (`/api/citizen/`)

### Complaints (RESTful)
- `GET /api/citizen/complaints/` - List complaints
- `GET /api/citizen/complaints/?status=<status>` - Filter by status
- `POST /api/citizen/complaints/` - Create complaint
- `PATCH /api/citizen/complaints/<id>/` - Update complaint

### Comments (RESTful)
- `POST /api/citizen/complaints/<id>/comments/` - Add comment to complaint

### Notifications (RESTful)
- `GET /api/citizen/notifications/` - List notifications
- `GET /api/citizen/notifications/?unread=true` - Filter unread notifications
- `PATCH /api/citizen/notifications/<id>/` - Mark notification as read
- `POST /api/citizen/complaints/<id>/notifications/` - Notify citizen

---

## Business Owner APIs (`/api/business/`)

### Profile
- `GET /api/business/profile/` - Get business profile

### Licenses & Permits (RESTful)
- `GET /api/business/licenses/` - List licenses
- `POST /api/business/licenses/` - Create license application
- `PATCH /api/business/licenses/<id>/` - Review/approve/reject license (government)

### Applications (Government Review)
- `GET /api/business/applications/` - List pending applications (government)
- `GET /api/business/applications/?status=pending` - Filter by status

### Complaints (RESTful)
- `GET /api/business/complaints/` - List complaints
- `POST /api/business/complaints/` - Create complaint
- `GET /api/business/complaints/<id>/` - Get complaint details
- `PATCH /api/business/complaints/<id>/` - Update complaint (government)

### Feedback (RESTful)
- `POST /api/business/feedback/` - Business feedback to government
- `POST /api/business/business-feedback/` - Citizen feedback on businesses

### Events (RESTful)
- `GET /api/business/events/` - List events
- `GET /api/business/events/?status=pending` - Filter by status
- `POST /api/business/events/` - Create event (business owners)
- `PATCH /api/business/events/<id>/` - Review/approve/reject event (government)
- `POST /api/business/events/<id>/registrations/` - Register for event (citizens)
- `GET /api/business/events/<id>/registrations/` - List event registrations (business owners)

### Services (RESTful)
- `GET /api/business/services/` - List services
- `POST /api/business/services/` - Create service (business owners)
- `POST /api/business/service-bookings/` - Book a service (citizens)

### Notifications (RESTful)
- `GET /api/business/notifications/` - List notifications
- `GET /api/business/notifications/?unread=true` - Filter unread notifications
- `PATCH /api/business/notifications/<id>/` - Mark notification as read

---

## Government APIs (`/api/government/`)

### Departments (RESTful)
- `GET /api/government/departments/` - List departments
- `POST /api/government/departments/` - Create department
- `GET /api/government/departments/<id>/` - Get department
- `PATCH /api/government/departments/<id>/` - Update department
- `DELETE /api/government/departments/<id>/` - Delete department

### Positions (RESTful)
- `GET /api/government/positions/` - List positions
- `POST /api/government/positions/` - Create position

### Announcements (RESTful)
- `GET /api/government/announcements/` - List announcements
- `POST /api/government/announcements/` - Create announcement
- `GET /api/government/announcements/<id>/` - Get announcement
- `PATCH /api/government/announcements/<id>/` - Update announcement
- `DELETE /api/government/announcements/<id>/` - Delete announcement

### Questions (RESTful)
- `GET /api/government/announcements/<id>/questions/` - List questions
- `POST /api/government/announcements/<id>/questions/` - Create question
- `POST /api/government/announcements/<id>/questions/<id>/answers/` - Answer question

### Officials (RESTful)
- `GET /api/government/officials/` - List officials
- `GET /api/government/officials/<id>/` - Get official
- `PATCH /api/government/officials/<id>/` - Update official permissions

### Bills (RESTful)
- `GET /api/government/bills/` - List bills
- `GET /api/government/bills/?status=<status>` - Filter by status
- `GET /api/government/bills/?priority=<priority>` - Filter by priority
- `POST /api/government/bills/` - Create bill proposal
- `GET /api/government/bills/<id>/` - Get bill details
- `PATCH /api/government/bills/<id>/` - Update bill
- `DELETE /api/government/bills/<id>/` - Delete bill
- `GET /api/government/bills/<id>/comments/` - List bill comments
- `POST /api/government/bills/<id>/comments/` - Add comment to bill
- `POST /api/government/bills/<id>/vote/` - Vote on bill (support/oppose)
- `DELETE /api/government/bills/<id>/vote/` - Remove vote

### Licenses (Government Management)
- `GET /api/government/licenses/` - List all licenses (filtered by town)
- `GET /api/government/licenses/<id>/` - Get license details
- `PATCH /api/government/licenses/<id>/review/` - Review and approve/reject license
- `GET /api/government/licenses/statistics/` - Get license statistics

---

## Towns APIs (`/api/towns/`)

### Towns (RESTful)
- `GET /api/towns/active/` - List active towns
- `GET /api/towns/towns/me/emergency-contacts/` - Get emergency contacts

### Town Change Requests (RESTful)
- `GET /api/towns/town-change-requests/` - List change requests
- `POST /api/towns/town-change-requests/` - Create change request
- `GET /api/towns/town-change-requests/<id>/` - Get change request
- `PATCH /api/towns/town-change-requests/<id>/` - Approve/reject change request
- `GET /api/towns/change-requests/` - Alias for town-change-requests
- `POST /api/towns/change-requests/` - Alias for town-change-requests

---

## HTTP Method Usage

### GET
- List resources: `GET /business/licenses/`
- Get single resource: `GET /business/licenses/<id>/`
- Filtered lists: `GET /business/applications/?status=pending`

### POST
- Create new resources: `POST /business/licenses/`
- Create sub-resources: `POST /business/events/<id>/registrations/`
- Actions that create new resources: `POST /business/service-bookings/`

### PATCH/PUT
- Update resources: `PATCH /business/licenses/<id>/`
- Partial updates: `PATCH /business/notifications/<id>/` (with `is_read: true`)
- State changes: `PATCH /business/events/<id>/` (with `action: approve`)

### DELETE
- Delete resources: `DELETE /government/departments/<id>/`

---

## RESTful Principles Applied

✅ **Nouns in URLs** - All endpoints use resource names  
✅ **HTTP Methods** - GET, POST, PATCH, PUT, DELETE used correctly  
✅ **Resource Nesting** - Proper parent-child relationships  
✅ **Query Parameters** - Used for filtering (not verbs in URLs)  
✅ **Status Codes** - 200, 201, 204, 400, 403, 404, 500 used appropriately  

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

---

## Rate Limiting

- **Login**: 5 attempts per minute
- **Signup**: 5 attempts per hour
- **General API**: 100 requests per minute

---

## Security Features

- Token-based authentication
- Role-based access control (RBAC)
- Town-based data isolation
- Input validation on all endpoints
- CORS configuration
- CSRF protection

---

**Last Updated**: 2025-01-27  
**Status**: ✅ Complete
