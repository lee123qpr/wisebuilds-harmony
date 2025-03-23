
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
        
        console.log('Loaded freelancer profile data:', profileData);
        console.log('Jobs completed count:', profileData?.jobs_completed);
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

  // Make the returned object's property names match what's expected
  return { 
    profile: profileData,
    isLoading: loading, 
    error, 
    isVerified 
  };
};
