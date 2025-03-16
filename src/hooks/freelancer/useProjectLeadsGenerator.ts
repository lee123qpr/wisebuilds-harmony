
import { useState, useEffect } from 'react';
import { LeadSettings } from './types';
import { ProjectLead } from '@/types/projects';
import { supabase } from '@/integrations/supabase/client';

export const useProjectLeadsGenerator = (leadSettings: LeadSettings | null) => {
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!leadSettings) return;
      
      setIsLoading(true);
      
      try {
        console.log('Fetching real lead data based on settings:', leadSettings);
        
        // Start with a base query to the projects table
        let query = supabase
          .from('projects')
          .select('*')
          .eq('status', 'active');
        
        // Filter by role if specified
        if (leadSettings.role) {
          query = query.eq('role', leadSettings.role);
        }
        
        // Filter by location if specified
        if (leadSettings.location) {
          query = query.ilike('location', `%${leadSettings.location}%`);
        }
        
        // Filter by work type if specified
        if (leadSettings.work_type) {
          query = query.eq('work_type', leadSettings.work_type);
        }
        
        // Get the results
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching project leads:', error);
          setProjectLeads([]);
          return;
        }
        
        console.log('Fetched real leads:', data);
        
        if (data) {
          // Convert the data to match the ProjectLead type
          const convertedLeads: ProjectLead[] = data.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            budget: project.budget,
            role: project.role,
            created_at: project.created_at,
            location: project.location,
            work_type: project.work_type,
            duration: project.duration,
            hiring_status: project.hiring_status || 'enquiring',
            requires_equipment: project.requires_equipment || false,
            requires_security_check: false, // Default values for required fields
            requires_insurance: project.requires_insurance || false,
            requires_qualifications: false, // Default values for required fields
            published: true, // Default to true
            client_id: project.user_id,
            client_name: '',
            client_company: '',
            applications: project.applications || 0,
            documents: project.documents,
            requires_site_visits: project.requires_site_visits || false,
            status: project.status,
            updated_at: project.updated_at,
            user_id: project.user_id,
            tags: [], // Default empty array
            purchases_count: project.purchases_count || 0,
            start_date: project.start_date
          }));
          
          setProjectLeads(convertedLeads);
        } else {
          setProjectLeads([]);
        }
      } catch (error) {
        console.error('Error in fetchLeads:', error);
        setProjectLeads([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, [leadSettings]);

  return { projectLeads, isLoading };
};
