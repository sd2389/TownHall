# Security Implementation - TownHall REST API

## Overview
This document outlines the security measures implemented in the TownHall REST API.

## Authentication & Authorization

### Token-Based Authentication
- **Method**: Django REST Framework Token Authentication
- **Endpoints**: All API endpoints except public signup/login
- **Token Storage**: HttpOnly cookies (frontend) / Token header (API clients)

### Role-Based Access Control (RBAC)
- **Citizen**: Can view/access only their own town's data
- **Business**: Can view/access only their own town's data
- **Government**: Can view/approve users from their assigned town
- **Superuser**: Has full access across all towns (for admin panel)

### Custom Permission Classes
Located in `authentication/permissions.py`:
- `IsGovernmentOfficial`: Ensures only government officials can approve users
- `IsSameTown`: Ensures users can only access data from their town
- `IsGovernmentOfTown`: Ensures government can only manage their town
- `IsApprovedOrReadOnly`: Restricts write access to approved users only

## Input Validation

### Serializers
- **LoginSerializer**: Validates email, password, and user type
- **SignupSerializer**: Comprehensive validation of all signup fields
- **Password Validation**: Uses Django's built-in password validators
- **Email Validation**: Checks for existing users
- **Business Logic Validation**: Role-specific field requirements

### Validation Features
- Email format validation
- Password strength requirements (8+ characters, complexity)
- Required fields enforcement
- Type checking (integers, dates, URLs, etc.)
- Business-specific validation (business name required for business accounts)

## Rate Limiting & Throttling

### Throttle Classes
- **LoginThrottle**: 5 attempts per minute
- **SignupThrottle**: 5 attempts per hour
- **ApiThrottle**: 100 requests per minute (general API)

### Rate Limits Applied
```
'anon': '100/hour',        # Anonymous users
'user': '1000/hour',       # Authenticated users
'login': '5/minute',       # Login endpoint
'signup': '5/hour',        # Signup endpoint
'api': '100/minute'        # General API endpoints
```

## Data Isolation

### Town-Based Isolation
- All data queries filtered by user's town
- Citizen complaints only visible within their town
- Business data restricted to business's town
- Government officials limited to their assigned town
- Town change requests require two-step approval

### Database-Level Security
- Foreign key constraints ensure data integrity
- Cascade deletions prevent orphaned records
- Transaction atomicity for multi-step operations
- Prepared statements prevent SQL injection

## Security Headers (Production)

```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
```

## CORS Configuration

### Allowed Origins
- Development: `http://localhost:3000`, `http://127.0.0.1:3000`
- Production: To be configured based on deployment

### CORS Settings
- Credentials allowed for authenticated requests
- Only specified origins can access the API

## Secure Password Storage

- **Method**: Django's default password hasher (PBKDF2)
- **Salt**: Automatic per-user salt generation
- **Iterations**: Configurable via Django settings

## API Security Best Practices

### 1. Proper HTTP Methods
- **GET**: Read-only operations (list, retrieve)
- **POST**: Create operations (signup, login, approvals)
- **PUT/PATCH**: Update operations (profile updates)
- **DELETE**: Remove operations (with proper authorization checks)

### 2. Error Handling
- Consistent error response format
- No sensitive information leaked in errors
- Proper HTTP status codes
- Detailed validation error messages for debugging

### 3. Logging & Monitoring
- Failed login attempts logged
- Approval/rejection actions logged
- Town change requests tracked with timestamps
- Superuser actions logged

### 4. Data Validation
- Input sanitization
- SQL injection prevention (Django ORM)
- XSS prevention (template auto-escaping)
- CSRF protection enabled

## Approval Workflow

### Citizen/Business Signup
1. User submits registration with town selection
2. Account created with `is_approved=False`
3. Government officials receive notification
4. Government approves/rejects from their portal
5. Upon approval, token created and user notified
6. User can now login and access their portal

### Town Change Requests
1. User requests town change with billing address
2. Request approved by current town's government
3. Request approved by requested town's government
4. User's town updated automatically
5. User receives email confirmation

## Database Security

### Foreign Key Integrity
All relationships use proper foreign keys to maintain referential integrity.

### Transaction Atomicity
Critical operations (signup, approval, town changes) wrapped in transactions to ensure all-or-nothing success.

## Security Considerations

### TODO
- [ ] Implement audit logging for sensitive operations
- [ ] Add IP-based rate limiting
- [ ] Implement two-factor authentication (optional)
- [ ] Add email verification for account creation
- [ ] Implement session timeout for inactive users
- [ ] Add CAPTCHA for signup endpoint (optional)
- [ ] Database backup and recovery procedures
- [ ] Regular security audits

## Testing Security

### Recommended Testing
1. Test rate limiting on all endpoints
2. Test permission checks on restricted endpoints
3. Test input validation with malicious data
4. Test town isolation (user A cannot access user B's data)
5. Test approval workflow end-to-end
6. Test concurrent access scenarios

## Deployment Security Checklist

- [ ] Enable HTTPS in production
- [ ] Configure environment variables securely
- [ ] Use strong SECRET_KEY
- [ ] Disable DEBUG mode
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Set up firewall rules
- [ ] Implement database backup strategy
- [ ] Set up monitoring and alerting
- [ ] Regular dependency updates
- [ ] Security headers enabled

