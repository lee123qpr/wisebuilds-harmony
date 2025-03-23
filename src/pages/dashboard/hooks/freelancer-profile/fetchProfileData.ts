
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UseToast } from '@/hooks/use-toast';

export async function fetchFreelancerProfileData(
  user: User | null, 
  setIsLoading: (loading: boolean) => void,
  toast: UseToast['toast']
) {
  if (!user) return null;
  
  try {
    setIsLoading(true);
    
    // Fetch the freelancer profile data
    const { data: profileData, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) {
      throw profileError;
    }
    
    console.log('Loaded profile data from database:', profileData);
    
    return profileData;
  } catch (error) {
    console.error('Error fetching profile:', error);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to load profile information.',
    });
    return null;
  } finally {
    setIsLoading(false);
  }
}
