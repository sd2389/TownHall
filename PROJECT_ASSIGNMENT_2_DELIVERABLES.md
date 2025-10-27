# TownHall - Project Assignment 2 Deliverables

**Project Name:** TownHall - Digital Town Hall Platform  
**Project Type:** Full-stack web application for citizen-government engagement  
**Technology Stack:** Django REST Framework + Next.js + TypeScript  
**Development Status:** Sprint 2 - Core Backend & Authentication Complete

---

# TABLE OF CONTENTS

1. [Entities and Attributes](#1-entities-and-attributes)
2. [API Documentation](#2-api-documentation)
3. [Test Cases](#3-test-cases)
4. [External Team Integration Requirements](#4-external-team-requirements)
5. [User Interface Overview](#5-user-interface-overview)
6. [Sprint 2 Stories Status](#6-sprint-2-stories-status)
7. [Pivotal Tracker Information](#7-pivotal-tracker-information)
8. [Architecture Diagrams](#8-architecture-diagrams)

---

## 1. ENTITIES AND ATTRIBUTES

### 1.1 Core Authentication Entities

#### User (Django Base Model)
**Description:** Standard Django user model for authentication
**Attributes:**
- `id` (Integer, Primary Key)
- `username` (String, Unique) - Used as email address
- `email` (String, Unique)
- `password` (String, Hashed) - PBKDF2 with salt
- `first_name` (String, Max 150)
- `last_name` (String, Max 150)
- `is_staff` (Boolean) - Admin access
- `is_superuser` (Boolean) - Full system access
- `is_active` (Boolean) - Account status
- `date_joined` (DateTime) - Registration timestamp

#### UserProfile (Extended Profile)
**Description:** Role-based profile information and approval tracking
**Attributes:**
- `id` (Integer, Primary Key)
- `user` (OneToOne ForeignKey to User)
- `role` (CharField, Choices: 'citizen', 'business', 'government')
- `phone_number` (CharField, Max 15)
- `town` (Foreign Key to Town) - User's assigned town
- `is_approved` (Boolean) - Approval status for citizens/businesses
- `approved_by` (Foreign Key to User) - Who approved the account
- `approved_at` (DateTime) - When account was approved
- `created_at` (DateTime, Auto) - Profile creation timestamp
- `updated_at` (DateTime, Auto) - Last modification timestamp

**Business Rules:**
- Government accounts auto-approved on creation
- Citizens and businesses require government approval
- Superusers have full access across all towns

---

### 1.2 Geographic Entity

#### Town
**Description:** Represents a municipality in the system
**Attributes:**
- `id` (Integer, Primary Key)
- `name` (CharField, Max 100, Unique) - Town name
- `slug` (SlugField, Max 100, Unique) - URL-friendly identifier
- `state` (CharField, Max 50) - State/Province
- `is_active` (Boolean) - Active for signups
- `zip_codes` (JSONField) - List of valid ZIP codes
- `created_at` (DateTime, Auto)
- `updated_at` (DateTime, Auto)

**Example:** "Secaucus, NJ"

---

### 1.3 Citizen Entities

#### CitizenProfile
**Description:** Extended information for citizen accounts
**Attributes:**
- `id` (Integer, Primary Key)
- `user` (OneToOne ForeignKey to User)
- `citizen_id` (CharField, Max 20, Unique) - Format: C000001
- `phone_number` (CharField, Max 15)
- `address` (TextField) - Full address string
- `billing_address` (JSONField) - Structured address for verification
  - Contains: street, apt_suite, city, state, zip_code
- `date_of_birth` (Date) - Optional
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### CitizenComplaint
**Description:** Citizen-submitted issues and complaints
**Attributes:**
- `id` (Integer, Primary Key)
- `citizen` (ForeignKey to CitizenProfile)
- `title` (CharField, Max 200)
- `description` (TextField)
- `category` (CharField, Max 100)
- `priority` (CharField, Choices: 'low', 'medium', 'high', 'urgent')
- `status` (CharField, Choices: 'pending', 'in_progress', 'resolved', 'closed')
- `created_at` (DateTime)
- `updated_at` (DateTime)

**Status Flow:** pending → in_progress → resolved → closed

#### CitizenFeedback
**Description:** Citizen feedback on government services
**Attributes:**
- `id` (Integer, Primary Key)
- `citizen` (ForeignKey to CitizenProfile)
- `service_name` (CharField, Max 200)
- `rating` (Integer, 1-5 scale)
- `feedback_text` (TextField)
- `created_at` (DateTime)

---

### 1.4 Business Entities

#### BusinessOwnerProfile
**Description:** Business registration information
**Attributes:**
- `id` (Integer, Primary Key)
- `user` (OneToOne ForeignKey to User)
- `business_name` (CharField, Max 200)
- `business_registration_number` (CharField, Max 50, Unique)
- `business_type` (CharField, Max 100)
- `phone_number` (CharField, Max 15)
- `business_address` (TextField)
- `billing_address` (JSONField) - For verification
- `website` (URLField) - Optional
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### BusinessLicense
**Description:** Business license and permit tracking
**Attributes:**
- `id` (Integer, Primary Key)
- `business_owner` (ForeignKey to BusinessOwnerProfile)
- `license_type` (CharField, Max 100)
- `license_number` (CharField, Max 50, Unique)
- `status` (CharField, Choices: 'pending', 'approved', 'rejected', 'expired')
- `issue_date` (Date) - Nullable
- `expiry_date` (Date) - Nullable
- `description` (TextField)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### BusinessComplaint
**Description:** Business-submitted issues
**Attributes:** (Same structure as CitizenComplaint)
- Similar to CitizenComplaint but linked to BusinessOwnerProfile

#### BusinessFeedback
**Description:** Business feedback on government services
**Attributes:** (Similar to CitizenFeedback)

---

### 1.5 Government Entities

#### GovernmentOfficial
**Description:** Government employee profiles
**Attributes:**
- `id` (Integer, Primary Key)
- `user` (OneToOne ForeignKey to User)
- `employee_id` (CharField, Max 20, Unique)
- `department` (CharField, Max 100)
- `position` (CharField, Max 100)
- `phone_number` (CharField, Max 15)
- `office_address` (TextField)
- `town` (ForeignKey to Town) - Assigned town for operations
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### Department
**Description:** Government departments
**Attributes:**
- `id` (Integer, Primary Key)
- `name` (CharField, Max 200, Unique)
- `description` (TextField)
- `head` (ForeignKey to GovernmentOfficial) - Department head
- `contact_email` (EmailField)
- `contact_phone` (CharField, Max 15)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### Service
**Description:** Government services offered to citizens
**Attributes:**
- `id` (Integer, Primary Key)
- `name` (CharField, Max 200)
- `description` (TextField)
- `department` (ForeignKey to Department)
- `status` (CharField, Choices: 'active', 'inactive', 'maintenance')
- `processing_time` (CharField, Max 100)
- `requirements` (TextField)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### Announcement
**Description:** Public announcements by government
**Attributes:**
- `id` (Integer, Primary Key)
- `title` (CharField, Max 200)
- `content` (TextField)
- `department` (ForeignKey to Department)
- `priority` (CharField, Choices: 'low', 'medium', 'high', 'urgent')
- `is_published` (Boolean) - Publication status
- `published_at` (DateTime) - Publication timestamp
- `created_by` (ForeignKey to GovernmentOfficial)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### ComplaintResponse
**Description:** Government responses to citizen/business complaints
**Attributes:**
- `id` (Integer, Primary Key)
- `complaint_id` (CharField, Max 50) - Reference to complaint
- `complaint_type` (CharField) - 'citizen' or 'business'
- `official` (ForeignKey to GovernmentOfficial)
- `response_text` (TextField)
- `status` (CharField, Default: 'responded')
- `created_at` (DateTime)

---

### 1.6 Transaction Entities

#### TownChangeRequest
**Description:** Requests for users to change their assigned town
**Attributes:**
- `id` (Integer, Primary Key)
- `user` (ForeignKey to User)
- `current_town` (ForeignKey to Town)
- `requested_town` (ForeignKey to Town)
- `billing_address` (JSONField) - Verification address
- `status` (CharField, Choices: 'pending', 'approved_current', 'approved_new', 'completed', 'rejected')
- `rejection_reason` (TextField) - If rejected
- `requested_at` (DateTime, Auto)
- `approved_by_current_town` (ForeignKey to User) - First approver
- `approved_by_new_town` (ForeignKey to User) - Second approver
- `completed_at` (DateTime) - Completion timestamp

**Approval Flow:**
1. User submits request (status: 'pending')
2. Current town approves (status: 'approved_current')
3. New town approves (status: 'completed')
4. User's town updated automatically

---

## 2. API DOCUMENTATION

### Base Configuration
- **Base URL:** `http://localhost:8000/api`
- **Content-Type:** `application/json`
- **Authentication:** Token-based (except public endpoints)

### Authentication Headers
```http
Authorization: Token <token_key>
Content-Type: application/json
```

---

### 2.1 Authentication APIs

#### POST /auth/login/

**Purpose:** User authentication and token generation

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "userType": "citizen"
}
```

**Response 200 OK:**
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "citizen",
    "phoneNumber": "+1234567890",
    "is_superuser": false,
    "is_approved": true,
    "town": "Secaucus"
  },
  "message": "Login successful"
}
```

**Response 400 Bad Request:**
```json
{
  "error": "Validation failed",
  "details": {
    "email": ["This field is required."],
    "password": ["This field is required."],
    "userType": ["This field is required."]
  }
}
```

**Response 401 Unauthorized:**
```json
{
  "error": "Invalid credentials"
}
```

**Response 403 Forbidden (Pending Approval):**
```json
{
  "error": "Account pending approval",
  "pending_approval": true,
  "message": "Your account is pending approval from government officials."
}
```

**Response 429 Too Many Requests:**
```json
{
  "detail": "Request was throttled. Expected available in 54 seconds."
}
```

---

#### POST /auth/signup/

**Purpose:** New user registration with approval workflow

**Rate Limit:** 5 requests per hour

**Request Body (Citizen):**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "userType": "citizen",
  "townId": 1,
  "streetAddress": "123 Main St",
  "aptSuite": "Apt 4B",
  "city": "Secaucus",
  "state": "NJ",
  "zipCode": "07094",
  "dateOfBirth": "1990-01-15"
}
```

**Request Body (Business):**
```json
{
  "email": "business@example.com",
  "password": "SecurePass123!",
  "firstName": "Business",
  "lastName": "Owner",
  "phone": "+1234567890",
  "userType": "business",
  "townId": 1,
  "streetAddress": "456 Commerce Ave",
  "city": "Secaucus",
  "state": "NJ",
  "zipCode": "07094",
  "businessName": "ABC Business Inc",
  "businessType": "Retail",
  "businessRegistrationNumber": "BR123456",
  "businessAddress": "456 Commerce Ave, Secaucus, NJ",
  "website": "https://abc.com"
}
```

**Response 201 Created:**
```json
{
  "user": {
    "id": 10,
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "citizen",
    "phoneNumber": "+1234567890",
    "is_approved": false
  },
  "pending_approval": true,
  "message": "Account created. Please wait for government approval."
}
```

**Response 400 Validation Error:**
```json
{
  "error": "Validation failed",
  "details": {
    "email": ["User with this email already exists."],
    "password": ["Password is too common."]
  }
}
```

**Response 429 Too Many Requests:**
```json
{
  "detail": "Request was throttled. Expected available in 45 minutes."
}
```

---

#### POST /auth/logout/

**Purpose:** Invalidate user session token

**Authentication:** Required

**Response 200 OK:**
```json
{
  "message": "Logout successful"
}
```

---

#### GET /auth/profile/

**Purpose:** Retrieve authenticated user's profile

**Authentication:** Required

**Response 200 OK (Citizen):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "citizen",
    "phoneNumber": "+1234567890",
    "is_superuser": false,
    "citizenId": "C000001",
    "address": "123 Main St, Apt 4B, Secaucus, NJ, 07094",
    "dateOfBirth": "1990-01-15"
  }
}
```

**Response 200 OK (Business):**
```json
{
  "user": {
    "id": 2,
    "email": "business@example.com",
    "firstName": "Business",
    "lastName": "Owner",
    "role": "business",
    "phoneNumber": "+1234567890",
    "is_superuser": false,
    "businessName": "ABC Business Inc",
    "businessType": "Retail",
    "businessAddress": "456 Commerce Ave, Secaucus, NJ",
    "businessRegistrationNumber": "BR123456",
    "website": "https://abc.com"
  }
}
```

---

### 2.2 User Approval APIs (Government Only)

#### GET /auth/pending-users/

**Purpose:** List unapproved users from government's town

**Authentication:** Required (Government officials only)

**Response 200 OK:**
```json
[
  {
    "user_id": 10,
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "citizen",
    "created_at": "2024-10-10T09:00:00Z"
  },
  {
    "user_id": 11,
    "email": "business@example.com",
    "firstName": "Business",
    "lastName": "Owner",
    "role": "business",
    "created_at": "2024-10-10T10:00:00Z"
  }
]
```

**Response 403 Forbidden (Non-Government):**
```json
{
  "error": "Only government officials can view pending users"
}
```

---

#### POST /auth/approve-user/<user_id>/

**Purpose:** Approve pending user and activate account

**Authentication:** Required (Government officials only)

**Response 200 OK:**
```json
{
  "message": "User approved successfully",
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

**Response 403 Forbidden:**
```json
{
  "error": "You can only approve users from your town"
}
```

---

#### POST /auth/reject-user/<user_id>/

**Purpose:** Reject and remove pending user

**Authentication:** Required (Government officials only)

**Response 200 OK:**
```json
{
  "message": "User rejected and removed successfully"
}
```

---

### 2.3 Town Management APIs

#### GET /towns/active/

**Purpose:** Retrieve all active towns for dropdown population

**Authentication:** None (Public endpoint)

**Response 200 OK:**
```json
[
  {
    "id": 1,
    "name": "Secaucus",
    "state": "NJ"
  },
  {
    "id": 2,
    "name": "Jersey City",
    "state": "NJ"
  },
  {
    "id": 3,
    "name": "Hoboken",
    "state": "NJ"
  }
]
```

---

#### POST /towns/change-request/

**Purpose:** Submit town change request with billing address

**Authentication:** Required

**Request Body:**
```json
{
  "requested_town_id": 2,
  "billing_address": {
    "street": "456 New Address St",
    "apt_suite": "Suite 200",
    "city": "Jersey City",
    "state": "NJ",
    "zip_code": "07305"
  }
}
```

**Response 201 Created:**
```json
{
  "message": "Town change request created successfully",
  "request_id": 5
}
```

**Response 400 Bad Request:**
```json
{
  "error": "You already have a pending town change request"
}
```

---

#### GET /towns/change-requests/

**Purpose:** List town change requests for government approval

**Authentication:** Required (Government officials only)

**Response 200 OK:**
```json
[
  {
    "id": 5,
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "current_town": "Secaucus",
    "requested_town": "Jersey City",
    "billing_address": {
      "street": "456 New Address St",
      "apt_suite": "Suite 200",
      "city": "Jersey City",
      "state": "NJ",
      "zip_code": "07305"
    },
    "status": "pending",
    "requested_at": "2024-10-10T10:00:00Z"
  }
]
```

---

#### POST /towns/change-request/<id>/approve/

**Purpose:** Approve town change request (two-step process)

**Authentication:** Required (Government officials only)

**Response 200 OK (First Approval):**
```json
{
  "message": "Request approved by current town. Awaiting approval from new town."
}
```

**Response 200 OK (Second Approval - Completed):**
```json
{
  "message": "Town change completed successfully"
}
```

---

#### POST /towns/change-request/<id>/reject/

**Purpose:** Reject town change request

**Authentication:** Required (Government officials only)

**Request Body:**
```json
{
  "reason": "Billing address does not match town location"
}
```

**Response 200 OK:**
```json
{
  "message": "Request rejected successfully"
}
```

---

## 3. TEST CASES

### 3.1 Authentication API Tests

#### TC-AUTH-001: Successful Login
- **Test Name:** Valid credentials login
- **Endpoint:** POST /auth/login/
- **Input:** Valid email, password, correct userType
- **Expected Status:** 200
- **Expected Response:** Contains token and user data
- **Validation:** Token is valid JWT format, user data matches

#### TC-AUTH-002: Invalid Email Login
- **Test Name:** Wrong email format
- **Endpoint:** POST /auth/login/
- **Input:** Invalid email format
- **Expected Status:** 400
- **Expected Response:** Validation error

#### TC-AUTH-003: Wrong Password
- **Test Name:** Correct email, wrong password
- **Endpoint:** POST /auth/login/
- **Input:** Valid email, incorrect password
- **Expected Status:** 401
- **Expected Response:** "Invalid credentials"

#### TC-AUTH-004: Pending Approval Account
- **Test Name:** Login with unapproved account
- **Endpoint:** POST /auth/login/
- **Input:** Valid credentials, is_approved=False
- **Expected Status:** 403
- **Expected Response:** "Account pending approval"

#### TC-AUTH-005: Rate Limiting Test
- **Test Name:** Multiple rapid login attempts
- **Endpoint:** POST /auth/login/
- **Input:** 6 consecutive login attempts within 1 minute
- **Expected Status:** 429 (on 6th attempt)
- **Expected Response:** Rate limit exceeded message

#### TC-AUTH-006: Missing Required Fields
- **Test Name:** Login without required fields
- **Endpoint:** POST /auth/login/
- **Input:** Missing 'userType'
- **Expected Status:** 400
- **Expected Response:** Validation error for missing fields

---

### 3.2 Signup API Tests

#### TC-SIGNUP-001: Successful Citizen Signup
- **Test Name:** Complete citizen registration
- **Endpoint:** POST /auth/signup/
- **Input:** All required citizen fields
- **Expected Status:** 201
- **Expected Response:** User created with is_approved=False

#### TC-SIGNUP-002: Duplicate Email Signup
- **Test Name:** Signup with existing email
- **Endpoint:** POST /auth/signup/
- **Input:** Email already in database
- **Expected Status:** 400
- **Expected Response:** "User with this email already exists"

#### TC-SIGNUP-003: Weak Password
- **Test Name:** Signup with weak password
- **Endpoint:** POST /auth/signup/
- **Input:** Password: "123456"
- **Expected Status:** 400
- **Expected Response:** Password validation errors

#### TC-SIGNUP-004: Missing Town Selection
- **Test Name:** Signup without town
- **Endpoint:** POST /auth/signup/
- **Input:** Missing townId
- **Expected Status:** 400
- **Expected Response:** "Town is required"

#### TC-SIGNUP-005: Invalid Town ID
- **Test Name:** Signup with non-existent town
- **Endpoint:** POST /auth/signup/
- **Input:** townId: 99999
- **Expected Status:** 400
- **Expected Response:** "Invalid or inactive town"

#### TC-SIGNUP-006: Successful Business Signup
- **Test Name:** Complete business registration
- **Endpoint:** POST /auth/signup/
- **Input:** All required business fields
- **Expected Status:** 201
- **Expected Response:** Business profile created

#### TC-SIGNUP-007: Signup Rate Limiting
- **Test Name:** Multiple signup attempts
- **Endpoint:** POST /auth/signup/
- **Input:** 6 signup attempts in 1 hour
- **Expected Status:** 429
- **Expected Response:** Rate limit exceeded

---

### 3.3 User Approval API Tests

#### TC-APPROVAL-001: Government Lists Pending Users
- **Test Name:** Government can see pending users
- **Endpoint:** GET /auth/pending-users/
- **Input:** Government official token
- **Expected Status:** 200
- **Expected Response:** Array of pending users

#### TC-APPROVAL-002: Citizen Cannot View Pending Users
- **Test Name:** Permission check for approval endpoint
- **Endpoint:** GET /auth/pending-users/
- **Input:** Citizen token
- **Expected Status:** 403
- **Expected Response:** "Only government officials can view pending users"

#### TC-APPROVAL-003: Approve User
- **Test Name:** Government approves citizen
- **Endpoint:** POST /auth/approve-user/10/
- **Input:** Valid user ID
- **Expected Status:** 200
- **Expected Response:** User approved, token returned

#### TC-APPROVAL-004: Approval Updates Database
- **Test Name:** Verify approval updates user profile
- **Endpoint:** POST /auth/approve-user/<id>/
- **Expected:** is_approved=True, approved_by set, approved_at set

#### TC-APPROVAL-005: Approve User From Different Town
- **Test Name:** Government can only approve their town users
- **Endpoint:** POST /auth/approve-user/<id>/
- **Input:** User from different town
- **Expected Status:** 403
- **Expected Response:** "You can only approve users from your town"

---

### 3.4 Town Management API Tests

#### TC-TOWN-001: List Active Towns
- **Test Name:** Get all towns
- **Endpoint:** GET /towns/active/
- **Expected Status:** 200
- **Expected Response:** Array of active towns

#### TC-TOWN-002: Create Town Change Request
- **Test Name:** Submit town change
- **Endpoint:** POST /towns/change-request/
- **Input:** Valid town change data
- **Expected Status:** 201
- **Expected Response:** Request created

#### TC-TOWN-003: Duplicate Town Change Request
- **Test Name:** Prevent duplicate requests
- **Endpoint:** POST /towns/change-request/
- **Input:** Existing pending request
- **Expected Status:** 400
- **Expected Response:** "Already have a pending request"

#### TC-TOWN-004: Government Views Requests
- **Test Name:** Government sees their town's requests
- **Endpoint:** GET /towns/change-requests/
- **Input:** Government token
- **Expected Status:** 200
- **Expected Response:** Requests filtered by town

---

### 3.5 Integration Tests

#### TC-INT-001: Complete Signup-to-Login Flow
1. Signup → Status: 201 Created
2. Check is_approved = False
3. Government approves → Status: 200
4. Login → Status: 200 with token

#### TC-INT-002: Town Change Workflow
1. Request town change → Status: 201
2. Current town approves → Status: 200
3. New town approves → Status: 200
4. Verify user's town updated

#### TC-INT-003: Rejection Flow
1. Submit signup
2. Government rejects → Status: 200
3. Verify user removed from database
4. Login attempt fails → Status: 401

---

## 4. EXTERNAL TEAM REQUIREMENTS

### 4.1 Email Service Team

**Required APIs for Future Integration:**

#### POST /external/email/send
**Purpose:** Send transactional emails
**Need:** 
- Approval notifications
- Town change confirmations
- Password reset emails
- Weekly digests

#### GET /external/email/status/<email_id>
**Purpose:** Check delivery status
**Need:** 
- Verify notification delivery
- Retry failed sends
- Track open rates

---

### 4.2 Address Verification Service

**Required APIs for Future Integration:**

#### POST /external/address/verify
**Purpose:** Validate billing addresses
**Request:**
```json
{
  "street": "123 Main St",
  "city": "Secaucus",
  "state": "NJ",
  "zip": "07094"
}
```
**Need:**
- Verify address exists
- Validate ZIP code matches town
- Geocode coordinates

#### GET /external/address/normalize
**Purpose:** Standardize address format
**Need:**
- Consistent address storage
- International address formats

---

### 4.3 Payment Gateway (Future)

**Required APIs for License Fees:**

#### POST /external/payment/process
**Purpose:** Process license fees
**Need:**
- Business license payments
- Permit application fees
- Renewal charges

#### GET /external/payment/status/<transaction_id>
**Purpose:** Check payment status
**Need:**
- Verify payment success
- Handle refunds

---

## 5. USER INTERFACE OVERVIEW

### 5.1 Current Implementation Status

#### ✅ Completed Frontend Pages

**Landing Page (`/`)**
- Hero section with value proposition
- Feature highlights
- User type selection cards
- Call-to-action buttons
- Responsive design

**Signup Page (`/signup`)**
- Multi-step registration form
- Dynamic town dropdown (fetched from API)
- Structured address fields:
  - Street Address
  - Apt/Suite (optional)
  - City
  - State
  - ZIP Code
- Role-specific fields
- Form validation
- Error handling

**Login Page (`/login`)**
- Email/password authentication
- User type selection
- Remember me option
- Forgot password link (placeholder)

**Pending Approval Page (`/pending-approval`)**
- Status message
- Estimated approval timeline
- What to expect checklist
- Contact support link

#### 🚧 In Progress

**Citizen Portal (`/citizen`)**
- Dashboard structure created
- Navigation implemented
- Placeholder for complaint submission
- Service request forms (skeleton)

**Business Portal (`/business`)**
- Dashboard layout
- License management interface (placeholder)
- Application forms (skeleton)

**Government Portal (`/government`)**
- Admin dashboard
- User approval interface (API ready)
- Complaint management (API pending)
- Reports section (design complete)

### 5.2 UI Components Library

Using shadcn/ui components:
- **Card** - Content containers
- **Button** - Action buttons (variants: default, outline, ghost)
- **Input** - Form inputs
- **Label** - Form labels
- **Select** - Dropdown selection
- **Checkbox** - Boolean inputs
- **Textarea** - Multi-line text
- **Badge** - Status indicators

### 5.3 Design System

**Colors:**
- Primary: Blue (Citizen portal)
- Secondary: Green (Business portal)
- Accent: Purple (Government portal)
- Gray: Neutral elements

**Typography:**
- Headings: Bold, Inter font
- Body: Regular, 16px base
- Small text: 14px for labels

**Spacing:**
- Consistent padding: 16px, 24px, 32px
- Card spacing: 24px
- Form field spacing: 16px

### 5.4 Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

---

## 6. SPRINT 2 STORIES STATUS

### 6.1 Completed Stories

#### ✅ Story 1: Town-Based User Registration
**Priority:** High  
**Status:** Complete  
**Acceptance Criteria Met:**
- [x] Users select town during signup
- [x] Town dropdown populated from database
- [x] Billing address captured in structured format
- [x] Town validation implemented
- [x] Frontend integration complete

**Technical Implementation:**
- API endpoint: `GET /towns/active/`
- Town selection in signup form
- JSON billing address storage

---

#### ✅ Story 2: User Approval Workflow
**Priority:** High  
**Status:** Complete  
**Acceptance Criteria Met:**
- [x] Citizens/businesses require approval
- [x] Government can list pending users
- [x] Approve/reject functionality
- [x] Pending approval page created
- [x] Login blocks unapproved users

**Technical Implementation:**
- API endpoints: `/auth/pending-users/`, `/auth/approve-user/`, `/auth/reject-user/`
- Frontend: Pending approval page
- Login validation updated

---

#### ✅ Story 3: REST API Security
**Priority:** High  
**Status:** Complete  
**Acceptance Criteria Met:**
- [x] Rate limiting implemented
- [x] Input validation with serializers
- [x] Permission-based access control
- [x] Security headers configured
- [x] Password strength validation

**Technical Implementation:**
- Custom permission classes
- Serializers for validation
- Throttling on all endpoints
- Security documentation created

---

#### ✅ Story 4: Town Isolation Foundation
**Priority:** High  
**Status:** Complete  
**Acceptance Criteria Met:**
- [x] Town field added to all profiles
- [x] Foreign key relationships established
- [x] Permissions for town-based access
- [x] Database migrations applied

**Technical Implementation:**
- Models updated with town relationships
- Permission classes created
- Foundation for data filtering

---

### 6.2 In Progress Stories

#### 🚧 Story 5: Town Change Request System
**Priority:** Medium  
**Status:** 85% Complete  
**Acceptance Criteria:**
- [x] Backend API complete
- [x] Two-step approval logic
- [ ] Frontend town change UI (in progress)
- [ ] Profile page integration (pending)

**Remaining Work:**
- Add town change section to profile page
- Display pending requests
- Show status updates

---

### 6.3 Planned for Future Sprints

#### ⏳ Story 6: Government Admin Dashboard
**Priority:** High  
**Status:** Planned  
**User Stories:**
- View pending users
- Approve/reject functionality (API ready)
- Manage complaints
- Create announcements

#### ⏳ Story 7: Citizen Complaint System
**Priority:** High  
**Status:** Planned  
**User Stories:**
- Submit complaints
- Track status
- View responses
- Upload documents

#### ⏳ Story 8: Business License Management
**Priority:** Medium  
**Status:** Planned  
**User Stories:**
- Apply for licenses
- Track application status
- Renew existing licenses
- Payment integration (external team)

---

## 7. PIVOTAL TRACKER INFORMATION

### 7.1 Project Details

**Project Name:** TownHall - Digital Town Hall Platform  
**Project Type:** Web Development  
**Tracker URL:** [Add your Pivotal Tracker URL here]  
**Example:** `https://www.pivotaltracker.com/n/projects/1234567`

---

### 7.2 Agile Artifacts Tracked

#### Epic: User Management
- Story 1: Town-Based Registration ✅
- Story 2: Approval Workflow ✅
- Story 3: User Profile Management ⏳

#### Epic: Security & Infrastructure  
- Story 1: API Security Implementation ✅
- Story 2: Authentication System ✅
- Story 3: Rate Limiting ✅

#### Epic: Town Management
- Story 1: Town Selection System ✅
- Story 2: Town Change Requests 🚧
- Story 3: Town Data Isolation ✅

#### Epic: Government Portal
- Story 1: Admin Dashboard ⏳
- Story 2: User Approval Interface ✅
- Story 3: Complaint Management ⏳

#### Epic: Citizen Portal
- Story 1: Complaint Submission ⏳
- Story 2: Service Requests ⏳
- Story 3: Announcement Feed ⏳

#### Epic: Business Portal
- Story 1: License Applications ⏳
- Story 2: Permit Management ⏳
- Story 3: Business Profile ⏳

---

### 7.3 Velocity Tracking

**Sprint 1:** 8 story points completed  
**Sprint 2:** 25 story points completed (current)

**Sprint 2 Breakdown:**
- Backend API: 15 points
- Security Implementation: 5 points
- Frontend Integration: 5 points

---

### 7.4 Burndown Chart Data

**Week 1:** 15 points remaining  
**Week 2:** 10 points remaining  
**Week 3:** 5 points remaining  
**Week 4 (Current):** Sprint completion expected

---

## 8. ARCHITECTURE DIAGRAMS

### 8.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │  TypeScript  │  │  Tailwind   │      │
│  │   (React)    │  │              │  │     CSS     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (Django)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Django     │  │      DRF     │  │  Auth Token │      │
│  │  REST API    │  │  Serializers │  │   Security  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                            │
│  Apps: Authentication │ Citizen │ Business │ Government │ Towns│
└─────────────────────────────────────────────────────────────┘
                            │
                            │ ORM Queries
                            │
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                  │
│                                                            │
│  Tables: Users │ UserProfiles │ Towns │ CitizenProfiles │   │
│            BusinessProfiles │ GovernmentOfficials         │
│            Complaints │ Licenses │ Announcements         │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.2 Data Flow Diagram

```
User Registration Flow:
┌──────┐    POST     ┌──────────┐
│User  │─────────────▶│ Signup   │
└──────┘             │Endpoint  │
                     └────┬─────┘
                          │
                          ▼
                     ┌──────────┐
                     │ Validate │
                     │  Input   │
                     └────┬─────┘
                          │
                          ▼
                     ┌──────────┐
                     │ Create   │
                     │  User    │
                     └────┬─────┘
                          │
                          ▼
                     ┌──────────┐
                     │  is_     │
                     │ approved │
                     │ = False  │
                     └────┬─────┘
                          │
                          ▼
                     ┌──────────┐
                     │Gov views │
                     │  pending │
                     └────┬─────┘
                          │
                          ▼
                     ┌──────────┐
                     │ Approve  │
                     │   User   │
                     └────┬─────┘
                          │
                          ▼
                     ┌──────────┐
                     │  Token   │
                     │ Created  │
                     └──────────┘
```

---

### 8.3 Entity Relationship Diagram

```
User ────1:1──── UserProfile
 │                    │
 │                    ├───────── town (FK to Town)
 │                    │
 │                    ├───────── is_approved
 │                    │
 │                    ├───────── role
 │                    │
 │                    └───────── approved_by (FK to User)
 │
 ├──────── 1:1 ────── CitizenProfile ───1:N─── CitizenComplaint
 │                                      │
 │                                      ├─── CitizenFeedback
 │                                      │
 ├──────── 1:1 ────── BusinessOwnerProfile ───1:N─── BusinessLicense
 │                                                    │
 │                                                    ├─── BusinessComplaint
 │                                                    │
 │                                                    └─── BusinessFeedback
 │
 ├──────── 1:1 ────── GovernmentOfficial ───1:N─── ComplaintResponse
 │                  │
 │                  ├─── town (FK to Town)
 │                  │
 │                  └─── N:1 Department ───1:N─── Service
                                                      │
                                                      └─── Announcement
Town ────1:N──── TownChangeRequest
```

---

## 9. TECHNICAL SPECIFICATIONS

### 9.1 Database Schema

**Database Type:** PostgreSQL (MySQL compatible)  
**ORM:** Django ORM  
**Migrations:** Automatic via Django migrations  
**Backup:** Automated daily backups recommended

### 9.2 API Rate Limits

- **Anonymous users:** 100 requests/hour
- **Authenticated users:** 1000 requests/hour  
- **Login endpoint:** 5 requests/minute
- **Signup endpoint:** 5 requests/hour
- **General API:** 100 requests/minute

### 9.3 Security Features

- Token-based authentication
- Password hashing (PBKDF2)
- Rate limiting on all endpoints
- Input validation (serializers)
- Permission-based access control
- HTTPS enforcement (production)
- CORS configuration
- XSS and CSRF protection

### 9.4 Deployment

**Backend:**
- Django + Gunicorn
- PostgreSQL database
- Redis for caching (future)

**Frontend:**
- Next.js standalone build
- Static file hosting
- CDN for assets

---

## 10. DELIVERABLES CHECKLIST

- [x] Entities identified with attributes
- [x] API documentation with contracts
- [x] Test cases for API endpoints
- [x] External team integration requirements
- [x] User interface overview
- [x] Sprint 2 stories status
- [x] Pivotal Tracker link placeholder
- [x] Architecture diagrams
- [x] Technical specifications

---

## 11. PRESENTATION NOTES

### Key Points for Presentation

1. **Project Scope:** Full-stack application for digital town hall operations
2. **Technology Choice:** Django + Next.js for rapid development and scalability
3. **Security First:** All endpoints secured with rate limiting and validation
4. **Approval Workflow:** Ensures only legitimate residents join their town
5. **Town Isolation:** Data separation maintains privacy and organization
6. **RESTful Design:** Proper API design following industry best practices
7. **Scalable Architecture:** Ready for multi-town deployment
8. **Progressive Development:** Sprint-by-sprint feature delivery

---

## APPENDIX: CODE EXAMPLES

### API Call Example (Frontend)

```typescript
// Fetching active towns for signup dropdown
const fetchTowns = async () => {
  const response = await fetch('http://localhost:8000/api/towns/active/');
  const towns = await response.json();
  return towns;
};

// User signup with validation
const signup = async (formData) => {
  const response = await fetch('http://localhost:8000/api/auth/signup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (response.ok) {
    const data = await response.json();
    if (data.pending_approval) {
      router.push('/pending-approval');
    } else {
      // Store token and login
      localStorage.setItem('auth_token', data.token);
      router.push(`/${formData.userType}`);
    }
  }
};
```

### Backend Permission Example

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsGovernmentOfficial])
def list_pending_users(request):
    """Only government officials can view"""
    profile = UserProfile.objects.get(user=request.user)
    pending = UserProfile.objects.filter(
        town=profile.town,
        is_approved=False
    )
    return Response(serialize_pending(pending))
```

---

**END OF PROJECT ASSIGNMENT 2 DELIVERABLES**

