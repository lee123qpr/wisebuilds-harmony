
import React from 'react';
import { Building, User, Calendar, Briefcase } from 'lucide-react';
import { formatRole } from '@/utils/projectFormatters';

interface ProjectInfoProps {
  projectTitle: string;
  clientName: string;
  quoteSubmitted?: boolean;
  submissionDate?: string;
  projectRole?: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ 
  projectTitle, 
  clientName,
  quoteSubmitted = false,
  submissionDate,
  projectRole
}) => {
  // Enhanced validation to ensure clientName is displayed properly
  const displayName = clientName && 
                     clientName !== 'undefined' && 
                     clientName !== 'null' && 
                     clientName.trim() !== '' 
                       ? clientName 
                       : 'Client';
  
  // Use formatRole from our utility to properly format the role
  const formattedRole = projectRole 
    ? formatRole(projectRole) 
    : 'Not specified';
  
  return (
    <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-1 p-2 bg-green-100 rounded-full">
          <Briefcase className="h-5 w-5 text-green-700" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            {projectTitle || 'Project'}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Looking for: <span className="font-medium text-primary">{formattedRole}</span>
          </p>
          {quoteSubmitted && submissionDate && (
            <p className="text-sm text-slate-500 mt-1">
              Quote submitted on {submissionDate}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-100 rounded-full">
          <User className="h-4 w-4 text-blue-700" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">
            Client: <span className="font-semibold">{displayName}</span>
          </p>
        </div>
      </div>
      
      <div className="mt-3 pl-2 border-l-2 border-green-300">
        <p className="text-sm text-slate-600">
          Provide a detailed quote outlining your services, pricing, and timeline for this project.
          Be clear and specific to help the client understand your proposal.
        </p>
      </div>
    </div>
  );
};

export default ProjectInfo;
