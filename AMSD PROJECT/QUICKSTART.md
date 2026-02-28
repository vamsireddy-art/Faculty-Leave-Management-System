# Quick Start Guide - FLMS

This guide will help you get the Faculty Leave Management System running quickly.

## 🚀 Quick Setup (5 Minutes)

### Step 1: Prerequisites Check
```bash
# Check Node.js installation
node --version
# Should show v14 or higher

# Check MongoDB installation
mongod --version
# Should show v4.4 or higher

# Check npm installation
npm --version
```

### Step 2: Start MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod

# Or manually
mongod
```

### Step 3: Backend Setup
```bash
# Open terminal in project root
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# Edit .env file with your settings (use notepad/vim/nano)
notepad .env              # Windows
nano .env                 # macOS/Linux

# Start backend server
npm run dev
```

**Backend will start on:** `http://localhost:5000`

### Step 4: Frontend Setup (New Terminal)
```bash
# Open new terminal in project root
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

**Frontend will start on:** `http://localhost:3000`

---

## 🔑 Default Test Credentials

### Admin Account
```
Email: admin@flms.com
Password: admin123
```

### Faculty Account
```
Email: faculty@flms.com
Password: faculty123
```

**Note:** You'll need to create these accounts first using the registration API endpoint.

---

## 📝 Creating Test Data

### 1. Create a Department (Using Postman/Thunder Client)

```http
POST http://localhost:5000/api/departments
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Computer Science",
  "code": "CS",
  "description": "Computer Science Department"
}
```

### 2. Register Admin User (First User)

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@flms.com",
  "password": "admin123",
  "role": "admin",
  "department": "<department_id_from_step_1>",
  "employeeId": "EMP001"
}
```

### 3. Login and Get Token

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@flms.com",
  "password": "admin123"
}
```

Copy the token from response!

### 4. Create Faculty User (As Admin)

```http
POST http://localhost:5000/api/auth/register
Authorization: Bearer <admin_token_from_step_3>
Content-Type: application/json

{
  "name": "Faculty User",
  "email": "faculty@flms.com",
  "password": "faculty123",
  "role": "faculty",
  "department": "<department_id>",
  "employeeId": "EMP002"
}
```

---

## 🎯 Testing the Application

### As Faculty:
1. Login with faculty credentials
2. Check leave balance on dashboard
3. Apply for leave (Leaves → Apply Leave)
4. View leave history
5. Check notifications

### As Admin:
1. Login with admin credentials
2. View dashboard statistics
3. Check pending leaves
4. Approve/Reject leave requests
5. Manage faculty and departments

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
```bash
# Make sure MongoDB is running
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Issue 2: Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue 3: Module Not Found
**Error:** `Cannot find module`

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Email Not Sending
**Solution:**
- Check SMTP credentials in .env
- For Gmail: Enable "App Passwords" in Google Account settings
- Test with a different email provider

### Issue 5: JWT Token Invalid
**Solution:**
- Make sure JWT_SECRET in .env is set
- Clear localStorage in browser (F12 → Application → Local Storage)
- Login again

---

## 📦 Production Deployment Checklist

- [ ] Update JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB database
- [ ] Configure CORS for specific origins
- [ ] Enable HTTPS
- [ ] Set up proper email service (SendGrid/AWS SES)
- [ ] Add rate limiting
- [ ] Set up logging (Winston/Morgan)
- [ ] Configure firewall rules
- [ ] Set up monitoring (PM2/Forever)

---

## 🔄 Development Workflow

```bash
# Start backend in watch mode
cd backend
npm run dev

# Start frontend in development mode
cd frontend
npm start

# Both will auto-reload on file changes
```

---

## 📧 Email Setup Guide

### Gmail Setup:
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password
4. Use App Password in .env file

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_digit_app_password
```

### Other Email Providers:
- **Outlook:** smtp-mail.outlook.com (Port: 587)
- **Yahoo:** smtp.mail.yahoo.com (Port: 587)
- **SendGrid:** smtp.sendgrid.net (Port: 587)

---

## 🎓 For Viva Preparation

### Key Points to Remember:

**1. Architecture:**
- Frontend: React.js (User Interface)
- Backend: Node.js + Express.js (API)
- Database: MongoDB (Data Storage)

**2. Key Features:**
- JWT Authentication
- Role-Based Access Control
- Email Notifications
- Real-time Leave Balance
- RESTful API Design

**3. Security:**
- Password hashing (bcrypt)
- JWT tokens (stateless auth)
- Protected routes
- Input validation

**4. Why MERN Stack:**
- JavaScript everywhere
- Fast development
- Scalable architecture
- Rich ecosystem

---

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Review the API documentation
3. Check MongoDB logs
4. Verify environment variables

---

## 🎉 You're All Set!

Your Faculty Leave Management System should now be running!

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/

Happy coding! 🚀
