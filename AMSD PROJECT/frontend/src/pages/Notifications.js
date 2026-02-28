/**
 * Notifications Page
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Badge, Button } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { notificationAPI } from '../services/api';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data.notifications);
    } catch (error) {
      toast.error('Error fetching notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error('Error marking notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Error marking all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error) {
      toast.error('Error deleting notification');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      leave_applied: 'bi-calendar-plus text-primary',
      leave_approved: 'bi-check-circle text-success',
      leave_rejected: 'bi-x-circle text-danger',
      system: 'bi-info-circle text-info',
    };
    return icons[type] || 'bi-bell';
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <Container className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container>
        <Card className="shadow-sm">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <i className="bi bi-bell me-2"></i>
              Notifications
            </h4>
            {notifications.some(n => !n.isRead) && (
              <Button variant="outline-primary" size="sm" onClick={handleMarkAllAsRead}>
                Mark All as Read
              </Button>
            )}
          </Card.Header>
          <Card.Body className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center p-5 text-muted">
                <i className="bi bi-bell-slash display-1"></i>
                <p className="mt-3">No notifications</p>
              </div>
            ) : (
              <ListGroup variant="flush">
                {notifications.map((notification) => (
                  <ListGroup.Item
                    key={notification._id}
                    className={!notification.isRead ? 'bg-light border-start border-primary border-3' : ''}
                  >
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <i className={`bi ${getNotificationIcon(notification.type)} fs-3`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">
                              {notification.title}
                              {!notification.isRead && (
                                <Badge bg="primary" className="ms-2">New</Badge>
                              )}
                            </h6>
                            <p className="mb-1">{notification.message}</p>
                            <small className="text-muted">
                              {new Date(notification.createdAt).toLocaleString()}
                            </small>
                          </div>
                          <div className="d-flex gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification._id)}
                                title="Mark as read"
                              >
                                <i className="bi bi-check"></i>
                              </Button>
                            )}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(notification._id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Notifications;
