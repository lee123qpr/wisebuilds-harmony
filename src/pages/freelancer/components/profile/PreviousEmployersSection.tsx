
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { format } from 'date-fns';
import { Briefcase, Building, Calendar } from 'lucide-react';

interface PreviousEmployersSectionProps {
  profile: FreelancerProfile;
}

const PreviousEmployersSection: React.FC<PreviousEmployersSectionProps> = ({ profile }) => {
  if (!profile.previous_employers || profile.previous_employers.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-md">
          <Building className="h-4 w-4 text-primary" />
        </div>
        <span>Previous Employers</span>
      </h3>
      <div className="space-y-4">
        {profile.previous_employers.map((employer, index) => (
          <div key={index} className="bg-muted/50 p-4 rounded-md">
            <div className="flex flex-col gap-2">
              <div className="font-medium flex items-center gap-2 text-foreground">
                <Building className="h-4 w-4 text-primary" />
                {employer.employerName}
              </div>
              <div className="text-sm flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                {employer.position}
              </div>
              <div className="text-sm flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(employer.startDate), 'MMM yyyy')} - 
                {employer.current ? 
                  <span className="font-medium text-primary"> Present</span> : 
                  employer.endDate ? ` ${format(new Date(employer.endDate), 'MMM yyyy')}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousEmployersSection;
