
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
        
        // Get jobs count directly from the profile data first
        let jobsCount = profileData?.jobs_completed || 0;
        
        // Try to get a more accurate count from completed quotes if available
        try {
          // Count completed jobs where the freelancer participated
          const { count, error: countError } = await supabase
            .from('quotes')
            .select('*', { count: 'exact', head: true })
            .eq('freelancer_id', freelancerId)
            .eq('freelancer_completed', true)
            .eq('client_completed', true)
            .not('completed_at', 'is', null);
            
          if (!countError && count !== null) {
            // If we got a valid count, use it
            jobsCount = count;
            
            // Update the profile data object with this count
            if (profileData) {
              profileData.jobs_completed = count;
            }
          }
        } catch (countErr) {
          console.error('Error counting completed jobs:', countErr);
        }
        
        setProfileData(profileData);
        setIsVerified(isVerifiedData || false);
        setError(null);
        
        console.log('Loaded freelancer profile data:', profileData);
        console.log('Jobs completed count:', jobsCount);
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
