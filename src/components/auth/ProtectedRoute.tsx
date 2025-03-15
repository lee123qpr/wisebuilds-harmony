
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Development flag - set to true to bypass authentication checks
// IMPORTANT: Set this to false before deploying to production
const BYPASS_AUTH_FOR_DEVELOPMENT = true;

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
  
  // Special case for admin dashboard in development mode
  if (BYPASS_AUTH_FOR_DEVELOPMENT && location.pathname.includes('/dashboard/admin')) {
    console.log('Development mode: Bypassing authentication for admin dashboard');
    return <>{children}</>;
  }

  // While checking authentication status, show nothing
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If we're checking user types and user doesn't have the right type
  if (allowedUserTypes && allowedUserTypes.length > 0) {
    const userType = user.user_metadata?.user_type;
    
    if (!userType || !allowedUserTypes.includes(userType)) {
      // Redirect to home or unauthorized page
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has right permissions if needed
  return <>{children}</>;
};

export default ProtectedRoute;
