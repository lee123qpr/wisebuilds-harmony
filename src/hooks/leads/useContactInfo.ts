
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
        .select('contact_name, company_name, phone_number, website, company_address')
        .eq('id', project.user_id)
        .maybeSingle();
      
      if (clientError) throw clientError;
      
      console.log('Client profile data:', clientProfile);
      
      // Get user metadata and email via RPC function
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_email', { user_id: project.user_id });
      
      if (userError) throw userError;
      
      console.log('Email from auth:', userData);
      
      // Get user metadata from auth - we need to use a custom function
      // because we don't have direct access to the auth.users table
      const { data: authUser, error: authError } = await supabase
        .rpc('get_user_metadata', { user_id: project.user_id });
        
      if (authError) {
        console.error('Error fetching user metadata:', authError);
      }
      
      const metadata = authUser && authUser.length > 0 ? authUser[0]?.metadata : null;
      console.log('User metadata:', metadata);
        
      // Extract the useful data from all sources
      const email = userData && userData.length > 0 ? userData[0]?.email : null;
      
      // Create a proper object with all the fields we need
      setClientInfo({
        // Prioritize client profile data, but use user metadata as fallback
        contact_name: clientProfile?.contact_name || metadata?.full_name || null,
        company_name: clientProfile?.company_name || null,
        phone_number: clientProfile?.phone_number || metadata?.phone_number || null,
        website: clientProfile?.website || null,
        company_address: clientProfile?.company_address || null,
        email: email,
        user_metadata: metadata,
        // A profile is considered complete if we have at least name, email, and phone
        is_profile_complete: !!(
          (clientProfile?.contact_name || metadata?.full_name) && 
          email && 
          (clientProfile?.phone_number || metadata?.phone_number)
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
