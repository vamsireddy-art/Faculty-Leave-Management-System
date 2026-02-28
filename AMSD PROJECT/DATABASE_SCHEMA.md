# Database Schema Documentation

## MongoDB Collections and Schema Design

This document provides detailed information about all database collections and their relationships.

---

## Collections Overview

1. **users** - Stores faculty and admin user information
2. **departments** - Stores department information
3. **leaves** - Stores leave applications
4. **leavebalances** - Stores leave balance for each faculty
5. **notifications** - Stores notification messages

---

## 1. Users Collection

**Collection Name:** `users`

### Schema:
```javascript
{
  _id: ObjectId,
  name: String,              // Full name of the user
  email: String,             // Unique email address
  password: String,          // Hashed password (bcrypt)
  role: String,              // 'faculty' or 'admin'
  department: ObjectId,      // Reference to departments collection
  phone: String,             // Contact number
  designation: String,       // Job title/designation
  employeeId: String,        // Unique employee identifier
  isActive: Boolean,         // Account status
  createdAt: Date,           // Account creation date
  updatedAt: Date            // Last update date
}
```

### Indexes:
- `email` (unique)
- `employeeId` (unique, sparse)
- `department` (for faster department queries)

### Relationships:
- **department** → References `departments._id`
- Referenced by `leaves.faculty`
- Referenced by `leavebalances.faculty`
- Referenced by `notifications.recipient`

### Sample Document:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "password": "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
  "role": "faculty",
  "department": "65a1b2c3d4e5f6g7h8i9j0k2",
  "phone": "+1234567890",
  "designation": "Assistant Professor",
  "employeeId": "EMP001",
  "isActive": true,
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T08:00:00.000Z"
}
```

---

## 2. Departments Collection

**Collection Name:** `departments`

### Schema:
```javascript
{
  _id: ObjectId,
  name: String,              // Department name
  code: String,              // Short code (e.g., CS, IT)
  hod: ObjectId,             // Head of Department (User reference)
  description: String,       // Department description
  isActive: Boolean,         // Department status
  createdAt: Date,           // Creation date
  updatedAt: Date            // Last update date
}
```

### Indexes:
- `name` (unique)
- `code` (unique)

### Relationships:
- **hod** → References `users._id`
- Referenced by `users.department`

### Sample Document:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "name": "Computer Science",
  "code": "CS",
  "hod": "65a1b2c3d4e5f6g7h8i9j0k3",
  "description": "Department of Computer Science and Engineering",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 3. Leaves Collection

**Collection Name:** `leaves`

### Schema:
```javascript
{
  _id: ObjectId,
  faculty: ObjectId,         // Reference to users collection
  leaveType: String,         // Type of leave
  fromDate: Date,            // Leave start date
  toDate: Date,              // Leave end date
  numberOfDays: Number,      // Total days (auto-calculated)
  reason: String,            // Reason for leave
  status: String,            // 'Pending', 'Approved', 'Rejected'
  reviewedBy: ObjectId,      // Admin who reviewed (User reference)
  reviewedAt: Date,          // Review timestamp
  rejectionReason: String,   // Reason if rejected
  createdAt: Date,           // Application date
  updatedAt: Date            // Last update date
}
```

### Leave Types:
- Casual
- Sick
- Earned
- Maternity
- Paternity
- Compensatory

### Status Values:
- **Pending** - Newly created, awaiting review
- **Approved** - Approved by admin
- **Rejected** - Rejected by admin

### Indexes:
- `faculty` (for faster faculty queries)
- `status` (for filtering by status)
- Compound index: `{faculty: 1, status: 1, createdAt: -1}`

### Relationships:
- **faculty** → References `users._id`
- **reviewedBy** → References `users._id`
- Referenced by `notifications.relatedLeave`

### Sample Document:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
  "faculty": "65a1b2c3d4e5f6g7h8i9j0k1",
  "leaveType": "Casual",
  "fromDate": "2024-12-25T00:00:00.000Z",
  "toDate": "2024-12-27T00:00:00.000Z",
  "numberOfDays": 3,
  "reason": "Personal work",
  "status": "Approved",
  "reviewedBy": "65a1b2c3d4e5f6g7h8i9j0k3",
  "reviewedAt": "2024-12-20T10:30:00.000Z",
  "rejectionReason": null,
  "createdAt": "2024-12-18T09:00:00.000Z",
  "updatedAt": "2024-12-20T10:30:00.000Z"
}
```

---

## 4. LeaveBalances Collection

**Collection Name:** `leavebalances`

### Schema:
```javascript
{
  _id: ObjectId,
  faculty: ObjectId,         // Reference to users collection (unique)
  year: Number,              // Academic/Calendar year
  casual: {
    total: Number,           // Total casual leaves allocated
    used: Number,            // Used casual leaves
    available: Number        // Available casual leaves
  },
  sick: {
    total: Number,
    used: Number,
    available: Number
  },
  earned: {
    total: Number,
    used: Number,
    available: Number
  },
  maternity: {
    total: Number,
    used: Number,
    available: Number
  },
  paternity: {
    total: Number,
    used: Number,
    available: Number
  },
  compensatory: {
    total: Number,
    used: Number,
    available: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Default Allocations:
- **Casual:** 12 days/year
- **Sick:** 12 days/year
- **Earned:** 15 days/year
- **Maternity:** 180 days
- **Paternity:** 15 days
- **Compensatory:** 10 days/year

### Indexes:
- `faculty` (unique)

### Relationships:
- **faculty** → References `users._id`

### Sample Document:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
  "faculty": "65a1b2c3d4e5f6g7h8i9j0k1",
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
  },
  "maternity": {
    "total": 180,
    "used": 0,
    "available": 180
  },
  "paternity": {
    "total": 15,
    "used": 0,
    "available": 15
  },
  "compensatory": {
    "total": 10,
    "used": 0,
    "available": 10
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-12-20T10:30:00.000Z"
}
```

---

## 5. Notifications Collection

**Collection Name:** `notifications`

### Schema:
```javascript
{
  _id: ObjectId,
  recipient: ObjectId,       // User who receives notification
  sender: ObjectId,          // User who triggered notification
  type: String,              // Notification type
  title: String,             // Notification title
  message: String,           // Notification message
  relatedLeave: ObjectId,    // Related leave application
  isRead: Boolean,           // Read status
  emailSent: Boolean,        // Email sent status
  createdAt: Date            // Creation timestamp
}
```

### Notification Types:
- **leave_applied** - New leave application
- **leave_approved** - Leave approved
- **leave_rejected** - Leave rejected
- **system** - System notifications

### Indexes:
- Compound index: `{recipient: 1, isRead: 1, createdAt: -1}`

### Relationships:
- **recipient** → References `users._id`
- **sender** → References `users._id`
- **relatedLeave** → References `leaves._id`

### Sample Document:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
  "recipient": "65a1b2c3d4e5f6g7h8i9j0k3",
  "sender": "65a1b2c3d4e5f6g7h8i9j0k1",
  "type": "leave_applied",
  "title": "New Leave Application",
  "message": "John Doe has applied for Casual leave from 2024-12-25 to 2024-12-27",
  "relatedLeave": "65a1b2c3d4e5f6g7h8i9j0k4",
  "isRead": false,
  "emailSent": true,
  "createdAt": "2024-12-18T09:00:00.000Z"
}
```

---

## Entity Relationship Diagram

```
┌─────────────┐
│ Department  │
│             │
│ _id         │◄────┐
│ name        │     │
│ code        │     │
│ hod         │─────┼────┐
│ description │     │    │
└─────────────┘     │    │
                    │    │
┌─────────────┐     │    │
│   User      │     │    │
│             │     │    │
│ _id         │◄────┤    │
│ name        │     │    │
│ email       │     │    │
│ password    │     │    │
│ role        │     │    │
│ department  │─────┘    │
│ employeeId  │          │
└─────────────┘          │
      ▲                  │
      │                  │
      │                  │
      │                  │
┌─────┴────────┐         │
│    Leave     │         │
│              │         │
│ _id          │         │
│ faculty      │─────────┘
│ leaveType    │
│ fromDate     │
│ toDate       │
│ status       │
│ reviewedBy   │─────────┐
└──────────────┘         │
      ▲                  │
      │                  │
┌─────┴──────────┐       │
│ LeaveBalance   │       │
│                │       │
│ _id            │       │
│ faculty        │───────┤
│ casual         │       │
│ sick           │       │
│ earned         │       │
└────────────────┘       │
                         │
┌────────────────┐       │
│ Notification   │       │
│                │       │
│ _id            │       │
│ recipient      │───────┘
│ sender         │───────┐
│ relatedLeave   │       │
│ message        │       │
└────────────────┘       │
                         │
                     Back to User
```

---

## Database Best Practices

### Indexing Strategy:
1. Index frequently queried fields
2. Use compound indexes for multi-field queries
3. Add sparse indexes for optional unique fields

### Data Validation:
- Use Mongoose schema validation
- Validate dates before insertion
- Enforce referential integrity

### Performance Optimization:
- Use `populate()` judiciously
- Implement pagination for large datasets
- Use projections to limit fields returned

### Backup Strategy:
- Regular automated backups
- Test restore procedures
- Keep backups in separate location

---

## MongoDB Queries Examples

### Find all pending leaves for a department:
```javascript
db.leaves.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "faculty",
      foreignField: "_id",
      as: "facultyInfo"
    }
  },
  {
    $match: {
      "facultyInfo.department": departmentId,
      "status": "Pending"
    }
  }
])
```

### Get leave statistics by type:
```javascript
db.leaves.aggregate([
  {
    $group: {
      _id: "$leaveType",
      count: { $sum: 1 },
      totalDays: { $sum: "$numberOfDays" }
    }
  }
])
```

### Find users with low leave balance:
```javascript
db.leavebalances.find({
  $or: [
    { "casual.available": { $lt: 3 } },
    { "sick.available": { $lt: 3 } }
  ]
})
```

---

This schema design follows MongoDB best practices and is optimized for the Faculty Leave Management System requirements.
