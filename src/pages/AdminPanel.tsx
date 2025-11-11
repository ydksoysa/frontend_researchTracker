// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { projectAPI, milestoneAPI, documentAPI } from '../services/api';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMilestones: 0,
    totalDocuments: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingMilestones: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, milestonesRes, documentsRes] = await Promise.all([
        projectAPI.getAll(),
        milestoneAPI.getAll(),
        documentAPI.getAll()
      ]);

      const projects = projectsRes.data;
      const milestones = milestonesRes.data;
      const documents = documentsRes.data;

      setStats({
        totalProjects: projects.length,
        totalMilestones: milestones.length,
        totalDocuments: documents.length,
        activeProjects: projects.filter((p: any) => p.status === 'IN_PROGRESS').length,
        completedProjects: projects.filter((p: any) => p.status === 'COMPLETED').length,
        pendingMilestones: milestones.filter((m: any) => m.status === 'PENDING').length
      });
    } catch (err: any) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Row>
        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title className="text-primary">Total Projects</Card.Title>
              <h1 className="display-3">{stats.totalProjects}</h1>
              <Card.Text className="text-muted">
                Active: {stats.activeProjects} | Completed: {stats.completedProjects}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title className="text-success">Total Milestones</Card.Title>
              <h1 className="display-3">{stats.totalMilestones}</h1>
              <Card.Text className="text-muted">
                Pending: {stats.pendingMilestones}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title className="text-info">Total Documents</Card.Title>
              <h1 className="display-3">{stats.totalDocuments}</h1>
              <Card.Text className="text-muted">
                Uploaded files
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h4>System Overview</h4>
            </Card.Header>
            <Card.Body>
              <p>Welcome to the Research Project Tracker Admin Panel.</p>
              <ul>
                <li>Manage and monitor all research projects</li>
                <li>Track milestone progress across projects</li>
                <li>Oversee document management</li>
                <li>View system-wide statistics</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;