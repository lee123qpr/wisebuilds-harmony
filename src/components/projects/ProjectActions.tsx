
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, MessageSquare, FileText } from 'lucide-react';

type ProjectActionsProps = {
  applications: number;
  projectId: string;
  hasDocuments?: boolean;
};

const ProjectActions = ({ applications, projectId, hasDocuments }: ProjectActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="icon" title="View">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" title="Edit">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" title="Delete">
        <Trash2 className="h-4 w-4" />
      </Button>
      {hasDocuments && (
        <Button variant="ghost" size="icon" title="Documents">
          <FileText className="h-4 w-4" />
        </Button>
      )}
      {applications > 0 && (
        <Button variant="ghost" size="icon" title="Applications">
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ProjectActions;
