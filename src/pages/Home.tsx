// src/pages/Home.tsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container className="mt-5">
      <Row className="mb-5">
        <Col className="text-center">
          <h1 className="display-4 mb-3">Research Project Tracker</h1>
          <p className="lead text-muted">
            Manage your research projects, milestones, and documents efficiently
          </p>
          <div className="mt-4">
            <Button 
              variant="primary" 
              size="lg" 
              className="me-3"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-folder-check" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
              </div>
              <Card.Title>Project Management</Card.Title>
              <Card.Text>
                Create and manage research projects with ease. Track progress and collaborate with your team.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-flag" style={{ fontSize: '3rem', color: '#198754' }}></i>
              </div>
              <Card.Title>Milestone Tracking</Card.Title>
              <Card.Text>
                Set milestones and track your progress. Never miss a deadline with our tracking system.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem', color: '#fd7e14' }}></i>
              </div>
              <Card.Title>Document Management</Card.Title>
              <Card.Text>
                Upload, organize, and share documents related to your research projects securely.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5 mb-5">
        <Col>
          <Card bg="light">
            <Card.Body>
              <h3>Features</h3>
              <ul>
                <li>Secure JWT-based authentication</li>
                <li>Role-based access control (Admin & User)</li>
                <li>Complete CRUD operations for projects</li>
                <li>Milestone tracking and management</li>
                <li>Document upload and download</li>
                <li>Responsive design for all devices</li>
                <li>Admin dashboard with statistics</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;