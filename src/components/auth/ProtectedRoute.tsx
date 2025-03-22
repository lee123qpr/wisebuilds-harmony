
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  allowedUserTypes
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While checking authentication status, show nothing
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!user) {
    // Preserve the success URL parameters when redirecting
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    
    // If we're on the success page with a session ID, don't redirect
    if (location.pathname.includes('/credits/success') && sessionId) {
      return <>{children}</>;
    }
    
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If we're checking user types and user doesn't have the right type
  if (allowedUserTypes && allowedUserTypes.length > 0) {
    const userType = user.user_metadata?.user_type;
    
    // Allow admins to access any protected route
    if (userType === 'admin') {
      return <>{children}</>;
    }
    
    if (!userType || !allowedUserTypes.includes(userType)) {
      // Redirect to home or unauthorized page
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has right permissions if needed
  return <>{children}</>;
};

export default ProtectedRoute;
