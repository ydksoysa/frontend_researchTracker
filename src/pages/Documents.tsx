// src/pages/Documents.tsx
import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { documentAPI, projectAPI } from '../services/api';

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  projectId: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [documentsRes, projectsRes] = await Promise.all([
        documentAPI.getAll(),
        projectAPI.getAll()
      ]);
      setDocuments(documentsRes.data);
      setProjects(projectsRes.data);
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    setSelectedFile(null);
    setProjectId('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setProjectId('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !projectId) {
      setError('Please select a file and project');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('projectId', projectId);

    try {
      await documentAPI.upload(formData);
      fetchData();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentAPI.delete(id);
        fetchData();
      } catch (err: any) {
        setError('Failed to delete document');
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
        <h2>Documents</h2>
        <Button variant="primary" onClick={handleShowModal}>
          Upload Document
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Project</th>
            <th>Type</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.fileName}</td>
              <td>{getProjectTitle(doc.projectId)}</td>
              <td>{doc.fileType}</td>
              <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleDownload(doc.id, doc.fileName)}
                  className="me-2"
                >
                  Download
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(doc.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Project</Form.Label>
              <Form.Select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
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
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                required
              />
              {selectedFile && (
                <Form.Text className="text-muted">
                  Selected: {selectedFile.name}
                </Form.Text>
              )}
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2" disabled={uploading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={uploading}>
                {uploading ? <><Spinner size="sm" animation="border" /> Uploading...</> : 'Upload'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Documents;