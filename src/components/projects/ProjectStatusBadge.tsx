
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

type ProjectStatusBadgeProps = {
  status: string;
};

const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  switch (status) {
    case 'active':
      return (
        <Badge variant="outline" className="bg-[#F2FCE2] text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      );
    case 'in-progress':
      return (
        <Badge variant="outline" className="bg-[#FEF7CD] text-amber-700 border-amber-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          In Progress
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="outline" className="bg-[#F1F0FB] text-red-700 border-red-200 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    case 'draft':
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          Draft
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

export default ProjectStatusBadge;
