/**
 * Admin Manage Leaves Page
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { leaveAPI } from '../services/api';
import { toast } from 'react-toastify';

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getLeaves();
      setLeaves(response.data.leaves);
    } catch (error) {
      toast.error('Error fetching leaves');
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

  const handleReviewClick = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await leaveAPI.updateLeaveStatus(selectedLeave._id, { status: 'Approved' });
      toast.success('Leave approved successfully!');
      setShowModal(false);
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving leave');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await leaveAPI.updateLeaveStatus(selectedLeave._id, {
        status: 'Rejected',
        rejectionReason,
      });
      toast.success('Leave rejected');
      setShowModal(false);
      setRejectionReason('');
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rejecting leave');
    } finally {
      setActionLoading(false);
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
              <i className="bi bi-list-check me-2"></i>
              Manage Leave Applications
            </h4>
          </Card.Header>
          <Card.Body>
            {leaves.length === 0 ? (
              <p className="text-center text-muted">No leave applications</p>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Faculty</th>
                    <th>Department</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>
                        <div>
                          <strong>{leave.faculty.name}</strong>
                          <br />
                          <small className="text-muted">{leave.faculty.email}</small>
                        </div>
                      </td>
                      <td>{leave.faculty.department?.name}</td>
                      <td>{leave.leaveType}</td>
                      <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                      <td>{leave.numberOfDays}</td>
                      <td>{getStatusBadge(leave.status)}</td>
                      <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                      <td>
                        {leave.status === 'Pending' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleReviewClick(leave)}
                          >
                            Review
                          </Button>
                        ) : (
                          <Badge bg="secondary">Processed</Badge>
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

      {/* Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Leave Application Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <>
              <h5>Faculty Details</h5>
              <p>
                <strong>Name:</strong> {selectedLeave.faculty.name}<br />
                <strong>Email:</strong> {selectedLeave.faculty.email}<br />
                <strong>Employee ID:</strong> {selectedLeave.faculty.employeeId}
              </p>

              <hr />

              <h5>Leave Details</h5>
              <p>
                <strong>Leave Type:</strong> {selectedLeave.leaveType}<br />
                <strong>From:</strong> {new Date(selectedLeave.fromDate).toLocaleDateString()}<br />
                <strong>To:</strong> {new Date(selectedLeave.toDate).toLocaleDateString()}<br />
                <strong>Number of Days:</strong> {selectedLeave.numberOfDays}<br />
                <strong>Applied On:</strong> {new Date(selectedLeave.createdAt).toLocaleDateString()}
              </p>

              <hr />

              <h5>Reason</h5>
              <p>{selectedLeave.reason}</p>

              <Form.Group className="mt-3">
                <Form.Label>Rejection Reason (if rejecting)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide reason for rejection..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={actionLoading}
          >
            {actionLoading ? 'Processing...' : 'Reject'}
          </Button>
          <Button
            variant="success"
            onClick={handleApprove}
            disabled={actionLoading}
          >
            {actionLoading ? 'Processing...' : 'Approve'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageLeaves;
