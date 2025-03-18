
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, PenSquare, Trash2, FileText, MessageSquare, Quote } from 'lucide-react';
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
import { ProjectDeleteHandler } from '@/components/projects/ProjectDeleteHandler';

type ProjectActionsProps = {
  applications: number;
  projectId: string;
  hasDocuments?: boolean;
  refreshProjects?: () => Promise<void>;
  projectTitle?: string;
  quoteCount?: number;
};

const ProjectActions = ({ 
  applications, 
  projectId, 
  hasDocuments, 
  refreshProjects, 
  projectTitle,
  quoteCount = 0
}: ProjectActionsProps) => {
  const navigate = useNavigate();
  const isTestProject = projectTitle?.startsWith('Test ');

  const handleViewProject = () => {
    // Navigate to view project details page
    navigate(`/project/${projectId}`);
  };

  const handleEditProject = () => {
    // Navigate to edit project page
    navigate(`/project/${projectId}/edit`);
  };

  const handleViewDocuments = () => {
    // Navigate to project documents page
    navigate(`/project/${projectId}/documents`);
  };

  const handleViewApplications = () => {
    // Navigate to project applications page
    navigate(`/project/${projectId}/applications`);
  };
  
  const handleViewQuotes = () => {
    // Navigate to project quotes comparison page
    navigate(`/project/${projectId}/quotes`);
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
      
      <ProjectDeleteHandler projectId={projectId} refreshProjects={refreshProjects}>
        {(handleDelete) => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" title={isTestProject ? "Delete Test Project" : "Delete"}>
                <Trash2 className={`h-4 w-4 ${isTestProject ? "text-red-500" : ""}`} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {isTestProject 
                    ? "This will delete the test project. Any user can delete test projects."
                    : "This action cannot be undone. This will permanently delete the project and all associated data."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </ProjectDeleteHandler>
      
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
      
      {quoteCount > 0 && (
        <Button 
          variant="ghost" 
          size="icon" 
          title="Quotes"
          onClick={handleViewQuotes}
        >
          <Quote className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ProjectActions;
