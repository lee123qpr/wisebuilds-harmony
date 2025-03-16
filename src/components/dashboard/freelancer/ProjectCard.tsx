
import React from 'react';
import { Project } from '@/components/projects/useProjects';
import { MapPin, Users, Calendar as CalendarIcon, Check } from 'lucide-react';
import { formatDateAgo, formatRole } from '@/utils/projectFormatters';
import WorkTypeBadge from './badges/WorkTypeBadge';
import DurationBadge from './badges/DurationBadge';
import BudgetBadge from './badges/BudgetBadge';
import HiringStatusBadge from './badges/HiringStatusBadge';
import { Badge } from '@/components/ui/badge';
import PurchaseLimitBar from '@/components/projects/PurchaseLimitBar';
interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
  isPurchased?: boolean;
}
const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onClick,
  isPurchased = false
}) => {
  // Format dates as "X days ago"
  const postedDateAgo = formatDateAgo(project.created_at);
  const purchasesCount = project.purchases_count || 0;
  return <div className={`p-5 cursor-pointer transition-all ${isSelected ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-muted/50 border-l-4 border-transparent'}`} onClick={onClick}>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg truncate">{project.title}</h3>
        
        {isPurchased && <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Purchased
          </Badge>}
      </div>
      
      {/* Purchase limit indicator */}
      <div className="mt-3 mb-3">
        <PurchaseLimitBar purchasesCount={purchasesCount} />
      </div>
      
      {/* Basic Information - No color (neutral gray) */}
      <div className="space-y-3 mt-3 mb-4">
        {/* Location */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <MapPin className="h-4 w-4 text-gray-600" />
          </span>
          <span className="text-sm text-gray-600 font-medium">{project.location}</span>
        </div>
        
        {/* Role */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <Users className="h-4 w-4 text-gray-600" />
          </span>
          <span className="text-sm text-gray-600 font-medium">{formatRole(project.role)}</span>
        </div>
        
        {/* Posted Date */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <CalendarIcon className="h-4 w-4 text-gray-600" />
          </span>
          <span className="text-sm text-gray-600 font-bold">Posted {postedDateAgo}</span>
        </div>
      </div>
      
      {/* Color-coded categories */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {/* Work Type - Orange shades */}
        <WorkTypeBadge workType={project.work_type} />
        
        {/* Duration - Blue shades */}
        <DurationBadge duration={project.duration} />
        
        {/* Budget - Green shades */}
        <BudgetBadge budget={project.budget} />
        
        {/* Hiring Status - Purple shades */}
        <HiringStatusBadge status={project.hiring_status || 'enquiring'} />
      </div>
    </div>;
};
export default ProjectCard;
