
import React from 'react';
import { FreelancerProfile } from '@/types/applications';

interface ProfessionalDetailsSectionProps {
  profile: FreelancerProfile;
}

const ProfessionalDetailsSection: React.FC<ProfessionalDetailsSectionProps> = ({ profile }) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-3">Professional Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profile.hourly_rate && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
            <p>{profile.hourly_rate}</p>
          </div>
        )}
        {profile.day_rate && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Day Rate</p>
            <p>{profile.day_rate}</p>
          </div>
        )}
        {profile.availability && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Availability</p>
            <p>{profile.availability}</p>
          </div>
        )}
        {profile.experience && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Experience</p>
            <p>{profile.experience}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDetailsSection;
