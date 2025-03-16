
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, PenSquare, Trash2, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ProjectActionsProps = {
  applications: number;
  projectId: string;
  hasDocuments?: boolean;
  refreshProjects?: () => Promise<void>;
};

const ProjectActions = ({ applications, projectId, hasDocuments, refreshProjects }: ProjectActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewProject = () => {
    // Navigate to view project details page
    navigate(`/project/${projectId}`);
  };

  const handleEditProject = () => {
    // Navigate to edit project page
    navigate(`/project/${projectId}/edit`);
  };

  const handleDeleteProject = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });

      // Refresh projects list after deletion
      if (refreshProjects) {
        refreshProjects();
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

  const handleViewDocuments = () => {
    // Navigate to project documents page
    navigate(`/project/${projectId}/documents`);
  };

  const handleViewApplications = () => {
    // Navigate to project applications page
    navigate(`/project/${projectId}/applications`);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        title="View" 
        onClick={handleViewProject}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        title="Edit" 
        onClick={handleEditProject}
      >
        <PenSquare className="h-4 w-4" />
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {hasDocuments && (
        <Button 
          variant="ghost" 
          size="icon" 
          title="Documents"
          onClick={handleViewDocuments}
        >
          <FileText className="h-4 w-4" />
        </Button>
      )}
      
      {applications > 0 && (
        <Button 
          variant="ghost" 
          size="icon" 
          title="Applications"
          onClick={handleViewApplications}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ProjectActions;
