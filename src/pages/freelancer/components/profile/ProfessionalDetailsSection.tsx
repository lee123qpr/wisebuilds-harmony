
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
    <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-md">
          <BriefcaseBusiness className="h-4 w-4 text-primary" />
        </div>
        <span>Professional Details</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {profile.hourly_rate && (
          <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3">
            <DollarSign className="h-5 w-5 mt-0.5 text-primary/80" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
              <p className="font-medium text-foreground">{profile.hourly_rate}</p>
            </div>
          </div>
        )}
        
        {profile.day_rate && (
          <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3">
            <DollarSign className="h-5 w-5 mt-0.5 text-primary/80" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Day Rate</p>
              <p className="font-medium text-foreground">{profile.day_rate}</p>
            </div>
          </div>
        )}
        
        {profile.availability && (
          <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3">
            <Calendar className="h-5 w-5 mt-0.5 text-primary/80" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Availability</p>
              <p className="font-medium text-foreground">{profile.availability}</p>
            </div>
          </div>
        )}
        
        {profile.experience && (
          <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3">
            <BriefcaseBusiness className="h-5 w-5 mt-0.5 text-primary/80" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Experience</p>
              <p className="font-medium text-foreground">{profile.experience}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDetailsSection;
