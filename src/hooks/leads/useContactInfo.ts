
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
      
      // Get client information from both sources for comparison
      const [profileResponse, userResponse] = await Promise.all([
        // Get client profile from database
        supabase
          .from('client_profiles')
          .select('*')
          .eq('id', project.user_id)
          .maybeSingle(),
          
        // Get user auth data from edge function for comparison
        supabase.functions.invoke('get-user-email', {
          body: { userId: project.user_id }
        })
      ]);
      
      const clientProfile = profileResponse.data;
      const clientProfileError = profileResponse.error;
      
      if (clientProfileError) {
        console.error('Error fetching client profile:', clientProfileError);
      }
      
      const userData = userResponse.data;
      const userError = userResponse.error;
      
      if (userError) {
        console.error('Error fetching user data:', userError);
      }
      
      console.log('Client profile data:', clientProfile);
      console.log('User data from edge function:', userData);
      
      // Extract the email and metadata from the response
      const email = clientProfile?.email || userData?.email || null;
      const userMetadata = userData?.user_metadata || null;
      
      // Create a proper object with all the fields we need
      // First priority: client_profiles table data
      // Second priority: user metadata
      setClientInfo({
        contact_name: clientProfile?.contact_name || userMetadata?.full_name || null,
        company_name: clientProfile?.company_name || userMetadata?.company_name || null,
        phone_number: clientProfile?.phone_number || userMetadata?.phone_number || null,
        website: clientProfile?.website || userMetadata?.website || null,
        company_address: clientProfile?.company_address || userMetadata?.company_address || null,
        email: email,
        user_id: project.user_id,
        user_metadata: userMetadata,
        // A profile is considered complete if we have at least name, email, and phone
        is_profile_complete: !!(
          (clientProfile?.contact_name || userMetadata?.full_name) && 
          email && 
          (clientProfile?.phone_number || userMetadata?.phone_number)
        )
      });
      
      // If client profile doesn't exist but we have data from auth, let's create/update the profile
      if (!clientProfile && userMetadata) {
        try {
          const { error: upsertError } = await supabase
            .from('client_profiles')
            .upsert({
              id: project.user_id,
              contact_name: userMetadata.full_name,
              email: userData?.email,
              phone_number: userMetadata.phone_number,
              company_name: userMetadata.company_name,
              company_address: userMetadata.company_address,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });
            
          if (upsertError) {
            console.error('Error creating/updating client profile:', upsertError);
          } else {
            console.log('Successfully synchronized client profile with auth data');
          }
        } catch (syncError) {
          console.error('Exception during profile synchronization:', syncError);
        }
      }
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
