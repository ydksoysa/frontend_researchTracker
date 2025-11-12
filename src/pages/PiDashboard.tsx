import React from 'react';
import { Container, Card } from 'react-bootstrap';

const PiDashboard: React.FC = () => {
  return (
    <Container>
      <Card className="p-4">
        <h2>PI Dashboard</h2>
        <p>This is the Principal Investigator dashboard — show PI-owned projects, metrics and member management here.</p>
      </Card>
    </Container>
  );
};

export default PiDashboard;
