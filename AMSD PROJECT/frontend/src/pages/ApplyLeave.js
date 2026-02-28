/**
 * Apply Leave Page
 */

import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { leaveAPI } from '../services/api';
import { toast } from 'react-toastify';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: 'Casual',
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate dates
    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      setError('From date cannot be after To date');
      setLoading(false);
      return;
    }

    try {
      await leaveAPI.applyLeave(formData);
      toast.success('Leave application submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to apply for leave';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <Col md={8} lg={6} className="mx-auto">
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Apply for Leave
                </h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Leave Type *</Form.Label>
                    <Form.Select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      required
                    >
                      <option value="Casual">Casual Leave</option>
                      <option value="Sick">Sick Leave</option>
                      <option value="Earned">Earned Leave</option>
                      <option value="Maternity">Maternity Leave</option>
                      <option value="Paternity">Paternity Leave</option>
                      <option value="Compensatory">Compensatory Leave</option>
                    </Form.Select>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>From Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="fromDate"
                          value={formData.fromDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>To Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="toDate"
                          value={formData.toDate}
                          onChange={handleChange}
                          min={formData.fromDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {calculateDays() > 0 && (
                    <Alert variant="info">
                      <i className="bi bi-info-circle me-2"></i>
                      Total Days: <strong>{calculateDays()}</strong>
                    </Alert>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Reason *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Please provide a reason for your leave..."
                      required
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                      className="flex-grow-1"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Submit Application
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ApplyLeave;
