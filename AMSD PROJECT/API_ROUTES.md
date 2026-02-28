# FLMS API Routes Reference

## Complete API Endpoints Documentation

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Admin | Register a new user |
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/me` | Private | Get current user profile |
| PUT | `/auth/updatepassword` | Private | Update password |
| POST | `/auth/logout` | Private | Logout user |

### Leave Routes (`/api/leaves`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/leaves` | Faculty | Apply for leave |
| GET | `/leaves` | Private | Get all leaves (role-based) |
| GET | `/leaves/stats` | Admin | Get leave statistics |
| GET | `/leaves/:id` | Private | Get single leave details |
| PUT | `/leaves/:id/status` | Admin | Approve/Reject leave |
| DELETE | `/leaves/:id` | Faculty | Delete pending leave |

### User Routes (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | Get all users |
| GET | `/users/:id` | Private | Get single user |
| PUT | `/users/:id` | Private | Update user profile |
| DELETE | `/users/:id` | Admin | Delete user |
| GET | `/users/:id/balance` | Private | Get leave balance |
| PUT | `/users/:id/balance` | Admin | Update leave balance |

### Department Routes (`/api/departments`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/departments` | Private | Get all departments |
| GET | `/departments/:id` | Private | Get single department |
| POST | `/departments` | Admin | Create department |
| PUT | `/departments/:id` | Admin | Update department |
| DELETE | `/departments/:id` | Admin | Delete department |

### Notification Routes (`/api/notifications`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/notifications` | Private | Get user notifications |
| PUT | `/notifications/:id/read` | Private | Mark notification as read |
| PUT | `/notifications/read-all` | Private | Mark all as read |
| DELETE | `/notifications/:id` | Private | Delete notification |

---

## Request/Response Examples

### 1. Login
**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "faculty@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "123456",
    "name": "John Doe",
    "email": "faculty@example.com",
    "role": "faculty",
    "department": {
      "_id": "dept123",
      "name": "Computer Science",
      "code": "CS"
    }
  }
}
```

### 2. Apply for Leave
**Request:**
```http
POST /api/leaves
Authorization: Bearer <token>
Content-Type: application/json

{
  "leaveType": "Casual",
  "fromDate": "2024-12-25",
  "toDate": "2024-12-27",
  "reason": "Family function"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Leave application submitted successfully",
  "leave": {
    "_id": "leave123",
    "faculty": "123456",
    "leaveType": "Casual",
    "fromDate": "2024-12-25T00:00:00.000Z",
    "toDate": "2024-12-27T00:00:00.000Z",
    "numberOfDays": 3,
    "reason": "Family function",
    "status": "Pending"
  }
}
```

### 3. Approve Leave (Admin)
**Request:**
```http
PUT /api/leaves/leave123/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Approved"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Leave approved successfully",
  "leave": {
    "_id": "leave123",
    "status": "Approved",
    "reviewedBy": "admin123",
    "reviewedAt": "2024-12-20T10:30:00.000Z"
  }
}
```

### 4. Reject Leave (Admin)
**Request:**
```http
PUT /api/leaves/leave123/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Rejected",
  "rejectionReason": "Insufficient notice period"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Leave rejected",
  "leave": {
    "_id": "leave123",
    "status": "Rejected",
    "rejectionReason": "Insufficient notice period",
    "reviewedBy": "admin123",
    "reviewedAt": "2024-12-20T10:30:00.000Z"
  }
}
```

### 5. Get Leave Balance
**Request:**
```http
GET /api/users/123456/balance
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "leaveBalance": {
    "_id": "balance123",
    "faculty": "123456",
    "year": 2024,
    "casual": {
      "total": 12,
      "used": 3,
      "available": 9
    },
    "sick": {
      "total": 12,
      "used": 2,
      "available": 10
    },
    "earned": {
      "total": 15,
      "used": 0,
      "available": 15
    }
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'faculty' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Query Parameters

### Get Leaves
- `status` - Filter by status (Pending/Approved/Rejected)
- `leaveType` - Filter by leave type
- `fromDate` - Filter from date
- `toDate` - Filter to date

**Example:**
```
GET /api/leaves?status=Pending&leaveType=Casual
```

### Get Users
- `role` - Filter by role (faculty/admin)
- `department` - Filter by department ID
- `isActive` - Filter by active status (true/false)

**Example:**
```
GET /api/users?role=faculty&isActive=true
```

### Get Notifications
- `isRead` - Filter by read status (true/false)

**Example:**
```
GET /api/notifications?isRead=false
```

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Token expires in 7 days by default (configurable in .env).

---

## Rate Limiting

Currently not implemented. Can be added using `express-rate-limit` for production.

## CORS

CORS is enabled for all origins in development. Configure for production in server.js.
