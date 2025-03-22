
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
          // Fetch freelancer profile from the database table
          const { data, error } = await supabase
            .from('freelancer_profiles')
            .select('display_name, first_name, last_name')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            // If we have data in the database, use it
            setDisplayName(data.display_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown Freelancer');
          } else {
            // Fallback to user metadata if the profile doesn't exist in the database yet
            const fullName = user.user_metadata?.full_name || '';
            if (fullName) {
              setDisplayName(fullName);
            } else {
              setDisplayName('Unknown Freelancer');
            }
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
            setDisplayName(data.contact_name || data.company_name || 'Unknown Business');
          } else {
            // Fallback to user metadata
            setDisplayName(user.user_metadata?.full_name || user.user_metadata?.company_name || 'Unknown Business');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Use user metadata as fallback
        setDisplayName(user.user_metadata?.full_name || user.email || 'Unknown User');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  return <>{children(displayName, isLoading)}</>;
};

export default UserProfile;
