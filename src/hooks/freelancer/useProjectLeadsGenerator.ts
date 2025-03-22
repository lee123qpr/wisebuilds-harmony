
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
          .eq('status', 'active')
          .order('created_at', { ascending: false }); // Order by created_at descending (newest first)
        
        // Apply minimal filters at database level - more detailed filtering will be done in useProjectsWithFiltering
        if (leadSettings) {
          // Filter by role if specified and not 'any'
          // Use more relaxed filtering at the database level
          if (leadSettings.role && leadSettings.role !== 'any' && leadSettings.role !== 'Any') {
            // Use ilike for case-insensitive partial matching on role
            query = query.ilike('role', `%${leadSettings.role.toLowerCase()}%`);
            console.log(`Database filtering by role: %${leadSettings.role.toLowerCase()}%`);
          }
        }
        
        // For the My Leads tab (with lead settings), also filter by hiring status
        // For the Available Projects tab (no lead settings), don't filter by hiring status
        if (leadSettings) {
          // Use a broader range of hiring statuses to ensure we get results
          query = query.in('hiring_status', ['enquiring', 'hiring', 'ready', 'urgent']);
          console.log('Database filtering for projects with hiring status: enquiring, hiring, ready, urgent');
        } else {
          console.log('No lead settings provided - showing all active projects regardless of hiring status');
        }
        
        // Execute the query
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching project leads:', error);
          setProjectLeads([]);
          return;
        }
        
        console.log('Fetched projects:', data);
        console.log('Number of projects fetched from database:', data ? data.length : 0);
        
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
          tags: project.tags || [], // Handle tags safely
          duration: project.duration,
          hiring_status: project.hiring_status,
          requires_equipment: project.requires_equipment || false,
          requires_security_check: project.requires_security_check || false,
          requires_insurance: project.requires_insurance || false,
          requires_qualifications: project.requires_qualifications || false,
          published: project.published || true,
          client_id: project.user_id, // Assuming user_id is client_id
          client_name: project.client_name || '',
          client_company: project.client_company || '',
          start_date: project.start_date || new Date().toISOString(),
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
