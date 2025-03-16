
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  documents?: Array<any>;
  requires_site_visits: boolean;
  status: string;
  chat_count?: number; // Added for chat count
  updated_at: string;
  user_id: string;
  purchases_count?: number;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hiringFilter, setHiringFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch projects
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*, applications:project_applications(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process projects to include application count
      const processedProjects = projectsData.map((project: any) => ({
        ...project,
        applications: project.applications[0]?.count || 0,
        // parse documents if it exists
        documents: Array.isArray(project.documents) 
          ? project.documents 
          : (project.documents ? JSON.parse(String(project.documents)) : [])
      }));
      
      // Fetch conversation counts for each project
      const projectsWithChatCounts = await Promise.all(
        processedProjects.map(async (project) => {
          try {
            const { data: conversations, error: chatError } = await supabase
              .from('conversations')
              .select('id')
              .eq('project_id', project.id);
            
            if (chatError) throw chatError;
            
            return {
              ...project,
              chat_count: conversations?.length || 0
            };
          } catch (err) {
            console.error(`Error fetching chat count for project ${project.id}:`, err);
            return {
              ...project,
              chat_count: 0
            };
          }
        })
      );
      
      setProjects(projectsWithChatCounts);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
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
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    hiringFilter,
    setHiringFilter
  };
};
