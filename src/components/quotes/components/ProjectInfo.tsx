
import React from 'react';
import { Building, User, Calendar, Briefcase } from 'lucide-react';

interface ProjectInfoProps {
  projectTitle: string;
  clientName: string;
  quoteSubmitted?: boolean;
  submissionDate?: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ 
  projectTitle, 
  clientName,
  quoteSubmitted = false,
  submissionDate
}) => {
  // Enhanced validation to ensure clientName is displayed properly
  const displayName = clientName && 
                     clientName !== 'undefined' && 
                     clientName !== 'null' && 
                     clientName.trim() !== '' 
                       ? clientName 
                       : 'Client';
  
  console.log('ProjectInfo received clientName:', clientName);
  console.log('ProjectInfo displaying name:', displayName);
  
  return (
    <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-1 p-2 bg-green-100 rounded-full">
          <Briefcase className="h-5 w-5 text-green-700" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            {projectTitle}
          </h2>
          {quoteSubmitted && submissionDate && (
            <p className="text-sm text-slate-500">
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
