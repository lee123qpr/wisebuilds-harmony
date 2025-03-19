
import React from 'react';
import { FreelancerProfile } from '@/types/applications';

interface BasicInformationSectionProps {
  profile: FreelancerProfile;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({ profile }) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-3">Basic Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
          <p>{profile.display_name || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Profession</p>
          <p>{profile.job_title || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Location</p>
          <p>{profile.location || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;
