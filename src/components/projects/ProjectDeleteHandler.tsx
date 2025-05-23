
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectDeleteHandlerProps {
  projectId: string;
  children: (handleDelete: () => Promise<void>) => React.ReactNode;
  refreshProjects?: () => Promise<void>;
}

export const ProjectDeleteHandler: React.FC<ProjectDeleteHandlerProps> = ({ 
  projectId, 
  children, 
  refreshProjects 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      if (!projectId) {
        toast({
          variant: 'destructive',
          title: "Error deleting project",
          description: "Project ID is missing",
        });
        return;
      }

      console.log('Attempting to delete project with ID:', projectId);

      // First check if the current user is the owner of the project
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;
      
      if (!currentUserId) {
        toast({
          variant: 'destructive',
          title: "Authentication error",
          description: "You must be logged in to delete projects",
        });
        return;
      }
      
      // Check project ownership and if it's a test project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id, title')
        .eq('id', projectId)
        .single();
        
      if (projectError) {
        console.error('Error checking project ownership:', projectError);
        throw new Error("Couldn't verify project ownership");
      }
      
      // Check if it's a test project (title starts with "Test ")
      const isTestProject = projectData.title && projectData.title.startsWith('Test ');
      console.log('Is test project?', isTestProject, 'Project title:', projectData.title);
      
      // Allow deletion if user is owner OR if it's a test project
      if (projectData.user_id !== currentUserId && !isTestProject) {
        toast({
          variant: 'destructive',
          title: "Permission denied",
          description: "You can only delete projects that you created",
        });
        return;
      }

      console.log('Proceeding with project deletion...');
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Supabase error deleting project:', error);
        throw error;
      }

      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });

      console.log('Project deleted successfully, refreshing projects list...');
      
      // Refresh projects list if the function is provided
      if (refreshProjects) {
        await refreshProjects();
        console.log('Projects list refreshed after deletion');
      } else {
        console.log('No refresh function provided, navigating back to dashboard');
        // Navigate only if the refresh isn't provided (means we're on a detail page)
        navigate('/dashboard/business');
      }
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        variant: 'destructive',
        title: "Error deleting project",
        description: error.message || "There was an error deleting the project.",
      });
    }
  };

  return <>{children(handleDelete)}</>;
};
