
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
      
      // Build the query without any filters initially - we want to see ALL projects
      let query = supabase
        .from('projects')
        .select('*');
      
      // We'll log the SQL query to see what's being sent to Supabase
      console.log('Query being sent to Supabase:', query);
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Projects fetched:', data);

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

  useEffect(() => {
    fetchProjects();
    
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
  }, []); // Remove the dependency on statusFilter for now to avoid unnecessary refetches

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
