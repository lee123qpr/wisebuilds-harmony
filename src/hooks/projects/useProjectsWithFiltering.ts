
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/freelancer/types';
import { useToast } from '@/hooks/use-toast';

export const useProjectsWithFiltering = (applyLeadSettings: boolean = false, leadSettings: LeadSettings | null = null) => {
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      
      try {
        console.log('Fetching projects with applyLeadSettings:', applyLeadSettings);
        
        if (applyLeadSettings && !leadSettings) {
          console.log('Lead settings required but not provided, skipping fetch');
          setProjectLeads([]);
          setIsLoading(false);
          return;
        }
        
        // Start with a base query to the projects table
        let query = supabase
          .from('projects')
          .select('*')
          .eq('status', 'active');
        
        // Apply lead settings filters if applicable
        if (applyLeadSettings && leadSettings) {
          console.log('Applying lead settings filters:', leadSettings);
          
          // Filter by role if specified
          if (leadSettings.role && leadSettings.role !== 'any') {
            query = query.eq('role', leadSettings.role);
            console.log('Filtering by role:', leadSettings.role);
          }
          
          // Filter by location if specified and not "Any"
          if (leadSettings.location && leadSettings.location !== 'any' && leadSettings.location !== 'Any') {
            query = query.ilike('location', `%${leadSettings.location}%`);
            console.log('Filtering by location:', leadSettings.location);
          } else if (leadSettings.location === 'Any') {
            console.log('Location set to Any - including all locations');
          }
          
          // Filter by work type if specified
          if (leadSettings.work_type && leadSettings.work_type !== 'any') {
            query = query.eq('work_type', leadSettings.work_type);
            console.log('Filtering by work type:', leadSettings.work_type);
          }
        }
        
        // Get the results
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching projects:', error);
          toast({
            title: "Error fetching projects",
            description: error.message,
            variant: "destructive",
          });
          setProjectLeads([]);
          return;
        }
        
        console.log('Fetched projects:', data?.length || 0);
        
        if (!data || data.length === 0) {
          // If no projects found, we can insert some test data for development
          if (process.env.NODE_ENV === 'development') {
            console.log('No projects found, consider adding test data in development mode');
          }
        }
        
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
          tags: [], // Default empty array for tags since it doesn't exist in the projects table
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
          start_date: project.start_date || new Date().toISOString(), // Provide default value
          applications: project.applications || 0,
          documents: project.documents || null,
          requires_site_visits: project.requires_site_visits || false,
          status: project.status,
          updated_at: project.updated_at || project.created_at,
          user_id: project.user_id,
          purchases_count: project.purchases_count || 0 // Add this to match the ProjectLead interface
        })) as ProjectLead[] : [];
        
        setProjectLeads(leads);
      } catch (error: any) {
        console.error('Error in fetchProjects:', error);
        toast({
          title: "Error fetching projects",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
        setProjectLeads([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [applyLeadSettings, leadSettings, toast]);

  return { projectLeads, isLoading };
};
