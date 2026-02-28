/**
 * Manage Departments Page (Admin)
 * View and manage departments
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner } from 'react-bootstrap';
import { departmentAPI } from '../services/api';
import Navigation from '../components/Navigation';
import { toast } from 'react-toastify';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getDepartments();
      setDepartments(response.data.departments || []);
    } catch (error) {
      toast.error('Error fetching departments');
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
        <Row className="mb-4">
          <Col>
            <h2>
              <i className="bi bi-building me-2"></i>
              Department Management
            </h2>
          </Col>
        </Row>

        <Row className="mb-4">
          {departments.map((dept) => (
            <Col md={6} lg={4} key={dept._id} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{dept.name}</h5>
                      <small className="text-muted">{dept.code}</small>
                    </div>
                    <i className="bi bi-building text-primary" style={{ fontSize: '2rem' }}></i>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1"><strong>HOD:</strong></p>
                    <p className="mb-0">{dept.hod?.name || 'Not Assigned'}</p>
                    {dept.hod && (
                      <small className="text-muted">{dept.hod.email}</small>
                    )}
                  </div>

                  <div className="mb-2">
                    <p className="mb-1"><strong>Faculty Count:</strong></p>
                    <h4 className="text-primary mb-0">{dept.facultyCount || 0}</h4>
                  </div>

                  {dept.description && (
                    <div className="mt-3">
                      <p className="text-muted small mb-0">{dept.description}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {departments.length === 0 && (
          <Card>
            <Card.Body className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3">No departments found</p>
            </Card.Body>
          </Card>
        )}

        <Card className="mt-4">
          <Card.Header>
            <h5 className="mb-0">All Departments</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Code</th>
                    <th>Department Name</th>
                    <th>HOD</th>
                    <th>Faculty Count</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <tr key={dept._id}>
                        <td><strong>{dept.code}</strong></td>
                        <td>{dept.name}</td>
                        <td>
                          {dept.hod ? (
                            <div>
                              <div>{dept.hod.name}</div>
                              <small className="text-muted">{dept.hod.email}</small>
                            </div>
                          ) : (
                            <span className="text-muted">Not Assigned</span>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-primary">{dept.facultyCount || 0}</span>
                        </td>
                        <td>{dept.description || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <i className="bi bi-inbox text-muted" style={{ fontSize: '2rem' }}></i>
                        <p className="text-muted mt-2">No departments found</p>
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

export default ManageDepartments;
