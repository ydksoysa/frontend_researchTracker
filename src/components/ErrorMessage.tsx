// src/components/ErrorMessage.tsx
import React from 'react';
import { Alert } from 'react-bootstrap';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onClose, 
  variant = 'danger' 
}) => {
  if (!message) return null;

  return (
    <Alert variant={variant} dismissible={!!onClose} onClose={onClose} className="mb-3">
      {message}
    </Alert>
  );
};

export default ErrorMessage;