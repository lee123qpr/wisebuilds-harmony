
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

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
  verification_status?: string | null;
  banned_until?: string | null;
}

export interface UserCounts {
  total: number;
  freelancers: number;
  businesses: number;
  admins: number;
  activeUsers: number;
  deletedAccounts: number;
}

export const useUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    total: 0,
    freelancers: 0,
    businesses: 0,
    admins: 0,
    activeUsers: 0,
    deletedAccounts: 0
  });
  const { toast } = useToast();
  const { user: currentUser, session } = useAuth();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
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
      
      console.log('Response from get-admin-users:', response.data);
      
      // Verify the structure of the data and handle it properly
      if (!response.data?.users || !Array.isArray(response.data.users)) {
        throw new Error('Invalid user data received from server');
      }
      
      const userData = response.data.users || [];
      const deletedUsers = response.data.deletedUsers || [];
      
      // Fetch freelancer verification statuses
      const { data: verificationData, error: verificationError } = await supabase
        .from('freelancer_verification')
        .select('user_id, verification_status');
      
      if (verificationError) {
        console.error('Error fetching verification statuses:', verificationError);
      }
      
      // Create a map of user_id to verification_status
      const verificationMap = new Map();
      if (verificationData) {
        verificationData.forEach((item: any) => {
          verificationMap.set(item.user_id, item.verification_status);
        });
      }
      
      const formattedUsers: AdminUser[] = userData.map((user: any) => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at || '',
        last_sign_in_at: user.last_sign_in_at,
        user_metadata: user.user_metadata || { full_name: '', user_type: '' },
        is_verified: !!user.email_confirmed_at,
        email_confirmed_at: user.email_confirmed_at,
        verification_status: verificationMap.get(user.id) || null,
        banned_until: user.banned_until
      }));
      
      console.log('Formatted users:', formattedUsers);
      console.log('Deleted users count:', deletedUsers.length);
      setUsers(formattedUsers);
      
      // Calculate metrics for user statistics
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000); // Active in last 30 minutes
      
      // Calculate counts
      const counts: UserCounts = {
        total: formattedUsers.length,
        freelancers: 0,
        businesses: 0,
        admins: 0,
        activeUsers: 0,
        deletedAccounts: deletedUsers.length || 0
      };
      
      formattedUsers.forEach(user => {
        const userType = user.user_metadata?.user_type;
        if (userType === 'freelancer') counts.freelancers++;
        else if (userType === 'business') counts.businesses++;
        else if (userType === 'admin') counts.admins++;
        
        // Check if user is active (has signed in recently)
        if (user.last_sign_in_at) {
          const lastSignIn = new Date(user.last_sign_in_at);
          if (lastSignIn > thirtyMinutesAgo) {
            counts.activeUsers++;
          }
        }
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
      setUserCounts({
        total: 0,
        freelancers: 0,
        businesses: 0,
        admins: 0,
        activeUsers: 0,
        deletedAccounts: 0
      });
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
