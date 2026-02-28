/**
 * Leave Balance Page
 * Shows faculty member's leave balance details
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Navigation from '../components/Navigation';
import { toast } from 'react-toastify';

const LeaveBalance = () => {
  const { user } = useAuth();
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveBalance();
  }, []);

  const fetchLeaveBalance = async () => {
    try {
      const response = await userAPI.getLeaveBalance(user._id);
      setLeaveBalance(response.data.leaveBalance);
    } catch (error) {
      toast.error('Error fetching leave balance');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <h2 className="mb-4">
          <i className="bi bi-calendar-check me-2"></i>
          Leave Balance
        </h2>

        <Row>
          <Col md={4} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-calendar-plus text-primary" style={{ fontSize: '2rem' }}></i>
                <h3 className="mt-3">{leaveBalance?.casualLeave || 0}</h3>
                <Card.Text className="text-muted">Casual Leave</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-hospital text-danger" style={{ fontSize: '2rem' }}></i>
                <h3 className="mt-3">{leaveBalance?.medicalLeave || 0}</h3>
                <Card.Text className="text-muted">Medical Leave</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-briefcase text-success" style={{ fontSize: '2rem' }}></i>
                <h3 className="mt-3">{leaveBalance?.earnedLeave || 0}</h3>
                <Card.Text className="text-muted">Earned Leave</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mt-4">
          <Card.Header>
            <h5 className="mb-0">Leave Balance Details</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Available</th>
                  <th>Used</th>
                  <th>Total Allocated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><i className="bi bi-calendar-plus text-primary me-2"></i>Casual Leave</td>
                  <td><strong>{leaveBalance?.casualLeave || 0}</strong></td>
                  <td>{(12 - (leaveBalance?.casualLeave || 0))}</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td><i className="bi bi-hospital text-danger me-2"></i>Medical Leave</td>
                  <td><strong>{leaveBalance?.medicalLeave || 0}</strong></td>
                  <td>{(12 - (leaveBalance?.medicalLeave || 0))}</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td><i className="bi bi-briefcase text-success me-2"></i>Earned Leave</td>
                  <td><strong>{leaveBalance?.earnedLeave || 0}</strong></td>
                  <td>{(15 - (leaveBalance?.earnedLeave || 0))}</td>
                  <td>15</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Card className="mt-4 bg-light">
          <Card.Body>
            <h6 className="mb-3"><i className="bi bi-info-circle me-2"></i>Leave Policy Information</h6>
            <ul className="mb-0">
              <li><strong>Casual Leave:</strong> 12 days per year (non-cumulative)</li>
              <li><strong>Medical Leave:</strong> 12 days per year (requires medical certificate for more than 2 consecutive days)</li>
              <li><strong>Earned Leave:</strong> 15 days per year (can be accumulated up to 30 days)</li>
              <li>Leave applications must be submitted at least 2 days in advance for casual leave</li>
              <li>Medical leave can be applied retrospectively with proper documentation</li>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default LeaveBalance;
