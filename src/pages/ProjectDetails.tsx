// src/pages/ProjectDetails.tsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Tabs, Tab, ListGroup, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { projectAPI, milestoneAPI, documentAPI } from '../services/api';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, milestonesRes, documentsRes] = await Promise.all([
        projectAPI.getById(id!),
        milestoneAPI.getByProject(id!),
        documentAPI.getByProject(id!)
      ]);
      setProject(projectRes.data);
      setMilestones(milestonesRes.data);
      setDocuments(documentsRes.data);
    } catch (err: any) {
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const response = await documentAPI.download(docId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download document');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Project not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="mb-4">
        <Card.Body>
          <h2>{project.title}</h2>
          <p className="text-muted">{project.description}</p>
          <div className="d-flex gap-3">
            <Badge bg={project.status === 'COMPLETED' ? 'success' : 'warning'}>
              {project.status}
            </Badge>
            <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
            <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
          </div>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Tabs defaultActiveKey="milestones" className="mb-3">
        <Tab eventKey="milestones" title="Milestones">
          <ListGroup>
            {milestones.length === 0 ? (
              <ListGroup.Item>No milestones found</ListGroup.Item>
            ) : (
              milestones.map((milestone) => (
                <ListGroup.Item key={milestone.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{milestone.title}</h5>
                      <p className="mb-1">{milestone.description}</p>
                      <small className="text-muted">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </small>
                    </div>
                    <Badge bg={milestone.status === 'COMPLETED' ? 'success' : 'primary'}>
                      {milestone.status}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Tab>

        <Tab eventKey="documents" title="Documents">
          <ListGroup>
            {documents.length === 0 ? (
              <ListGroup.Item>No documents found</ListGroup.Item>
            ) : (
              documents.map((doc) => (
                <ListGroup.Item key={doc.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{doc.fileName}</h6>
                      <small className="text-muted">
                        Type: {doc.fileType} | Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                      </small>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                    >
                      Download
                    </button>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProjectDetails;