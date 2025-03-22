
import React from 'react';
import { Calendar, Coins, MapPin, Briefcase, User } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectMetadataProps {
  project: any;
  formattedDate: string;
  clientName: string;
  isLoadingClientInfo: boolean;
}

const ProjectMetadata: React.FC<ProjectMetadataProps> = ({
  project,
  formattedDate,
  clientName,
  isLoadingClientInfo
}) => {
  // Ensure we have a valid client name display
  const displayName = clientName && clientName.trim() !== '' 
    ? clientName 
    : 'Client';
    
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        
        {project.budget && (
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4" />
            <span>{project.budget}</span>
          </div>
        )}
        
        {project.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{project.location}</span>
          </div>
        )}
        
        {project.role && (
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>{project.role}</span>
          </div>
        )}
      </div>
      
      {/* Client information */}
      {!isLoadingClientInfo && (
        <div className="flex items-center gap-1 text-sm text-blue-600">
          <User className="h-4 w-4" />
          <span>Client: <span className="font-semibold">{displayName}</span></span>
        </div>
      )}
    </div>
  );
};

export default ProjectMetadata;
