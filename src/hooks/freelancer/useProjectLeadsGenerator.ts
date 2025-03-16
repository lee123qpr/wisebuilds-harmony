
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
        
        // Parse the data to match the ProjectLead type
        const leads = data ? data.map(project => ({
          ...project,
          tags: project.tags || [],
          documents: Array.isArray(project.documents) 
            ? project.documents 
            : (project.documents ? JSON.parse(String(project.documents)) : [])
        })) as ProjectLead[] : [];
        
        setProjectLeads(leads);
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
