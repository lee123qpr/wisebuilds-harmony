
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award } from 'lucide-react';

interface QualificationsAccreditationsSectionProps {
  profile: FreelancerProfile;
}

const QualificationsAccreditationsSection: React.FC<QualificationsAccreditationsSectionProps> = ({ profile }) => {
  const hasQualifications = profile.qualifications && profile.qualifications.length > 0;
  const hasAccreditations = profile.accreditations && profile.accreditations.length > 0;
  
  if (!hasQualifications && !hasAccreditations) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40 space-y-6">
      {hasQualifications && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <span>Qualifications</span>
          </h3>
          <ul className="space-y-3">
            {profile.qualifications!.map((qualification, index) => (
              <li key={index} className="bg-muted/50 p-3 rounded-md text-foreground">
                {qualification}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {hasAccreditations && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <span>Accreditations</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.accreditations!.map((accreditation, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground border-secondary/20 px-3 py-1 rounded-full"
              >
                {accreditation}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QualificationsAccreditationsSection;
