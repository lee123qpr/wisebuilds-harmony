
import React from 'react';
import { Calendar, Coins, MapPin, Briefcase, User, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectMetadataProps {
  project: any;
  formattedDate: string;
  clientName: string;
  isLoadingClientInfo: boolean;
  clientEmail?: string | null;
  clientPhone?: string | null;
}

const ProjectMetadata: React.FC<ProjectMetadataProps> = ({
  project,
  formattedDate,
  clientName,
  isLoadingClientInfo,
  clientEmail,
  clientPhone
}) => {
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
      {isLoadingClientInfo ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm">
            <User className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-4 w-4" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <User className="h-4 w-4" />
            <span>Client: <span className="font-semibold">{clientName || 'Unknown Client'}</span></span>
          </div>
          
          {clientEmail && (
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${clientEmail}`} className="hover:underline">{clientEmail}</a>
            </div>
          )}
          
          {clientPhone && (
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <Phone className="h-4 w-4" />
              <a href={`tel:${clientPhone}`} className="hover:underline">{clientPhone}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectMetadata;
