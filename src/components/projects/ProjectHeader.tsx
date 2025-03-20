
import React from 'react';
import { Button } from '@/components/ui/button';
import { PenSquare, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ProjectDeleteHandler } from '@/components/projects/ProjectDeleteHandler';
import BackButton from '@/components/common/BackButton';

interface ProjectHeaderProps {
  projectId: string;
  refreshProjects?: () => Promise<void>;
}

const ProjectHeader = ({ projectId, refreshProjects }: ProjectHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <BackButton to="/dashboard/business" />
      <div className="ml-auto flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => {}}
          className="flex items-center gap-2"
        >
          <PenSquare className="h-4 w-4" />
          Edit
        </Button>
        
        <ProjectDeleteHandler projectId={projectId} refreshProjects={refreshProjects}>
          {(handleDelete) => (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
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
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </ProjectDeleteHandler>
      </div>
    </div>
  );
};

export default ProjectHeader;
