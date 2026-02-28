/**
 * Reports Page (Admin)
 * View various leave reports and statistics
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge } from 'react-bootstrap';
import { leaveAPI, departmentAPI, userAPI } from '../services/api';
import Navigation from '../components/Navigation';
import { toast } from 'react-toastify';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchLeaves();
    }
  }, [selectedDepartment, selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      const [deptRes, leaveRes] = await Promise.all([
        departmentAPI.getDepartments(),
        leaveAPI.getLeaves(),
      ]);
      
      setDepartments(deptRes.data.departments || []);
      setLeaves(leaveRes.data.leaves || []);
      calculateStats(leaveRes.data.leaves || []);
    } catch (error) {
      toast.error('Error fetching data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getLeaves();
      let filteredLeaves = response.data.leaves || [];

      // Filter by department
      if (selectedDepartment) {
        filteredLeaves = filteredLeaves.filter(
          (leave) => leave.userId?.department?._id === selectedDepartment
        );
      }

      // Filter by month and year
      filteredLeaves = filteredLeaves.filter((leave) => {
        const leaveDate = new Date(leave.startDate);
        return (
          leaveDate.getMonth() + 1 === parseInt(selectedMonth) &&
          leaveDate.getFullYear() === parseInt(selectedYear)
        );
      });

      setLeaves(filteredLeaves);
      calculateStats(filteredLeaves);
    } catch (error) {
      toast.error('Error fetching leaves');
      console.error(error);
    }
  };

  const calculateStats = (leavesData) => {
    const stats = {
      totalLeaves: leavesData.length,
      pendingLeaves: leavesData.filter((l) => l.status === 'Pending').length,
      approvedLeaves: leavesData.filter((l) => l.status === 'Approved').length,
      rejectedLeaves: leavesData.filter((l) => l.status === 'Rejected').length,
    };
    setStats(stats);
  };

  const getLeaveTypeStats = () => {
    const casualLeaves = leaves.filter((l) => l.leaveType === 'Casual').length;
    const medicalLeaves = leaves.filter((l) => l.leaveType === 'Medical').length;
    const earnedLeaves = leaves.filter((l) => l.leaveType === 'Earned').length;
    
    return { casualLeaves, medicalLeaves, earnedLeaves };
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const leaveTypeStats = getLeaveTypeStats();

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
          <i className="bi bi-graph-up me-2"></i>
          Reports & Analytics
        </h2>

        {/* Filters */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {[2024, 2025, 2026, 2027].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <i className="bi bi-clipboard-data text-primary" style={{ fontSize: '2rem' }}></i>
                <h3 className="mt-3">{stats.totalLeaves}</h3>
                <Card.Text className="text-muted">Total Leaves</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <i className="bi bi-clock-history text-warning" style={{ fontSize: '2rem' }}></i>
                <h3 className="mt-3">{stats.pendingLeaves}</h3>
                <Card.Text className="text-muted">Pending</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
                <h3 className="mt-3">{stats.approvedLeaves}</h3>
                <Card.Text className="text-muted">Approved</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <i className="bi bi-x-circle text-danger" style={{ fontSize: '2rem' }}></i>
                <h3 className="mt-3">{stats.rejectedLeaves}</h3>
                <Card.Text className="text-muted">Rejected</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Leave Type Statistics */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-calendar-plus text-info" style={{ fontSize: '2rem' }}></i>
                <h4 className="mt-3">{leaveTypeStats.casualLeaves}</h4>
                <Card.Text className="text-muted">Casual Leaves</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-hospital text-danger" style={{ fontSize: '2rem' }}></i>
                <h4 className="mt-3">{leaveTypeStats.medicalLeaves}</h4>
                <Card.Text className="text-muted">Medical Leaves</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-briefcase text-success" style={{ fontSize: '2rem' }}></i>
                <h4 className="mt-3">{leaveTypeStats.earnedLeaves}</h4>
                <Card.Text className="text-muted">Earned Leaves</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Leave Details Table */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">Leave Details</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Faculty</th>
                    <th>Department</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length > 0 ? (
                    leaves.map((leave) => (
                      <tr key={leave._id}>
                        <td>
                          <div>{leave.userId?.name}</div>
                          <small className="text-muted">{leave.userId?.employeeId}</small>
                        </td>
                        <td>{leave.userId?.department?.name || 'N/A'}</td>
                        <td>{leave.leaveType}</td>
                        <td>{formatDate(leave.startDate)}</td>
                        <td>{formatDate(leave.endDate)}</td>
                        <td><Badge bg="secondary">{leave.numberOfDays}</Badge></td>
                        <td>{getStatusBadge(leave.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <i className="bi bi-inbox text-muted" style={{ fontSize: '2rem' }}></i>
                        <p className="text-muted mt-2">No leave records found for the selected criteria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Reports;
