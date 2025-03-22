
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useFreelancerProfileData = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const { freelancerId } = useParams();

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch the freelancer profile data
        const { data: profileData, error: profileError } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', freelancerId)
          .maybeSingle();
        
        if (profileError) throw profileError;
        
        // Check if the freelancer is verified
        const { data: isVerifiedData, error: verificationError } = await supabase
          .rpc('is_user_verified', { check_user_id: freelancerId });
        
        if (verificationError) throw verificationError;
        
        setProfileData(profileData);
        setIsVerified(isVerifiedData || false);
        setError(null);
      } catch (err) {
        console.error('Error fetching freelancer data:', err);
        setError(err);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    if (freelancerId) {
      fetchFreelancerProfile();
    }
  }, [freelancerId]);

  return { profileData, loading, error, isVerified };
};
