
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSettingsSchema, LeadSettingsFormValues } from '../schema';
import { useLeadSettingsData } from './useLeadSettingsData';

export const useLeadSettingsForm = () => {
  const { leadSettings, isLoading, error } = useLeadSettingsData();
  const [isFormInitialized, setIsFormInitialized] = React.useState(false);
  
  // Create form with zod validation
  const form = useForm<LeadSettingsFormValues>({
    resolver: zodResolver(leadSettingsSchema),
    defaultValues: {
      role: '',
      location: '',
      budget: '',
      duration: '',
      work_type: '',
      project_type: [],
      keywords: [],
      hiring_status: '',
      requires_insurance: false,
      requires_site_visits: false,
      notifications_enabled: true,
      email_alerts: true,
    },
    mode: 'onChange',
  });

  // Update form with existing settings when data is loaded
  React.useEffect(() => {
    if (!leadSettings || isFormInitialized) return;
    
    console.log('Setting form values from existing settings:', leadSettings);
    
    // Handle arrays safely - ensure they're always arrays
    const project_type = Array.isArray(leadSettings.project_type) 
      ? leadSettings.project_type 
      : (leadSettings.project_type ? [leadSettings.project_type] : []);
    
    const keywords = Array.isArray(leadSettings.keywords) 
      ? leadSettings.keywords 
      : (leadSettings.keywords ? [leadSettings.keywords] : []);
    
    // Create values object with correct types
    const values: LeadSettingsFormValues = {
      role: leadSettings.role || '',
      location: leadSettings.location || '',
      budget: leadSettings.budget || leadSettings.max_budget || '',
      duration: leadSettings.duration || '',
      work_type: leadSettings.work_type || '',
      project_type,
      keywords,
      hiring_status: leadSettings.hiring_status || '',
      requires_insurance: !!leadSettings.requires_insurance,
      requires_site_visits: !!leadSettings.requires_site_visits,
      notifications_enabled: leadSettings.notifications_enabled !== false,
      email_alerts: leadSettings.email_alerts !== false,
    };
    
    form.reset(values);
    setIsFormInitialized(true);
  }, [leadSettings, form, isFormInitialized]);

  return {
    form,
    leadSettings,
    isLoading,
    error,
    isFormInitialized
  };
};
