import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { clientProfileSchema } from '../components/profile/schema';

type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;

export const useSaveClientProfile = (user: User | null, logoUrl: string | null) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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
            updated_at: new Date().toISOString(),
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
            member_since: new Date().toISOString(),
          });
        
        error = insertError;
      }
      
      if (error) throw error;
      
      // Also update user metadata to keep it in sync
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          company_name: values.companyName,
          contact_name: values.contactName,
          company_address: values.companyAddress,
          company_description: values.companyDescription,
          phone_number: values.phoneNumber,
          website: websiteUrl,
          company_type: values.companyType,
          company_turnover: values.companyTurnover,
          employee_size: values.employeeSize,
          company_specialism: values.companySpecialism,
        }
      });
      
      if (updateUserError) {
        console.error('Warning: Could not update user metadata:', updateUserError);
        // We don't throw here as this is not critical
      }
      
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
    isSaving,
    saveProfile
  };
};
