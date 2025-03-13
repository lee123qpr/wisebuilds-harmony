
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

// Define Project type using Tables from supabase/types.ts
export type ProjectDocument = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export type Project = Tables<'projects'> & {
  documents: ProjectDocument[];
};

export const useProjects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hiringFilter, setHiringFilter] = useState('all');
  const { toast } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching projects from Supabase...');
      
      // First, let's check if we're authenticated
      const { data: authData } = await supabase.auth.getSession();
      console.log('Authentication status:', authData?.session ? 'Authenticated' : 'Not authenticated');
      
      // Fetch all projects without any filters to see if we can access any data
      let query = supabase
        .from('projects')
        .select('*');
      
      console.log('Query being sent to Supabase:', query);
      
      const { data, error, status, statusText } = await query.order('created_at', { ascending: false });

      // Log more detailed response information
      console.log('Response status:', status, statusText);
      console.log('Raw response data:', data);
      
      if (error) {
        throw error;
      }

      console.log('Projects fetched:', data);
      console.log('Number of projects:', data?.length || 0);

      if (data) {
        // Convert the JSON documents field to ProjectDocument[] type
        const projectsWithParsedDocuments = data.map(project => ({
          ...project,
          documents: Array.isArray(project.documents) 
            ? project.documents 
            : (project.documents ? JSON.parse(String(project.documents)) : [])
        })) as Project[];

        setProjects(projectsWithParsedDocuments);
        console.log('Processed projects:', projectsWithParsedDocuments);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      setError(error.message || 'Failed to fetch projects');
      toast({
        variant: 'destructive',
        title: 'Error fetching projects',
        description: error.message || 'Failed to fetch projects. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For debugging purposes, check if a specific project exists
  const checkSpecificProject = async () => {
    try {
      // This is just a debug function to check if a specific project exists
      // You can remove this after debugging
      console.log('Debug: Checking for a specific project...');
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .limit(1);
      
      if (error) {
        console.error('Debug: Error checking for specific project:', error);
      } else {
        console.log('Debug: Project check result:', data);
      }
    } catch (err) {
      console.error('Debug: Exception in project check:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    checkSpecificProject(); // Debug function call
    
    // Subscribe to changes
    const projectsSubscription = supabase
      .channel('projects-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
        console.log('Project change received:', payload);
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectsSubscription);
    };
  }, []); // Keep dependency array empty for debugging

  // Return filter states along with projects data
  return { 
    projects, 
    isLoading, 
    error, 
    refreshProjects: fetchProjects,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    hiringFilter,
    setHiringFilter
  };
};
