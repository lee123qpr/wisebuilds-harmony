
import React from 'react';
import { Project } from '@/components/projects/useProjects';
import { MapPin, Users, Calendar as CalendarIcon } from 'lucide-react';
import { formatDateAgo, formatRole } from '@/utils/projectFormatters';
import WorkTypeBadge from './badges/WorkTypeBadge';
import DurationBadge from './badges/DurationBadge';
import BudgetBadge from './badges/BudgetBadge';
import HiringStatusBadge from './badges/HiringStatusBadge';
import PurchaseLimitBar from '@/components/projects/PurchaseLimitBar';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
  isPurchased?: boolean;
  isLeadsTab?: boolean; // New prop to indicate if we're in the My Leads tab
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onClick,
  isPurchased = false,
  isLeadsTab = false, // Default to false (Available Projects tab)
}) => {
  // Format dates as "X days ago"
  const postedDateAgo = formatDateAgo(project.created_at);
  const purchasesCount = project.purchases_count || 0;
  
  // Set border color based on which tab we're in
  const borderColor = isLeadsTab 
    ? (isSelected ? 'border-green-500' : 'border-transparent hover:bg-muted/50') 
    : (isSelected ? 'border-primary' : 'border-transparent hover:bg-muted/50');
  
  // Set highlight background color based on which tab we're in
  const bgColor = isSelected 
    ? isLeadsTab ? 'bg-green-50' : 'bg-primary/5'
    : '';
  
  return (
    <div 
      className={`p-3 cursor-pointer transition-all ${bgColor} border-l-4 ${borderColor}`} 
      onClick={onClick}
    >
      <div>
        <h3 className="font-semibold text-lg truncate">{project.title}</h3>
      </div>
      
      {/* Purchase limit indicator - full width */}
      <div className="mt-2 mb-2">
        <PurchaseLimitBar purchasesCount={purchasesCount} isPurchased={isPurchased} />
      </div>
      
      {/* Basic Information - No color (neutral gray) */}
      <div className="space-y-2 mt-2">
        <h4 className="text-xs uppercase font-semibold text-gray-500 tracking-wider mb-1">Project Details</h4>
        
        {/* Location */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
            <MapPin className="h-3 w-3 text-gray-600" />
          </span>
          <span className="text-sm text-gray-600 font-medium">{project.location}</span>
        </div>
        
        {/* Role */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
            <Users className="h-3 w-3 text-gray-600" />
          </span>
          <span className="text-sm text-gray-600 font-medium">{formatRole(project.role)}</span>
        </div>
        
        {/* Posted Date */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
            <CalendarIcon className="h-3 w-3 text-gray-600" />
          </span>
          <span className="text-sm text-gray-600 font-bold">Posted {postedDateAgo}</span>
        </div>
      </div>
      
      {/* Color-coded categories */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <WorkTypeBadge workType={project.work_type} />
        <DurationBadge duration={project.duration} />
        <BudgetBadge budget={project.budget} />
        <HiringStatusBadge status={project.hiring_status || 'enquiring'} />
      </div>
    </div>
  );
};

export default ProjectCard;
