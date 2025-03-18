
import { useState, useEffect } from 'react';
import { LeadSettings } from './types';
import { ProjectLead } from '@/types/projects';
import { supabase } from '@/integrations/supabase/client';

export const useProjectLeadsGenerator = (leadSettings: LeadSettings | null) => {
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      
      try {
        console.log('Fetching projects with settings:', leadSettings);
        
        // Start with a base query to the projects table
        let query = supabase
          .from('projects')
          .select('*')
          .eq('status', 'active');
        
        // Apply filters only if leadSettings is provided
        if (leadSettings) {
          // Filter by role if specified and not 'any'
          if (leadSettings.role && leadSettings.role !== 'any') {
            // Convert role to lowercase for comparison to handle case sensitivity
            query = query.ilike('role', `%${leadSettings.role}%`);
          }
          
          // Filter by location if specified and not 'any'
          if (leadSettings.location && leadSettings.location !== 'any' && leadSettings.location !== 'Any') {
            query = query.ilike('location', `%${leadSettings.location.split(',')[0]}%`);
          }
          
          // Filter by work type if specified and not 'any'
          if (leadSettings.work_type && leadSettings.work_type !== 'any' && leadSettings.work_type !== 'Any') {
            query = query.eq('work_type', leadSettings.work_type);
          }
        }
        
        // Get the results
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching project leads:', error);
          setProjectLeads([]);
          return;
        }
        
        console.log('Fetched projects:', data);
        
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
          // These properties don't exist in the database, so we set defaults
          requires_security_check: false, 
          requires_insurance: project.requires_insurance || false,
          requires_qualifications: false,
          published: true, // Default value
          client_id: project.user_id, // Assuming user_id is client_id
          client_name: '', // Default empty string since it doesn't exist
          client_company: '', // Default empty string since it doesn't exist
          start_date: project.start_date || new Date().toISOString(), // Provide default value
          applications: project.applications || 0,
          documents: project.documents || null,
          requires_site_visits: project.requires_site_visits || false,
          status: project.status,
          updated_at: project.updated_at || project.created_at,
          user_id: project.user_id,
          purchases_count: project.purchases_count || 0
        })) as ProjectLead[] : [];
        
        setProjectLeads(leads);
      } catch (error) {
        console.error('Error in fetchLeads:', error);
        setProjectLeads([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Always fetch leads, even if leadSettings is null
    fetchLeads();
  }, [leadSettings]);

  return { projectLeads, isLoading };
};
