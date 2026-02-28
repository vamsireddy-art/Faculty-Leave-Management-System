# Faculty Leave Management System - Complete Setup Guide

## 🚀 Quick Start

The project is now fully configured and running!

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## 🔑 TEST CREDENTIALS

### **Admin Account**
```
Email: admin@flms.com
Password: admin123
```

**Admin Capabilities:**
- View and manage all leave requests
- Approve/reject leave applications
- View all faculty members
- Manage departments
- Generate reports

### **Faculty Account 1**
```
Email: faculty@flms.com
Password: faculty123
```

### **Faculty Account 2**
```
Email: john.doe@flms.com
Password: john123
```

**Faculty Capabilities:**
- Apply for leave
- View leave history
- Check leave balance
- View notifications

---

## 📋 Project Structure

```
AMSD PROJECT/
├── backend/                 # Node.js/Express Backend
│   ├── config/             # Database & Email configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & validation middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   ├── .env                # Environment variables
│   ├── server.js           # Server entry point
│   └── seed.js             # Database seeder
│
├── frontend/               # React Frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   └── package.json
│
└── Documentation files (README, API_ROUTES, etc.)
```

---

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Toastify** - Notifications

---

## 🔧 Setup Instructions (Already Completed)

### Prerequisites
✅ Node.js (v14 or higher) - Installed
✅ MongoDB - Installed and running
✅ npm or yarn - Installed

### Installation Steps

#### 1. Backend Setup ✅
```bash
cd backend
npm install
```

#### 2. Frontend Setup ✅
```bash
cd frontend
npm install
```

#### 3. Database Seeding ✅
```bash
cd backend
npm run seed
```

#### 4. Start Backend Server ✅
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

#### 5. Start Frontend Server ✅
```bash
cd frontend
npm start
# Application running on http://localhost:3000
```

---

## 🎯 How to Use the Application

### For Faculty:
1. **Login** at http://localhost:3000/login
2. Use faculty credentials (faculty@flms.com / faculty123)
3. **Dashboard** - View your leave statistics and recent leaves
4. **Apply Leave** - Submit new leave applications
5. **Leave History** - View status of all your leave requests
6. **Notifications** - Check updates on your applications

### For Admin:
1. **Login** at http://localhost:3000/login
2. Use admin credentials (admin@flms.com / admin123)
3. **Dashboard** - Overview of all leave requests
4. **Manage Leaves** - Approve or reject pending requests
5. **Faculty Management** - Manage faculty accounts
6. **Reports** - Generate leave reports

---

## 📁 Database Schema

### Collections:
1. **users** - Faculty and admin users
2. **departments** - Academic departments
3. **leaves** - Leave applications
4. **leavebalances** - Track available leaves
5. **notifications** - User notifications

---

## 🔐 Environment Variables

The `.env` file in backend/ contains:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/faculty_leave_management
JWT_SECRET=flms_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
```

---

## 🐛 Troubleshooting

### Login Issues
✅ **RESOLVED** - Database has been seeded with test users
✅ All credentials are working properly

### MongoDB Connection Issues
If you see MongoDB connection errors:
```bash
# Check if MongoDB is running
Get-Service -Name "MongoDB"

# Start MongoDB if not running
Start-Service -Name "MongoDB"
```

### Port Already in Use
If port 3000 or 5000 is in use:
```bash
# Kill process on port 5000 (Backend)
npx kill-port 5000

# Kill process on port 3000 (Frontend)
npx kill-port 3000
```

### Clear Database and Reseed
If you need to reset the database:
```bash
cd backend
npm run seed
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatepassword` - Update password

### Leaves
- `GET /api/leaves` - Get all leaves
- `POST /api/leaves` - Apply for leave
- `PUT /api/leaves/:id/status` - Update leave status (Admin)
- `GET /api/leaves/stats` - Get leave statistics

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/:id/balance` - Get leave balance

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department (Admin)
- `PUT /api/departments/:id` - Update department (Admin)

---

## ✅ Features

### Faculty Features
- ✅ Apply for different types of leave (Casual, Sick, Earned)
- ✅ View leave history with status
- ✅ Check available leave balance
- ✅ Receive notifications for status updates
- ✅ Dashboard with leave statistics

### Admin Features
- ✅ View all pending leave requests
- ✅ Approve or reject leave applications
- ✅ Manage faculty members
- ✅ View department-wise reports
- ✅ Track leave patterns
- ✅ Send notifications to faculty

### Security Features
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Token expiration handling

---

## 🎨 UI Features

- Responsive design (works on mobile, tablet, desktop)
- Bootstrap 5 styling
- Real-time notifications with toast messages
- Interactive charts and graphs
- Clean and intuitive interface
- Bootstrap Icons for visual elements

---

## 🚀 Production Deployment

### Backend
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use a secure `JWT_SECRET`
4. Configure MongoDB Atlas for cloud database
5. Deploy to Heroku, AWS, or similar

### Frontend
1. Update API endpoints in `services/api.js`
2. Run `npm run build`
3. Deploy build folder to Netlify, Vercel, or similar

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation in `API_ROUTES.md`
3. Check database schema in `DATABASE_SCHEMA.md`

---

## 🎉 Success!

Your Faculty Leave Management System is now fully operational!

**Next Steps:**
1. Open http://localhost:3000 in your browser
2. Login with the test credentials provided above
3. Explore the features as both faculty and admin

**Remember:** 
- Backend runs on port 5000
- Frontend runs on port 3000  
- MongoDB must be running for the application to work

---

## 📄 License

This project is for educational/internal use.

---

**Created:** February 2026
**Status:** ✅ Fully Operational
