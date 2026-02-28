# 🔑 TEST CREDENTIALS

## Quick Access Credentials

### Admin Login
```
Email:    admin@flms.com
Password: admin123
```
**Access URL:** http://localhost:3000/login

**Permissions:**
- Approve/Reject leave requests
- View all faculty members
- Manage departments
- Generate reports
- Full system access

---

### Faculty Login 1
```
Email:    faculty@flms.com
Password: faculty123
```
**Access URL:** http://localhost:3000/login

**Permissions:**
- Apply for leave
- View leave history
- Check leave balance
- View notifications

---

### Faculty Login 2
```
Email:    john.doe@flms.com
Password: john123
```
**Access URL:** http://localhost:3000/login

**Permissions:**
- Apply for leave
- View leave history
- Check leave balance
- View notifications

---

## Default Leave Balances

Each faculty member starts with:
- **Casual Leave**: 12 days
- **Sick Leave**: 12 days
- **Earned Leave**: 15 days

---

## Testing Workflow

### 1. Test as Faculty
1. Login as `faculty@flms.com`
2. Navigate to "Apply Leave"
3. Select leave type and dates
4. Submit application
5. Check notifications for approval status

### 2. Test as Admin
1. Login as `admin@flms.com`
2. Navigate to "Manage Leaves"
3. View pending requests
4. Approve or reject applications
5. View faculty member details

### 3. Test Notifications
1. Apply leave as faculty
2. Approve/reject as admin
3. Switch back to faculty account
4. Check notifications bell icon

---

## Important Notes

- All passwords are hashed in the database
- Passwords shown here are plain text for testing only
- JWT tokens expire in 7 days
- In production, change all default credentials

---

## Reset Database

To clear all data and start fresh:

```bash
cd backend
npm run seed
```

This will:
- Delete all existing data
- Recreate test users
- Reset leave balances
- Create sample department

---

## Department Information

**Default Department Created:**
- Name: Computer Science
- Code: CS
- HOD: Admin User

---

**Last Updated:** February 2026
**Status:** ✅ Active and Working
