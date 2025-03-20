
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileProps {
  user: User;
  children: (displayName: string, isLoading: boolean) => React.ReactNode;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, children }) => {
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile data to get the most up-to-date display name
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      const userType = user.user_metadata?.user_type;
      
      try {
        if (userType === 'freelancer') {
          // Fetch freelancer profile
          const { data, error } = await supabase
            .from('freelancer_profiles')
            .select('display_name, first_name, last_name')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            setDisplayName(data.display_name || `${data.first_name || ''} ${data.last_name || ''}`.trim());
          }
        } else if (userType === 'business') {
          // Fetch business profile
          const { data, error } = await supabase
            .from('client_profiles')
            .select('contact_name, company_name')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            setDisplayName(data.contact_name || data.company_name || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  return <>{children(displayName, isLoading)}</>;
};

export default UserProfile;
