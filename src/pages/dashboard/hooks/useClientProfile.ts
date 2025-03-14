
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { clientProfileSchema } from '../components/profile/schema';
import { z } from 'zod';

type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;

export const useClientProfile = (user: User | null) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [jobsCompleted, setJobsCompleted] = useState<number>(0);
  
  const form = useForm<ClientProfileFormValues>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      companyAddress: '',
      companyDescription: '',
      phoneNumber: '',
      website: '',
      companyType: '',
      companyTurnover: '',
      employeeSize: '',
      companySpecialism: '',
    },
    mode: 'onChange',
  });

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
  }, [user, form, toast]);

  const saveProfile = async (values: ClientProfileFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Prepare website URL (ensure it has https:// if not empty)
      const websiteUrl = values.website ? 
        (values.website.match(/^https?:\/\//) ? values.website : `https://${values.website}`) : 
        values.website;
      
      // First, check if the profile already exists
      const { data: existingProfile } = await supabase
        .from('client_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      // Determine whether to insert or update
      let error;
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('client_profiles')
          .update({
            company_name: values.companyName,
            contact_name: values.contactName,
            company_address: values.companyAddress,
            company_description: values.companyDescription,
            phone_number: values.phoneNumber,
            website: websiteUrl,
            logo_url: logoUrl,
            company_type: values.companyType,
            company_turnover: values.companyTurnover,
            employee_size: values.employeeSize,
            company_specialism: values.companySpecialism,
          })
          .eq('id', user.id);
        
        error = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('client_profiles')
          .insert({
            id: user.id,
            company_name: values.companyName,
            contact_name: values.contactName,
            company_address: values.companyAddress,
            company_description: values.companyDescription,
            phone_number: values.phoneNumber,
            website: websiteUrl,
            logo_url: logoUrl,
            company_type: values.companyType,
            company_turnover: values.companyTurnover,
            employee_size: values.employeeSize,
            company_specialism: values.companySpecialism,
          });
        
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save profile information. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    isLoading,
    isSaving,
    logoUrl,
    uploadingLogo,
    setUploadingLogo,
    setLogoUrl,
    saveProfile,
    memberSince,
    emailVerified,
    jobsCompleted
  };
};
