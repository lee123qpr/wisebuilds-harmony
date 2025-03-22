
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
        
        // Apply filters only if leadSettings is provided
        if (leadSettings) {
          console.log('Applying lead setting filters');
          
          // Filter by role if specified and not 'any'
          if (leadSettings.role && leadSettings.role !== 'any' && leadSettings.role !== 'Any') {
            // Use ilike for case-insensitive partial matching
            query = query.ilike('role', `%${leadSettings.role.toLowerCase()}%`);
            console.log(`Filtering by role: %${leadSettings.role.toLowerCase()}%`);
          }
          
          // Filter by location if specified and not 'any'
          if (leadSettings.location && leadSettings.location !== 'any' && leadSettings.location !== 'Any') {
            // Extract the first part of the location before any commas for broader matching
            const locationPart = leadSettings.location.split(',')[0].trim().toLowerCase();
            query = query.ilike('location', `%${locationPart}%`);
            console.log(`Filtering by location: %${locationPart}%`);
          }
          
          // Filter by work type if specified and not 'any'
          if (leadSettings.work_type && leadSettings.work_type !== 'any' && leadSettings.work_type !== 'Any') {
            query = query.eq('work_type', leadSettings.work_type);
            console.log(`Filtering by work type: ${leadSettings.work_type}`);
          }
          
          // Add additional filters for other fields if needed
          if (leadSettings.requires_insurance === true) {
            query = query.eq('requires_insurance', true);
            console.log('Filtering for projects requiring insurance');
          }
          
          if (leadSettings.requires_site_visits === true) {
            query = query.eq('requires_site_visits', true);
            console.log('Filtering for projects requiring site visits');
          }
          
          // Only filter by hiring status if leadSettings is provided
          // Add hiring status filter to only get available projects
          query = query.in('hiring_status', ['enquiring', 'hiring']);
          console.log('Filtering for projects with hiring status: enquiring, hiring');
        } else {
          console.log('No lead settings provided, fetching all active projects');
        }
        
        // Get the results
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching project leads:', error);
          setProjectLeads([]);
          return;
        }
        
        console.log('Fetched projects:', data);
        console.log('Number of projects fetched:', data ? data.length : 0);
        
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
          tags: [], // Provide an empty array as default since tags don't exist in DB
          duration: project.duration,
          hiring_status: project.hiring_status,
          requires_equipment: project.requires_equipment || false,
          requires_security_check: false, // Set default value for field not in DB
          requires_insurance: project.requires_insurance || false,
          requires_qualifications: false, // Set default value for field not in DB
          published: true, // Default value
          client_id: project.user_id, // Assuming user_id is client_id
          client_name: '', // Default empty string for field not in DB
          client_company: '', // Default empty string for field not in DB
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
