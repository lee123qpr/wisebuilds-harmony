
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { User, MapPin, Briefcase } from 'lucide-react';

interface BasicInformationSectionProps {
  profile: FreelancerProfile;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({ profile }) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-3 text-primary-foreground/80">Basic Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
            <p className="font-medium">{profile.display_name || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Profession</p>
            <p className="font-medium">{profile.job_title || 'Not provided'}</p>
          </div>
        </div>
        
        {profile.location && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="font-medium">{profile.location}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInformationSection;
