# Faculty Leave Management System (FLMS)

A comprehensive full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for managing faculty leave applications in educational institutions.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

## ✨ Features

### Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Faculty & Admin)
- Password hashing using bcrypt
- Protected routes on frontend and backend

### Faculty Features
- ✅ Apply for leave with multiple leave types
- ✅ View leave balance in real-time
- ✅ Track leave history with filters
- ✅ Receive email notifications for leave status
- ✅ Delete pending leave applications
- ✅ View personal profile

### Admin Features
- ✅ View all leave applications
- ✅ Approve or reject leave requests
- ✅ Manage faculty accounts
- ✅ Manage departments
- ✅ View leave statistics and reports
- ✅ Update leave balances
- ✅ Dashboard with key metrics

### Notification System
- Email notifications using NodeMailer
- In-app notification center
- Real-time notification badges
- Notifications for:
  - Leave application submission
  - Leave approval
  - Leave rejection

### Leave Management
- Multiple leave types: Casual, Sick, Earned, Maternity, Paternity, Compensatory
- Automatic leave balance calculation
- Date validation
- Leave history tracking
- Status tracking (Pending, Approved, Rejected)

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **NodeMailer** - Email notifications
- **express-validator** - Request validation

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Chart.js** - Data visualization
- **Bootstrap Icons** - Icons

## 📁 Project Structure

```
AMSD PROJECT/
│
├── backend/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   └── email.js           # Email configuration
│   │
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── leaveController.js     # Leave management logic
│   │   ├── userController.js      # User management logic
│   │   ├── departmentController.js # Department logic
│   │   └── notificationController.js # Notification logic
│   │
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & authorization
│   │   ├── errorHandler.js    # Error handling
│   │   └── validator.js       # Request validation
│   │
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Leave.js           # Leave schema
│   │   ├── LeaveBalance.js    # Leave balance schema
│   │   ├── Department.js      # Department schema
│   │   └── Notification.js    # Notification schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── leaveRoutes.js     # Leave routes
│   │   ├── userRoutes.js      # User routes
│   │   ├── departmentRoutes.js # Department routes
│   │   └── notificationRoutes.js # Notification routes
│   │
│   ├── utils/
│   │   ├── jwt.js             # JWT utilities
│   │   └── notificationService.js # Notification service
│   │
│   ├── .env.example           # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    │
    ├── src/
    │   ├── components/
    │   │   ├── Navigation.js      # Navigation bar
    │   │   └── PrivateRoute.js    # Route protection
    │   │
    │   ├── context/
    │   │   └── AuthContext.js     # Authentication context
    │   │
    │   ├── pages/
    │   │   ├── Login.js           # Login page
    │   │   ├── FacultyDashboard.js # Faculty dashboard
    │   │   ├── AdminDashboard.js   # Admin dashboard
    │   │   ├── ApplyLeave.js      # Leave application form
    │   │   ├── LeaveHistory.js    # Leave history
    │   │   ├── ManageLeaves.js    # Admin leave management
    │   │   └── Notifications.js   # Notifications page
    │   │
    │   ├── services/
    │   │   └── api.js             # API service layer
    │   │
    │   ├── App.js                 # Main app component
    │   ├── App.css                # Global styles
    │   └── index.js               # Entry point
    │
    ├── .gitignore
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/faculty_leave_management
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@flms.com
CLIENT_URL=http://localhost:3000
```

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Database Setup

1. Make sure MongoDB is running on your system

2. The application will automatically create the database and collections on first run

3. To create initial admin user, you can use the registration endpoint with admin credentials

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register (Admin Only)
```http
POST /auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "faculty",
  "department": "departmentId",
  "employeeId": "EMP001"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Leave Endpoints

#### Apply for Leave
```http
POST /leaves
Authorization: Bearer <token>
Content-Type: application/json

{
  "leaveType": "Casual",
  "fromDate": "2024-12-25",
  "toDate": "2024-12-27",
  "reason": "Personal work"
}
```

#### Get All Leaves
```http
GET /leaves
Authorization: Bearer <token>
Query Parameters: status, leaveType, fromDate, toDate
```

#### Update Leave Status (Admin)
```http
PUT /leaves/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Approved",
  "rejectionReason": "Optional reason if rejected"
}
```

#### Delete Leave
```http
DELETE /leaves/:id
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users (Admin)
```http
GET /users
Authorization: Bearer <token>
Query Parameters: role, department, isActive
```

#### Get Leave Balance
```http
GET /users/:id/balance
Authorization: Bearer <token>
```

#### Update Leave Balance (Admin)
```http
PUT /users/:id/balance
Authorization: Bearer <token>
Content-Type: application/json

{
  "leaveType": "Casual",
  "total": 15
}
```

### Department Endpoints

#### Get All Departments
```http
GET /departments
Authorization: Bearer <token>
```

#### Create Department (Admin)
```http
POST /departments
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Computer Science",
  "code": "CS",
  "description": "Computer Science Department"
}
```

### Notification Endpoints

#### Get Notifications
```http
GET /notifications
Authorization: Bearer <token>
Query Parameters: isRead
```

#### Mark as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

## 👥 User Roles

### Faculty
- Can apply for leaves
- View personal leave history
- Check leave balance
- Receive notifications
- Update personal profile

### Admin (HOD)
- All faculty permissions
- Approve/Reject leave requests
- Manage faculty accounts
- Manage departments
- View reports and analytics
- Update leave balances
- Access dashboard statistics

## 🗄 Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (faculty/admin),
  department: ObjectId (ref: Department),
  phone: String,
  designation: String,
  employeeId: String (unique),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Leave Collection
```javascript
{
  faculty: ObjectId (ref: User),
  leaveType: String,
  fromDate: Date,
  toDate: Date,
  numberOfDays: Number,
  reason: String,
  status: String (Pending/Approved/Rejected),
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  rejectionReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### LeaveBalance Collection
```javascript
{
  faculty: ObjectId (ref: User),
  year: Number,
  casual: { total, used, available },
  sick: { total, used, available },
  earned: { total, used, available },
  maternity: { total, used, available },
  paternity: { total, used, available },
  compensatory: { total, used, available },
  createdAt: Date,
  updatedAt: Date
}
```

### Department Collection
```javascript
{
  name: String (unique),
  code: String (unique),
  hod: ObjectId (ref: User),
  description: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Collection
```javascript
{
  recipient: ObjectId (ref: User),
  sender: ObjectId (ref: User),
  type: String,
  title: String,
  message: String,
  relatedLeave: ObjectId (ref: Leave),
  isRead: Boolean,
  emailSent: Boolean,
  createdAt: Date
}
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing using bcrypt (salt rounds: 10)
- Protected API routes with middleware
- Role-based access control
- Input validation using express-validator
- CORS configuration
- Environment variable protection
- MongoDB injection prevention

## 📧 Email Configuration

The system uses **NodeMailer** for sending email notifications. To configure:

1. For Gmail, enable "Less secure app access" or use App Passwords
2. Update the `.env` file with your SMTP credentials
3. Email notifications are sent for:
   - Leave application submission (to Admin)
   - Leave approval (to Faculty)
   - Leave rejection (to Faculty)

## 🎯 Features Explanation for Viva

### Why MERN Stack?
- **MongoDB**: Flexible NoSQL database, perfect for storing varying leave data
- **Express.js**: Lightweight, fast backend framework
- **React.js**: Component-based UI for better maintainability
- **Node.js**: JavaScript everywhere (full-stack)

### Key Design Decisions
1. **JWT Authentication**: Stateless, scalable authentication
2. **Role-Based Access**: Different dashboards for faculty and admin
3. **Real-time Balance**: Automatic leave balance calculations
4. **Email Notifications**: Keep users informed
5. **Date Validation**: Prevent invalid leave applications
6. **RESTful API**: Standard, maintainable API design

### Scalability Features
- Modular code structure
- Reusable components
- Centralized API service
- Environment-based configuration
- Error handling middleware

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB service status

### Email Not Sending
- Check SMTP credentials
- Enable less secure apps (Gmail)
- Verify firewall settings

## 📝 License

This project is created for academic purposes as a final-year project.

## 👨‍💻 Author

Created by **[Your Name]** as a Final Year Project

## 🙏 Acknowledgments

- Built using the MERN stack
- Bootstrap for UI components
- React community for excellent libraries

---

**Note**: This is an academic project demonstrating full-stack development using the MERN stack. Suitable for college final year projects and demonstrations.
