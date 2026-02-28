/**
 * Manage Faculty Page (Admin)
 * View and manage faculty members
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Form, Modal } from 'react-bootstrap';
import { userAPI } from '../services/api';
import Navigation from '../components/Navigation';
import { toast } from 'react-toastify';

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await userAPI.getUsers({ role: 'faculty' });
      setFaculty(response.data.users || []);
    } catch (error) {
      toast.error('Error fetching faculty');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setShowModal(true);
  };

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch = f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || f.department?.name === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const uniqueDepartments = [...new Set(faculty.map(f => f.department?.name).filter(Boolean))];

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
        <Row className="mb-4">
          <Col>
            <h2>
              <i className="bi bi-people me-2"></i>
              Faculty Management
            </h2>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={8}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, or employee ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {uniqueDepartments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Row className="align-items-center">
              <Col>
                <h5 className="mb-0">Faculty Members ({filteredFaculty.length})</h5>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.length > 0 ? (
                    filteredFaculty.map((facultyMember) => (
                      <tr key={facultyMember._id}>
                        <td><strong>{facultyMember.employeeId}</strong></td>
                        <td>{facultyMember.name}</td>
                        <td>{facultyMember.email}</td>
                        <td>
                          {facultyMember.department?.name || 'N/A'}
                        </td>
                        <td>{facultyMember.phone || 'N/A'}</td>
                        <td>
                          <Badge bg={facultyMember.isActive ? 'success' : 'secondary'}>
                            {facultyMember.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewDetails(facultyMember)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <i className="bi bi-inbox text-muted" style={{ fontSize: '2rem' }}></i>
                        <p className="text-muted mt-2">No faculty members found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Faculty Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Faculty Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedFaculty && (
              <div>
                <Row>
                  <Col md={6}>
                    <p><strong>Employee ID:</strong> {selectedFaculty.employeeId}</p>
                    <p><strong>Name:</strong> {selectedFaculty.name}</p>
                    <p><strong>Email:</strong> {selectedFaculty.email}</p>
                    <p><strong>Phone:</strong> {selectedFaculty.phone || 'N/A'}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Department:</strong> {selectedFaculty.department?.name || 'N/A'}</p>
                    <p><strong>Role:</strong> {selectedFaculty.role}</p>
                    <p><strong>Status:</strong> 
                      <Badge bg={selectedFaculty.isActive ? 'success' : 'secondary'} className="ms-2">
                        {selectedFaculty.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </p>
                  </Col>
                </Row>

                <hr />

                <h6>Leave Balance</h6>
                <Row>
                  <Col md={4}>
                    <Card className="text-center bg-light">
                      <Card.Body>
                        <h4>{selectedFaculty.leaveBalance?.casualLeave || 0}</h4>
                        <small className="text-muted">Casual Leave</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center bg-light">
                      <Card.Body>
                        <h4>{selectedFaculty.leaveBalance?.medicalLeave || 0}</h4>
                        <small className="text-muted">Medical Leave</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center bg-light">
                      <Card.Body>
                        <h4>{selectedFaculty.leaveBalance?.earnedLeave || 0}</h4>
                        <small className="text-muted">Earned Leave</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default ManageFaculty;
