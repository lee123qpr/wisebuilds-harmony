
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

  // Special handling for the success page with a session ID
  const isSuccessPage = location.pathname.includes('/credits/success');
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  
  // Try to restore session if we're on the success page and there's no user
  useEffect(() => {
    const tryRestoreSession = async () => {
      if (isSuccessPage && sessionId && !user && !isLoading) {
        // Try to get session from localStorage backup
        const sessionBackup = localStorage.getItem('sb-session-backup');
        if (sessionBackup) {
          try {
            console.log('Attempting to restore session from backup in ProtectedRoute');
            await supabase.auth.setSession(JSON.parse(sessionBackup));
          } catch (error) {
            console.error('Error restoring session in ProtectedRoute:', error);
          }
        }
      }
    };
    
    tryRestoreSession();
  }, [isSuccessPage, sessionId, user, isLoading]);

  // While checking authentication status, show nothing
  if (isLoading) {
    return null;
  }

  // Special case: Always allow access to the success page with a session ID
  if (isSuccessPage && sessionId) {
    console.log('Allowing access to success page with session ID');
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  if (!user) {
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
