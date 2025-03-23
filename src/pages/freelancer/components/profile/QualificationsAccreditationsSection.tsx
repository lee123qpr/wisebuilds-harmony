
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
    <div className="space-y-6">
      {hasQualifications && (
        <div>
          <h3 className="text-md font-medium mb-3 text-primary-foreground/80 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            Qualifications
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {profile.qualifications!.map((qualification, index) => (
              <li key={index} className="text-base">{qualification}</li>
            ))}
          </ul>
        </div>
      )}
      
      {hasAccreditations && (
        <div>
          <h3 className="text-md font-medium mb-3 text-primary-foreground/80 flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            Accreditations
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.accreditations!.map((accreditation, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1 border-primary/30 bg-primary/5 text-primary">
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
