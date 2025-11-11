// src/pages/Milestones.tsx
import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { milestoneAPI, projectAPI } from '../services/api';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  projectId: string;
}

const Milestones: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'PENDING',
    projectId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [milestonesRes, projectsRes] = await Promise.all([
        milestoneAPI.getAll(),
        projectAPI.getAll()
      ]);
      setMilestones(milestonesRes.data);
      setProjects(projectsRes.data);
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (milestone?: Milestone) => {
    if (milestone) {
      setCurrentMilestone(milestone);
      setFormData({
        title: milestone.title,
        description: milestone.description,
        dueDate: milestone.dueDate.split('T')[0],
        status: milestone.status,
        projectId: milestone.projectId
      });
    } else {
      setCurrentMilestone(null);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        status: 'PENDING',
        projectId: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMilestone(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentMilestone) {
        await milestoneAPI.update(currentMilestone.id, formData);
      } else {
        await milestoneAPI.create(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        await milestoneAPI.delete(id);
        fetchData();
      } catch (err: any) {
        setError('Failed to delete milestone');
      }
    }
  };

  const getProjectTitle = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'Unknown Project';
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Milestones</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Create Milestone
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Project</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((milestone) => (
            <tr key={milestone.id}>
              <td>{milestone.title}</td>
              <td>{getProjectTitle(milestone.projectId)}</td>
              <td>{milestone.description}</td>
              <td>{new Date(milestone.dueDate).toLocaleDateString()}</td>
              <td>
                <span className={`badge bg-${milestone.status === 'COMPLETED' ? 'success' : 'primary'}`}>
                  {milestone.status}
                </span>
              </td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleShowModal(milestone)} className="me-2">
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(milestone.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentMilestone ? 'Edit Milestone' : 'Create Milestone'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Project</Form.Label>
              <Form.Select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentMilestone ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Milestones;