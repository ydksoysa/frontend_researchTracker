// src/components/LoadingSpinner.tsx
import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  fullPage = true 
}) => {
  if (fullPage) {
    return (
      <Container 
        className="d-flex flex-column justify-content-center align-items-center" 
        style={{ minHeight: '80vh' }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">{message}</p>
      </Container>
    );
  }

  return (
    <div className="text-center py-4">
      <Spinner animation="border" variant="primary" size="sm" />
      <span className="ms-2">{message}</span>
    </div>
  );
};

export default LoadingSpinner;