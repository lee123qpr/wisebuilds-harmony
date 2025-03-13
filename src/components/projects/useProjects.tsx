
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
      
      // Check if we're authenticated
      const { data: authData } = await supabase.auth.getSession();
      console.log('Authentication status:', authData?.session ? 'Authenticated' : 'Not authenticated');
      
      if (authData?.session?.user) {
        console.log('User ID:', authData.session.user.id);
        console.log('User email:', authData.session.user.email);
      }
      
      // Fetch all projects - with the RLS policies, this will return 
      // only projects the user has permission to see
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*');
      
      if (fetchError) {
        console.error('Supabase query error:', fetchError);
        throw fetchError;
      }

      console.log('Projects fetched successfully:', data);
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
      } else {
        setProjects([]);
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
    
    // Subscribe to changes in the projects table
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
  }, []);

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
