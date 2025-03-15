
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Development flag - matches the one in ProtectedRoute
const BYPASS_AUTH_FOR_DEVELOPMENT = true;

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    full_name?: string;
    user_type?: string;
  };
  is_verified?: boolean;
  email_confirmed_at?: string | null;
}

export interface UserCounts {
  total: number;
  freelancers: number;
  businesses: number;
  admins: number;
}

export const useUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    total: 0,
    freelancers: 0,
    businesses: 0,
    admins: 0
  });
  const { toast } = useToast();
  const { user: currentUser, session } = useAuth();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In development mode with auth bypass, use mock data
      if (BYPASS_AUTH_FOR_DEVELOPMENT && !session?.access_token) {
        console.log('Development mode: Using mock user data');
        
        // Mock data for development testing
        const mockUsers: AdminUser[] = [
          {
            id: '1',
            email: 'admin@example.com',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            user_metadata: { full_name: 'Admin User', user_type: 'admin' },
            is_verified: true,
            email_confirmed_at: new Date().toISOString()
          },
          {
            id: '2',
            email: 'freelancer@example.com',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            user_metadata: { full_name: 'Freelancer User', user_type: 'freelancer' },
            is_verified: true,
            email_confirmed_at: new Date().toISOString()
          },
          {
            id: '3',
            email: 'business@example.com',
            created_at: new Date().toISOString(),
            last_sign_in_at: null,
            user_metadata: { full_name: 'Business User', user_type: 'business' },
            is_verified: false,
            email_confirmed_at: null
          },
        ];
        
        setUsers(mockUsers);
        
        // Calculate mock counts
        const counts: UserCounts = {
          total: mockUsers.length,
          freelancers: 1,
          businesses: 1,
          admins: 1
        };
        
        setUserCounts(counts);
        setIsLoading(false);
        return;
      }
      
      // For non-development mode or when a session token is available
      // Get session token from the current session
      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }
      
      // Call our secure edge function with the access token
      const response = await supabase.functions.invoke('get-admin-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch users');
      }
      
      const userData = response.data?.users || [];
      
      const formattedUsers: AdminUser[] = userData.map((user: any) => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at || '',
        last_sign_in_at: user.last_sign_in_at,
        user_metadata: user.user_metadata || { full_name: '', user_type: '' },
        is_verified: !!user.email_confirmed_at,
        email_confirmed_at: user.email_confirmed_at
      }));
      
      setUsers(formattedUsers);
      
      // Calculate counts
      const counts: UserCounts = {
        total: formattedUsers.length,
        freelancers: 0,
        businesses: 0,
        admins: 0
      };
      
      formattedUsers.forEach(user => {
        const userType = user.user_metadata?.user_type;
        if (userType === 'freelancer') counts.freelancers++;
        else if (userType === 'business') counts.businesses++;
        else if (userType === 'admin') counts.admins++;
      });
      
      setUserCounts(counts);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load users. Admin privileges required.'
      });
      // Set empty array to handle error gracefully
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    userCounts,
    fetchUsers
  };
};
