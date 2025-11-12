import React from 'react';
import { Container, Card } from 'react-bootstrap';

const MemberDashboard: React.FC = () => {
  return (
    <Container>
      <Card className="p-4">
        <h2>Member Dashboard</h2>
        <p>This is the Member dashboard — show assigned milestones, uploads, and personal tasks here.</p>
      </Card>
    </Container>
  );
};

export default MemberDashboard;
