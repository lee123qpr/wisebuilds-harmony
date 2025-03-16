
import React from 'react';
import { Project } from '@/components/projects/useProjects';
import { formatDateAgo } from '@/utils/projectFormatters';
import { Badge } from '@/components/ui/badge';
import { CalculatorIcon } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
  isPurchased?: boolean;
  isQuoted?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  isSelected, 
  onClick,
  isPurchased = false,
  isQuoted = false
}) => {
  return (
    <div 
      className={`p-4 cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-slate-100 border-l-4 border-l-primary' : ''}`}
      onClick={onClick}
    >
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{project.title}</h3>
          <span className="text-xs text-gray-500">{formatDateAgo(project.created_at)}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="bg-gray-50">{project.role}</Badge>
          <Badge variant="outline" className="bg-gray-50">{project.location}</Badge>
          <Badge variant="outline" className="bg-gray-50">{project.work_type}</Badge>
          {isPurchased && (
            <Badge className="bg-green-50 text-green-700 border-green-200">
              Purchased
            </Badge>
          )}
          {isQuoted && (
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
              <CalculatorIcon className="h-3 w-3" />
              <span>Quote Sent</span>
            </Badge>
          )}
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Budget:</span> {project.budget}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
