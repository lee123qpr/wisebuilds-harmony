
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
      
      // First, check if we're authenticated
      const { data: authData } = await supabase.auth.getSession();
      console.log('Authentication status:', authData?.session ? 'Authenticated' : 'Not authenticated');
      
      if (!authData?.session) {
        console.warn('User is not authenticated. This might affect data access.');
      }
      
      // Log user information for debugging
      if (authData?.session?.user) {
        console.log('User ID:', authData.session.user.id);
        console.log('User email:', authData.session.user.email);
      }
      
      // Try to fetch some projects without any filters
      console.log('Attempting to fetch projects without restriction...');
      
      let query = supabase
        .from('projects')
        .select('*');
      
      console.log('Query being sent to Supabase:', query);
      
      const { data, error, status, statusText } = await query;

      // Log more detailed response information
      console.log('Response status:', status, statusText);
      console.log('Raw response data:', data);
      
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      // Let's check if we have permissions issues by trying a different approach
      if (!data || data.length === 0) {
        console.log('No projects found. Trying public access as fallback...');
        
        // Try with .rpc() call if available, or other public data
        const { data: publicData, error: publicError } = await supabase
          .from('projects')
          .select('*')
          .limit(5)
          .is('status', null)
          .or('status.eq.active,status.eq.completed');
          
        if (publicError) {
          console.error('Fallback query error:', publicError);
        } else {
          console.log('Fallback query results:', publicData);
          
          if (publicData && publicData.length > 0) {
            console.log('Fallback query returned data!');
          }
        }
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
      } else {
        // Handle case when data is null
        setProjects([]);
        console.log('No projects data received from Supabase');
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

  // For debugging purposes, check database structure
  const checkDatabaseAccess = async () => {
    try {
      console.log('DEBUG: Checking database access and structure...');
      
      // 1. Check if the projects table exists
      const { data: tableInfo, error: tableError } = await supabase
        .from('projects')
        .select('count()')
        .limit(1);
      
      if (tableError) {
        console.error('DEBUG: Table access error:', tableError);
      } else {
        console.log('DEBUG: Table access check:', tableInfo);
      }
      
      // 2. Check if we can get project by ID without checking auth
      console.log('DEBUG: Trying to get a single project without auth check...');
      const { data: anyProject, error: anyProjectError } = await supabase
        .from('projects')
        .select('id, title')
        .limit(1)
        .single();
      
      if (anyProjectError) {
        console.error('DEBUG: Error getting any project:', anyProjectError);
        
        if (anyProjectError.message.includes('row') && anyProjectError.message.includes('found')) {
          console.log('DEBUG: No projects exist in the database.');
        }
      } else {
        console.log('DEBUG: Found project:', anyProject);
      }
    } catch (err) {
      console.error('DEBUG: Exception in database check:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    checkDatabaseAccess(); // Debug function call
    
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
