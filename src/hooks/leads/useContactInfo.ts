
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClientInfo {
  contact_name: string | null;
  company_name: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  is_profile_complete: boolean; // Flag to indicate if profile is complete
}

export const useContactInfo = (projectId: string) => {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClientInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First get the project to get the user_id
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();
      
      if (projectError) throw projectError;
      
      console.log('Project user_id:', project.user_id);
      
      // Then get the client profile using the user_id
      // Make sure we're selecting all the fields we need
      const { data: clientProfile, error: clientError } = await supabase
        .from('client_profiles')
        .select('contact_name, company_name, phone_number, website, company_address')
        .eq('id', project.user_id)
        .maybeSingle();
      
      if (clientError) throw clientError;
      
      console.log('Client profile data fetched from database:', clientProfile);
      
      // Get the user email via RPC function
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_email', { user_id: project.user_id });
      
      if (userError) throw userError;
      
      console.log('Email from auth:', userData);
      
      // Extract email from response - userData is an array with one object
      const email = userData && userData.length > 0 ? userData[0]?.email : null;

      // Check if any profile data exists besides email
      const hasProfileData = !!(
        clientProfile?.contact_name || 
        clientProfile?.company_name || 
        clientProfile?.phone_number || 
        clientProfile?.website
      );
      
      console.log('Has profile data:', hasProfileData);
      
      // Create a proper object with all the fields we need
      const combinedInfo = {
        contact_name: clientProfile?.contact_name || null,
        company_name: clientProfile?.company_name || null,
        phone_number: clientProfile?.phone_number || null,
        website: clientProfile?.website || null,
        email: email,
        is_profile_complete: hasProfileData // Set flag based on profile data existence
      };
      
      console.log('Combined client info:', combinedInfo);
      
      setClientInfo(combinedInfo);
    } catch (error) {
      console.error('Error fetching client info:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchClientInfo();
    }
  }, [projectId]);

  return {
    clientInfo,
    isLoading,
    error,
    refetch: fetchClientInfo
  };
};
