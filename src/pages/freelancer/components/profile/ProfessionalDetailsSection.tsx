
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { Clock, Calendar, DollarSign, BriefcaseBusiness } from 'lucide-react';

interface ProfessionalDetailsSectionProps {
  profile: FreelancerProfile;
}

const ProfessionalDetailsSection: React.FC<ProfessionalDetailsSectionProps> = ({ profile }) => {
  const hasDetails = profile.hourly_rate || profile.day_rate || profile.availability || profile.experience;
  
  if (!hasDetails) {
    return null;
  }

  return (
    <div>
      <h3 className="text-md font-medium mb-3 flex items-center gap-2 text-foreground">
        <BriefcaseBusiness className="h-4 w-4 text-primary/70" />
        Professional Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profile.hourly_rate && (
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
              <p className="font-medium">{profile.hourly_rate}</p>
            </div>
          </div>
        )}
        
        {profile.day_rate && (
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Day Rate</p>
              <p className="font-medium">{profile.day_rate}</p>
            </div>
          </div>
        )}
        
        {profile.availability && (
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Availability</p>
              <p className="font-medium">{profile.availability}</p>
            </div>
          </div>
        )}
        
        {profile.experience && (
          <div className="flex items-start gap-2">
            <BriefcaseBusiness className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Experience</p>
              <p className="font-medium">{profile.experience}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDetailsSection;
