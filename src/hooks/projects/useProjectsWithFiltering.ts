
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/freelancer/types';

export const useProjectsWithFiltering = (applyLeadSettings: boolean = false, leadSettings: LeadSettings | null = null) => {
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      
      try {
        console.log('Fetching projects with applyLeadSettings:', applyLeadSettings);
        
        // Start with a base query to the projects table
        let query = supabase
          .from('projects')
          .select('*')
          .eq('status', 'active');
        
        // Apply lead settings filters if applicable
        if (applyLeadSettings && leadSettings) {
          console.log('Applying lead settings filters:', leadSettings);
          
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
        }
        
        // Get the results
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching projects:', error);
          setProjectLeads([]);
          return;
        }
        
        console.log('Fetched projects:', data?.length || 0);
        
        // Parse the data to match the ProjectLead type
        const leads = data ? data.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          budget: project.budget,
          role: project.role,
          created_at: project.created_at,
          location: project.location,
          work_type: project.work_type,
          tags: [], // Default empty array for tags if not present
          duration: project.duration,
          hiring_status: project.hiring_status,
          requires_equipment: project.requires_equipment || false,
          requires_security_check: false, // Default values for missing properties
          requires_insurance: project.requires_insurance || false,
          requires_qualifications: false, // Default value
          published: true, // Default value
          client_id: project.user_id, // Assuming user_id is client_id
          client_name: '', // Default empty string
          client_company: '', // Default empty string
          start_date: project.start_date || '',
          applications: project.applications || 0,
          documents: project.documents || null,
          requires_site_visits: project.requires_site_visits || false,
          status: project.status,
          updated_at: project.updated_at || project.created_at,
          user_id: project.user_id,
          purchases_count: project.purchases_count || 0 // Add this to match the ProjectLead interface
        })) as ProjectLead[] : [];
        
        setProjectLeads(leads);
      } catch (error) {
        console.error('Error in fetchProjects:', error);
        setProjectLeads([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [applyLeadSettings, leadSettings]);

  return { projectLeads, isLoading };
};
