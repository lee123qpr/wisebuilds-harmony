
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenSquare, ArrowLeft, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ProjectHeaderProps {
  projectId: string;
  onDelete: () => Promise<void>;
}

const ProjectHeader = ({ projectId, onDelete }: ProjectHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/business')}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="ml-auto flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/project/${projectId}/edit`)}
        >
          <PenSquare className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
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
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProjectHeader;
