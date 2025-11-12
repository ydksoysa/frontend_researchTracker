// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Tabs, Tab, Table, Button } from 'react-bootstrap';
import { projectAPI, milestoneAPI, documentAPI, userAPI } from '../services/api';

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
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

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
      setProjects(projects);
      setMilestones(milestones);
      setDocuments(documents);
      // fetch users for admin
      try {
        const usersRes = await userAPI.getAll();
        setUsers(usersRes.data || []);
      } catch (uErr) {
        // ignore user fetch error, show in UI tab
      }
    } catch (err: any) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await fetchStats();
    setLoading(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete user? This cannot be undone.')) return;
    try {
      await userAPI.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete project? This will remove all associated data.')) return;
    try {
      await projectAPI.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Delete milestone?')) return;
    try {
      await milestoneAPI.delete(id);
      setMilestones(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete milestone');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Delete document?')) return;
    try {
      await documentAPI.delete(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete document');
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
              <h4>Management</h4>
            </Card.Header>
            <Card.Body>
              <p>Use the tabs to view and manage users, projects, milestones and documents.</p>
              <Tabs defaultActiveKey="users" id="admin-tabs" className="mb-3">
                <Tab eventKey="users" title={`Users (${users.length})`}>
                  {users.length === 0 ? (
                    <p>No users found.</p>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id || u.username}>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.createdAt || '-'}</td>
                            <td>
                              <Button variant="danger" size="sm" onClick={() => handleDeleteUser(u.id)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                <Tab eventKey="projects" title={`Projects (${projects.length})`}>
                  {projects.length === 0 ? (
                    <p>No projects found.</p>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>PI</th>
                          <th>Status</th>
                          <th>Tags</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map(p => (
                          <tr key={p.id}>
                            <td>{p.title}</td>
                            <td>{p.pi?.username || p.pi}</td>
                            <td>{p.status}</td>
                            <td>{p.tags}</td>
                            <td>
                              <Button variant="danger" size="sm" onClick={() => handleDeleteProject(p.id)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                <Tab eventKey="milestones" title={`Milestones (${milestones.length})`}>
                  {milestones.length === 0 ? (
                    <p>No milestones found.</p>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Project</th>
                          <th>Due</th>
                          <th>Completed</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {milestones.map(m => (
                          <tr key={m.id}>
                            <td>{m.title}</td>
                            <td>{m.project?.title || m.project}</td>
                            <td>{m.dueDate || '-'}</td>
                            <td>{m.isCompleted ? 'Yes' : 'No'}</td>
                            <td>
                              <Button variant="danger" size="sm" onClick={() => handleDeleteMilestone(m.id)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                <Tab eventKey="documents" title={`Documents (${documents.length})`}>
                  {documents.length === 0 ? (
                    <p>No documents found.</p>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Project</th>
                          <th>Uploaded By</th>
                          <th>Uploaded At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map(d => (
                          <tr key={d.id}>
                            <td>{d.title}</td>
                            <td>{d.project?.title || d.project}</td>
                            <td>{d.uploadedBy?.username || d.uploadedBy}</td>
                            <td>{d.uploadedAt || '-'}</td>
                            <td>
                              <Button variant="danger" size="sm" onClick={() => handleDeleteDocument(d.id)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>
              </Tabs>
              <div className="mt-3">
                <Button variant="secondary" size="sm" onClick={refreshAll}>Refresh</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;