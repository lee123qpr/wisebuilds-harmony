
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
      
      // Only fetch auth user data if profile is incomplete or missing contact_name
      let userData = null;
      let userError = null;
      
      const profileHasName = clientProfile && clientProfile.contact_name;
      
      if (!profileHasName) {
        console.log('Profile missing contact_name, fetching auth user data');
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
      const contactName = clientProfile?.contact_name || 
                          userData?.full_name || 
                          userMetadata?.full_name || 
                          null;
      
      // Create a proper object with all the fields we need
      // First priority: client_profiles table data
      // Second priority: user metadata (only if profile data is missing)
      setClientInfo({
        contact_name: contactName,
        company_name: clientProfile?.company_name || userMetadata?.company_name || null,
        phone_number: clientProfile?.phone_number || userMetadata?.phone_number || null,
        website: clientProfile?.website || userMetadata?.website || null,
        company_address: clientProfile?.company_address || userMetadata?.company_address || null,
        email: email,
        user_id: project.user_id,
        user_metadata: userMetadata,
        // A profile is considered complete if we have at least name, email, and phone
        is_profile_complete: !!(
          contactName && 
          email && 
          (clientProfile?.phone_number)
        )
      });
      
      // If client profile doesn't exist but we have data from auth, let's create/update the profile
      // Only attempt this if we got meaningful data from auth
      if ((!clientProfile || !profileHasName) && userMetadata && userData?.full_name) {
        try {
          // Create a profile in the database using auth data
          console.log('Creating/updating client profile with auth data');
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
