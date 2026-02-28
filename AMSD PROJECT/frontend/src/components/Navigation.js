/**
 * Navigation Bar Component
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getNotifications({ isRead: false });
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to={user.role === 'admin' ? '/admin' : '/dashboard'}>
          <i className="bi bi-journal-check me-2"></i>
          FLMS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={user.role === 'admin' ? '/admin' : '/dashboard'}>
              <i className="bi bi-house me-1"></i>
              Dashboard
            </Nav.Link>
            {user.role === 'faculty' && (
              <>
                <Nav.Link as={Link} to="/leaves/apply">
                  <i className="bi bi-plus-circle me-1"></i>
                  Apply Leave
                </Nav.Link>
                <Nav.Link as={Link} to="/leaves/history">
                  <i className="bi bi-clock-history me-1"></i>
                  History
                </Nav.Link>
                <Nav.Link as={Link} to="/leave-balance">
                  <i className="bi bi-calendar-check me-1"></i>
                  Balance
                </Nav.Link>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/admin/leaves">
                  <i className="bi bi-list-check me-1"></i>
                  Manage Leaves
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/faculty">
                  <i className="bi bi-people me-1"></i>
                  Faculty
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/departments">
                  <i className="bi bi-building me-1"></i>
                  Departments
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/reports">
                  <i className="bi bi-graph-up me-1"></i>
                  Reports
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/notifications" className="position-relative">
              <i className="bi bi-bell"></i>
              {unreadCount > 0 && (
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  {unreadCount}
                </Badge>
              )}
            </Nav.Link>
            <Dropdown align="end">
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                <i className="bi bi-person-circle me-2"></i>
                {user.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/change-password">
                  <i className="bi bi-key me-2"></i>
                  Change Password
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
