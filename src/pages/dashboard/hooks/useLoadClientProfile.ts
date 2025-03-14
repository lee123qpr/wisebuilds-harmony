
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
        
        if (data) {
          // Populate form with existing data
          form.reset({
            companyName: data.company_name || '',
            contactName: data.contact_name || '',
            companyAddress: data.company_address || '',
            companyDescription: data.company_description || '',
            phoneNumber: data.phone_number || '',
            website: data.website || '',
            companyType: data.company_type || '',
            companyTurnover: data.company_turnover || '',
            employeeSize: data.employee_size || '',
            companySpecialism: data.company_specialism || '',
          });
          
          setLogoUrl(data.logo_url);
          setMemberSince(data.member_since);
          setEmailVerified(data.email_verified || false);
          setJobsCompleted(data.jobs_completed || 0);
        } else {
          // Create initial profile with data from auth.user metadata
          const companyName = user.user_metadata?.company_name || '';
          const contactName = user.user_metadata?.contact_name || '';
          const phoneNumber = user.user_metadata?.phone || '';
          const companyAddress = user.user_metadata?.company_address || '';
          const companyDescription = user.user_metadata?.company_description || '';
          
          form.reset({
            companyName,
            contactName,
            companyAddress,
            companyDescription,
            phoneNumber,
            website: '',
            companyType: '',
            companyTurnover: '',
            employeeSize: '',
            companySpecialism: '',
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
