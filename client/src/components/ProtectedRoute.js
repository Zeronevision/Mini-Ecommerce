import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !user.user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 