
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();

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
      
      // Get client profile from database - this is the primary source of truth
      const { data: clientProfile, error: clientProfileError } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', project.user_id)
        .maybeSingle();
      
      if (clientProfileError) {
        console.error('Error fetching client profile:', clientProfileError);
      }
      
      console.log('Client profile data:', clientProfile);
      
      // Only fetch auth user data if profile doesn't exist at all
      let userData = null;
      let userError = null;
      
      if (!clientProfile) {
        console.log('No client profile found, fetching auth user data as fallback');
        const userResponse = await supabase.functions.invoke('get-user-email', {
          body: { userId: project.user_id }
        });
        
        userData = userResponse.data;
        userError = userResponse.error;
        
        if (userError) {
          console.error('Error fetching user data:', userError);
        }
        
        console.log('User data from edge function:', userData);
      }
      
      // Extract the email and metadata
      const email = clientProfile?.email || userData?.email || null;
      const userMetadata = userData?.user_metadata || null;
      
      // Always prioritize client_profiles data first:
      // 1. Use client_profiles data if available
      // 2. Only fall back to auth data if profile field is completely missing
      setClientInfo({
        contact_name: clientProfile?.contact_name || userData?.full_name || userMetadata?.full_name || null,
        company_name: clientProfile?.company_name || userMetadata?.company_name || null,
        phone_number: clientProfile?.phone_number || userMetadata?.phone_number || null,
        website: clientProfile?.website || userMetadata?.website || null,
        company_address: clientProfile?.company_address || userMetadata?.company_address || null,
        email: email,
        user_id: project.user_id,
        user_metadata: userMetadata,
        // A profile is considered complete if we have at least name, email, and phone
        is_profile_complete: !!(
          (clientProfile?.contact_name) && 
          email && 
          (clientProfile?.phone_number)
        )
      });
      
      // Only attempt to create/update the client profile if:
      // 1. The current user is the owner of the project/client profile
      // 2. We have data from auth that could be used to create/update the profile
      // 3. The profile doesn't exist
      if (user?.id === project.user_id && userData && userMetadata && userData.full_name && !clientProfile) {
        try {
          console.log('Creating client profile with auth data since none exists');
          const { error: upsertError } = await supabase
            .from('client_profiles')
            .upsert({
              id: project.user_id,
              contact_name: userData.full_name,
              email: userData?.email,
              phone_number: userMetadata.phone_number || userMetadata.phone,
              company_name: userMetadata.company_name,
              company_address: userMetadata.company_address,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });
            
          if (upsertError) {
            console.error('Error creating client profile:', upsertError);
          } else {
            console.log('Successfully created client profile with auth data');
          }
        } catch (syncError) {
          console.error('Exception during profile creation:', syncError);
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
  }, [projectId, user?.id]);

  return {
    clientInfo,
    isLoading,
    error,
    refetch: fetchClientInfo
  };
};
