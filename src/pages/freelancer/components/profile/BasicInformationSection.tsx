
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { User, MapPin, Briefcase } from 'lucide-react';

interface BasicInformationSectionProps {
  profile: FreelancerProfile;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({ profile }) => {
  return (
    <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-md">
          <User className="h-4 w-4 text-primary" />
        </div>
        <span>Basic Information</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3">
          <User className="h-5 w-5 mt-0.5 text-primary/80" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
            <p className="font-medium text-foreground">{profile.display_name || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3">
          <Briefcase className="h-5 w-5 mt-0.5 text-primary/80" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Profession</p>
            <p className="font-medium text-foreground">{profile.job_title || 'Not provided'}</p>
          </div>
        </div>
        
        {profile.location && (
          <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3">
            <MapPin className="h-5 w-5 mt-0.5 text-primary/80" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="font-medium text-foreground">{profile.location}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInformationSection;
