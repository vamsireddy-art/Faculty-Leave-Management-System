/**
 * Main App Component
 * Defines routes and global providers
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import LeaveBalance from './pages/LeaveBalance';
import ManageLeaves from './pages/ManageLeaves';
import ManageFaculty from './pages/ManageFaculty';
import ManageDepartments from './pages/ManageDepartments';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Faculty Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['faculty']}>
                  <FacultyDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/leaves/apply"
              element={
                <PrivateRoute allowedRoles={['faculty']}>
                  <ApplyLeave />
                </PrivateRoute>
              }
            />
            <Route
              path="/leaves/history"
              element={
                <PrivateRoute allowedRoles={['faculty']}>
                  <LeaveHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/leave-balance"
              element={
                <PrivateRoute allowedRoles={['faculty']}>
                  <LeaveBalance />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/leaves"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <ManageLeaves />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/faculty"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <ManageFaculty />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <ManageDepartments />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Reports />
                </PrivateRoute>
              }
            />

            {/* Shared Routes */}
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={
              <div className="container mt-5 text-center">
                <h1>403 - Unauthorized</h1>
                <p>You don't have permission to access this page.</p>
              </div>
            } />

            {/* 404 Not Found */}
            <Route path="*" element={
              <div className="container mt-5 text-center">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
