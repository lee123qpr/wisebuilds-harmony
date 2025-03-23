
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { clientProfileSchema } from '../components/profile/schema';

type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;

interface UseLoadClientProfileProps {
  user: User | null;
  form: UseFormReturn<ClientProfileFormValues>;
  setLogoUrl: (url: string | null) => void;
  setMemberSince: (date: string | null) => void;
  setEmailVerified: (verified: boolean) => void;
  setJobsCompleted: (count: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useLoadClientProfile = ({
  user,
  form,
  setLogoUrl,
  setMemberSince,
  setEmailVerified,
  setJobsCompleted,
  setIsLoading
}: UseLoadClientProfileProps) => {
  const { toast } = useToast();

  // Fetch client profile data
  useEffect(() => {
    async function getProfileData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        // Extract user metadata for fallback values
        const userMetadata = user.user_metadata || {};
        
        if (data) {
          // Type assertion to access is_individual property
          const profileData = data as any;
          
          // Populate form with existing data
          form.reset({
            isIndividual: profileData.is_individual || false,
            companyName: profileData.company_name || userMetadata.company_name || '',
            contactName: profileData.contact_name || userMetadata.contact_name || userMetadata.full_name || '',
            companyLocation: profileData.company_address || userMetadata.company_address || '',
            companyDescription: profileData.company_description || userMetadata.company_description || '',
            phoneNumber: profileData.phone_number || userMetadata.phone_number || userMetadata.phone || '',
            website: profileData.website || userMetadata.website || '',
            companyType: profileData.company_type || userMetadata.company_type || '',
            companyTurnover: profileData.company_turnover || userMetadata.company_turnover || '',
            employeeSize: profileData.employee_size || userMetadata.employee_size || '',
            companySpecialism: profileData.company_specialism || userMetadata.company_specialism || '',
          });
          
          setLogoUrl(profileData.logo_url);
          setMemberSince(profileData.member_since);
          setEmailVerified(profileData.email_verified || false);
          setJobsCompleted(profileData.jobs_completed || 0);
        } else {
          // Create initial profile with data from auth.user metadata
          const isIndividual = userMetadata.is_individual || false;
          const companyName = userMetadata.company_name || '';
          const contactName = userMetadata.contact_name || userMetadata.full_name || '';
          const phoneNumber = userMetadata.phone_number || userMetadata.phone || '';
          const companyLocation = userMetadata.company_address || '';
          const companyDescription = userMetadata.company_description || '';
          
          form.reset({
            isIndividual,
            companyName,
            contactName,
            companyLocation,
            companyDescription,
            phoneNumber,
            website: userMetadata.website || '',
            companyType: userMetadata.company_type || '',
            companyTurnover: userMetadata.company_turnover || '',
            employeeSize: userMetadata.employee_size || '',
            companySpecialism: userMetadata.company_specialism || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load profile information.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    getProfileData();
  }, [user, form, toast, setLogoUrl, setMemberSince, setEmailVerified, setJobsCompleted, setIsLoading]);
};
