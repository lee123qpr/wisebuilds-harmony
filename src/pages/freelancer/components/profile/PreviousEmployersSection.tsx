
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { format } from 'date-fns';

interface PreviousEmployersSectionProps {
  profile: FreelancerProfile;
}

const PreviousEmployersSection: React.FC<PreviousEmployersSectionProps> = ({ profile }) => {
  if (!profile.previous_employers || profile.previous_employers.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-md font-medium mb-3">Previous Employers</h3>
      <div className="space-y-4">
        {profile.previous_employers.map((employer, index) => (
          <div key={index} className="border p-3 rounded-md">
            <div className="font-medium">{employer.employerName}</div>
            <div className="text-sm">{employer.position}</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(employer.startDate), 'MMM yyyy')} - 
              {employer.current ? 
                ' Present' : 
                employer.endDate ? ` ${format(new Date(employer.endDate), 'MMM yyyy')}` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousEmployersSection;
