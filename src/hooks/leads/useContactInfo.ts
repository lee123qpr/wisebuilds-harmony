
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClientInfo {
  contact_name: string | null;
  company_name: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  company_address: string | null;
  is_profile_complete: boolean;
  user_id: string;
  user_metadata?: Record<string, any> | null;
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
      const { data: clientProfile, error: clientError } = await supabase
        .from('client_profiles')
        .select('contact_name, company_name, phone_number, website, company_address, email')
        .eq('id', project.user_id)
        .maybeSingle();
      
      if (clientError) throw clientError;
      
      console.log('Client profile data:', clientProfile);
      
      // If no email in profile, get user email via edge function
      let email = clientProfile?.email || null;
      
      if (!email) {
        // Get user email via edge function
        const { data: userData, error: userError } = await supabase.functions.invoke(
          'get-user-email',
          {
            body: { userId: project.user_id }
          }
        );
        
        if (userError) throw userError;
        
        console.log('User data from edge function:', userData);
        
        // Extract the email from the response
        email = userData?.email || null;
        console.log('Extracted email:', email);
      }
      
      // Create a proper object with all the fields we need
      // Prioritize profile data
      setClientInfo({
        contact_name: clientProfile?.contact_name || null,
        company_name: clientProfile?.company_name || null,
        phone_number: clientProfile?.phone_number || null,
        website: clientProfile?.website || null,
        company_address: clientProfile?.company_address || null,
        email: email,
        user_id: project.user_id,
        user_metadata: null, // Not using metadata
        // A profile is considered complete if we have at least name, email, and phone
        is_profile_complete: !!(
          clientProfile?.contact_name && 
          email && 
          clientProfile?.phone_number
        )
      });
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
