
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define ProjectDocument type
export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  role: string;
  created_at: string;
  location: string;
  work_type: string;
  duration: string;
  hiring_status: string;
  requires_equipment: boolean;
  requires_security_check?: boolean;
  requires_insurance: boolean;
  requires_qualifications?: boolean;
  published?: boolean;
  client_id?: string;
  client_name?: string;
  client_company?: string;
  start_date: string;
  applications: number;
  documents?: ProjectDocument[];
  requires_site_visits: boolean;
  status: string;
  chat_count?: number;
  quote_count?: number;
  updated_at: string;
  user_id: string;
  purchases_count?: number;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch projects with specific fields to avoid TypeScript type recursion issues
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          id, title, description, budget, role, created_at, location, 
          work_type, duration, hiring_status, requires_equipment, 
          requires_insurance, requires_site_visits, status, updated_at, 
          user_id, documents, applications, purchases_count, 
          start_date
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process projects to include application count and parse documents
      const processedProjects = projectsData.map((project: any) => ({
        ...project,
        // Ensure documents is properly parsed
        documents: Array.isArray(project.documents) 
          ? project.documents 
          : (project.documents ? JSON.parse(String(project.documents)) : [])
      }));
      
      // Fetch conversation counts and quote counts for each project
      const projectsWithCounts = await Promise.all(
        processedProjects.map(async (project) => {
          try {
            // Get chat count
            const { count: chatCount, error: chatError } = await supabase
              .from('conversations')
              .select('id', { count: 'exact', head: true })
              .eq('project_id', project.id);
            
            if (chatError) throw chatError;
            
            // Get quote count
            const { count: quoteCount, error: quoteError } = await supabase
              .from('quotes')
              .select('id', { count: 'exact', head: true })
              .eq('project_id', project.id);
            
            if (quoteError) throw quoteError;
            
            return {
              ...project,
              chat_count: chatCount || 0,
              quote_count: quoteCount || 0
            };
          } catch (err) {
            console.error(`Error fetching counts for project ${project.id}:`, err);
            return {
              ...project,
              chat_count: 0,
              quote_count: 0
            };
          }
        })
      );
      
      // Filter out projects that are completed or where someone has been hired
      const filteredProjects = projectsWithCounts.filter(project => {
        // Filter out completed projects
        if (project.status === 'completed') {
          console.log(`Filtering out completed project: ${project.title}`);
          return false;
        }
        
        // Filter out projects where someone is hired
        if (project.hiring_status === 'hired') {
          console.log(`Filtering out project with hired status: ${project.title}`);
          return false;
        }
        
        return true;
      });
      
      console.log(`Filtered out ${projectsWithCounts.length - filteredProjects.length} completed or hired projects`);
      setProjects(filteredProjects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      setError(error.message || 'An unexpected error occurred');
      toast({
        title: 'Failed to load projects',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  return { 
    projects, 
    isLoading, 
    refreshProjects,
    error
  };
};
