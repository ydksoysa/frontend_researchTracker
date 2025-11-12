import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import PiDashboard from './PiDashboard';
import MemberDashboard from './MemberDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const role = (user.role || '').toString().toUpperCase();
    if (role.includes('ADMIN')) {
      // render admin panel inline
      // keep on this page
    } else if (role.includes('PI')) {
      navigate('/dashboard/pi');
    } else if (role.includes('MEMBER')) {
      navigate('/dashboard/member');
    } else {
      // viewers and unknown roles -> redirect to projects list
      navigate('/projects');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Admins stay on this page and see the admin panel
  if ((user.role || '').toString().toUpperCase().includes('ADMIN')) {
    return <AdminPanel />;
  }

  return null;
};

export default Dashboard;
