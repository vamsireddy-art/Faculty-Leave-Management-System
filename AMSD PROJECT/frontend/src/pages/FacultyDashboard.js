/**
 * Faculty Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leaveAPI, userAPI } from '../services/api';
import Navigation from '../components/Navigation';
import { toast } from 'react-toastify';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, leavesRes] = await Promise.all([
        userAPI.getLeaveBalance(user._id),
        leaveAPI.getLeaves({ limit: 5 }),
      ]);

      setLeaveBalance(balanceRes.data.leaveBalance);
      setRecentLeaves(leavesRes.data.leaves);
    } catch (error) {
      toast.error('Error fetching data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
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
        <h2 className="mb-4">Welcome, {user.name}!</h2>

        {/* Leave Balance Cards */}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="text-muted small">Casual Leave</Card.Title>
                    <h3>{leaveBalance?.casual?.available}/{leaveBalance?.casual?.total}</h3>
                  </div>
                  <i className="bi bi-calendar-day text-primary display-4"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="text-muted small">Sick Leave</Card.Title>
                    <h3>{leaveBalance?.sick?.available}/{leaveBalance?.sick?.total}</h3>
                  </div>
                  <i className="bi bi-heart-pulse text-danger display-4"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="text-muted small">Earned Leave</Card.Title>
                    <h3>{leaveBalance?.earned?.available}/{leaveBalance?.earned?.total}</h3>
                  </div>
                  <i className="bi bi-calendar-check text-success display-4"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Quick Actions</h5>
            <div className="d-flex flex-wrap gap-2">
              <Button as={Link} to="/leaves/apply" variant="primary">
                <i className="bi bi-plus-circle me-2"></i>
                Apply for Leave
              </Button>
              <Button as={Link} to="/leaves/history" variant="outline-primary">
                <i className="bi bi-clock-history me-2"></i>
                View History
              </Button>
              <Button as={Link} to="/leave-balance" variant="outline-secondary">
                <i className="bi bi-calendar-check me-2"></i>
                Leave Balance Details
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Recent Leave Applications */}
        <Card className="shadow-sm">
          <Card.Header>
            <h5 className="mb-0">Recent Leave Applications</h5>
          </Card.Header>
          <Card.Body>
            {recentLeaves.length === 0 ? (
              <p className="text-center text-muted">No leave applications yet</p>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{leave.leaveType}</td>
                      <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                      <td>{leave.numberOfDays}</td>
                      <td>{getStatusBadge(leave.status)}</td>
                      <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default FacultyDashboard;
