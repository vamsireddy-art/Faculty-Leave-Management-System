/**
 * Leave History Page
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Form, Row, Col, Button } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { leaveAPI } from '../services/api';
import { toast } from 'react-toastify';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, leaves]);

  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getLeaves();
      setLeaves(response.data.leaves);
      setFilteredLeaves(response.data.leaves);
    } catch (error) {
      toast.error('Error fetching leave history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leaves];

    if (filters.status) {
      filtered = filtered.filter(leave => leave.status === filters.status);
    }

    if (filters.leaveType) {
      filtered = filtered.filter(leave => leave.leaveType === filters.leaveType);
    }

    setFilteredLeaves(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({ status: '', leaveType: '' });
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave application?')) {
      try {
        await leaveAPI.deleteLeave(id);
        toast.success('Leave deleted successfully');
        fetchLeaves();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting leave');
      }
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
        <Card className="shadow-sm">
          <Card.Header className="bg-white">
            <h4 className="mb-0">
              <i className="bi bi-clock-history me-2"></i>
              Leave History
            </h4>
          </Card.Header>
          <Card.Body>
            {/* Filters */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Filter by Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Filter by Leave Type</Form.Label>
                  <Form.Select
                    name="leaveType"
                    value={filters.leaveType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="Casual">Casual</option>
                    <option value="Sick">Sick</option>
                    <option value="Earned">Earned</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Paternity">Paternity</option>
                    <option value="Compensatory">Compensatory</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                  Clear Filters
                </Button>
              </Col>
            </Row>

            {/* Table */}
            {filteredLeaves.length === 0 ? (
              <p className="text-center text-muted">No leave applications found</p>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{leave.leaveType}</td>
                      <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                      <td>{leave.numberOfDays}</td>
                      <td>
                        <div style={{ maxWidth: '200px' }}>
                          {leave.reason.substring(0, 50)}
                          {leave.reason.length > 50 && '...'}
                        </div>
                      </td>
                      <td>{getStatusBadge(leave.status)}</td>
                      <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                      <td>
                        {leave.status === 'Pending' && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(leave._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        )}
                        {leave.status === 'Rejected' && leave.rejectionReason && (
                          <Button
                            variant="outline-info"
                            size="sm"
                            title={leave.rejectionReason}
                          >
                            <i className="bi bi-info-circle"></i>
                          </Button>
                        )}
                      </td>
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

export default LeaveHistory;
