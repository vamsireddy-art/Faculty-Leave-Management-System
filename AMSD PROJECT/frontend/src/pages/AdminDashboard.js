/**
 * Admin Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { leaveAPI, userAPI } from '../services/api';
import Navigation from '../components/Navigation';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingLeaves: 0,
    totalFaculty: 0,
    todayLeaves: 0,
    thisMonthLeaves: 0,
  });
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leavesRes, facultyRes] = await Promise.all([
        leaveAPI.getLeaves({ status: 'Pending' }),
        userAPI.getUsers({ role: 'faculty' }),
      ]);

      const leaves = leavesRes.data.leaves;
      setPendingLeaves(leaves.slice(0, 5));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = leaves.filter(l => {
        const fromDate = new Date(l.fromDate);
        const toDate = new Date(l.toDate);
        return fromDate <= today && toDate >= today;
      }).length;

      const thisMonthCount = leaves.filter(l => {
        const date = new Date(l.createdAt);
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      }).length;

      setStats({
        pendingLeaves: leaves.length,
        totalFaculty: facultyRes.data.count,
        todayLeaves: todayCount,
        thisMonthLeaves: thisMonthCount,
      });
    } catch (error) {
      toast.error('Error fetching data');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        <h2 className="mb-4">Admin Dashboard</h2>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="h-100 shadow-sm border-start border-warning border-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="text-muted small">Pending Leaves</Card.Title>
                    <h3 className="text-warning">{stats.pendingLeaves}</h3>
                  </div>
                  <i className="bi bi-clock-history text-warning display-4"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="h-100 shadow-sm border-start border-primary border-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="text-muted small">Total Faculty</Card.Title>
                    <h3 className="text-primary">{stats.totalFaculty}</h3>
                  </div>
                  <i className="bi bi-people text-primary display-4"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="h-100 shadow-sm border-start border-success border-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="text-muted small">On Leave Today</Card.Title>
                    <h3 className="text-success">{stats.todayLeaves}</h3>
                  </div>
                  <i className="bi bi-calendar-day text-success display-4"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="h-100 shadow-sm border-start border-info border-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="text-muted small">This Month</Card.Title>
                    <h3 className="text-info">{stats.thisMonthLeaves}</h3>
                  </div>
                  <i className="bi bi-calendar-month text-info display-4"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Pending Leave Requests */}
        <Card className="shadow-sm">
          <Card.Header className="bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pending Leave Requests</h5>
              <Link to="/admin/leaves" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            {pendingLeaves.length === 0 ? (
              <p className="text-center text-muted">No pending leave requests</p>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Faculty</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Applied On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>
                        <div>
                          <strong>{leave.faculty.name}</strong>
                          <br />
                          <small className="text-muted">{leave.faculty.email}</small>
                        </div>
                      </td>
                      <td>{leave.leaveType}</td>
                      <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                      <td>{leave.numberOfDays}</td>
                      <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/admin/leaves/${leave._id}`} className="btn btn-sm btn-outline-primary">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Quick Links */}
        <Row className="mt-4">
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <i className="bi bi-list-check display-1 text-primary"></i>
                <h5 className="mt-3">Manage Leaves</h5>
                <p className="text-muted">Review and approve leave requests</p>
                <Link to="/admin/leaves" className="btn btn-primary">
                  Go to Leaves
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <i className="bi bi-people display-1 text-success"></i>
                <h5 className="mt-3">Manage Faculty</h5>
                <p className="text-muted">Add, edit, and view faculty members</p>
                <Link to="/admin/faculty" className="btn btn-success">
                  Go to Faculty
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <i className="bi bi-graph-up display-1 text-info"></i>
                <h5 className="mt-3">View Reports</h5>
                <p className="text-muted">Analytics and statistics</p>
                <Link to="/admin/reports" className="btn btn-info">
                  Go to Reports
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard;
