
import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectHeaderProps {
  project: any;
  quoteStatus?: string;
}

// Helper function to get status badge based on quote status
const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'accepted':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Hired
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case 'declined':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200 flex items-center gap-1">
          <X className="h-3 w-3" />
          Declined
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">
          No Quote Issued
        </Badge>
      );
  }
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, quoteStatus }) => {
  return (
    <div className="flex flex-wrap justify-between items-start gap-2">
      <h3 className="text-xl font-semibold">{project.title}</h3>
      {getStatusBadge(quoteStatus)}
    </div>
  );
};

export default ProjectHeader;
