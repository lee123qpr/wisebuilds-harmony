
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProjectApplication } from '@/types/applications';

export const useProjectApplications = (projectId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        // Fetch applications for this project
        const { data: appData, error: appError } = await supabase
          .from('project_applications')
          .select('*, user_id')
          .eq('project_id', projectId);
        
        if (appError) throw appError;
        
        if (!appData || appData.length === 0) {
          setApplications([]);
          setIsLoading(false);
          return;
        }
        
        // For each application, fetch the freelancer profile information
        const applicationsWithProfiles = await Promise.all(
          appData.map(async (app) => {
            try {
              // Fetch freelancer profile
              const { data: freelancerData, error: profileError } = await supabase
                .from('freelancer_profiles')
                .select('*')
                .eq('id', app.user_id)
                .maybeSingle();
                
              if (profileError) throw profileError;
              
              const freelancerProfile = freelancerData || {};
              
              // Build the application object
              return {
                id: app.id,
                projectId: app.project_id,
                userId: app.user_id,
                message: app.message || '',
                createdAt: app.created_at,
                email: freelancerProfile.email || null,
                firstName: freelancerProfile.first_name || null,
                lastName: freelancerProfile.last_name || null,
                displayName: freelancerProfile.display_name || null,
                phoneNumber: freelancerProfile.phone_number || null,
                jobTitle: freelancerProfile.job_title || null,
                location: freelancerProfile.location || null,
                profilePhoto: freelancerProfile.profile_photo || null,
              };
            } catch (error) {
              console.error('Error fetching profile for application:', error);
              // Return partial application data if profile fetch fails
              return {
                id: app.id,
                projectId: app.project_id,
                userId: app.user_id,
                message: app.message || '',
                createdAt: app.created_at,
                email: null,
                firstName: null,
                lastName: null,
                displayName: null,
                phoneNumber: null,
                jobTitle: null,
                location: null,
                profilePhoto: null,
              };
            }
          })
        );
        
        setApplications(applicationsWithProfiles);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        toast({
          title: 'Error fetching applications',
          description: 'Could not load applications. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [projectId, toast]);
  
  return { applications, isLoading, error };
};
