
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
      
      // Get user email via RPC function
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_email', { user_id: project.user_id });
      
      if (userError) throw userError;
      
      console.log('Email from auth:', userData);
      
      // Instead of using an RPC function that doesn't exist, let's
      // directly fetch basic data from the auth user through the existing functions
      // We'll assume the email has the user metadata we need
      let metadata: Record<string, any> | null = null;
      
      if (userData && Array.isArray(userData) && userData.length > 0) {
        // Use this email data as a source of information
        console.log('User email data available');
      }
      
      // Create a proper object with all the fields we need
      setClientInfo({
        // IMPORTANT: Always prioritize client profile data over metadata
        // since profile data can be updated by the user after signup
        contact_name: clientProfile?.contact_name || null,
        company_name: clientProfile?.company_name || null,
        phone_number: clientProfile?.phone_number || null,
        website: clientProfile?.website || null,
        company_address: clientProfile?.company_address || null,
        email: userData && Array.isArray(userData) && userData.length > 0 ? userData[0]?.email : null,
        user_metadata: metadata,
        // A profile is considered complete if we have at least name, email, and phone
        is_profile_complete: !!(
          clientProfile?.contact_name && 
          (userData && Array.isArray(userData) && userData.length > 0 ? userData[0]?.email : null) && 
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
