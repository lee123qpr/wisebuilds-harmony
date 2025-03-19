
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { Badge } from '@/components/ui/badge';

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
    <>
      {hasQualifications && (
        <div>
          <h3 className="text-md font-medium mb-3">Qualifications</h3>
          <ul className="list-disc pl-5 space-y-1">
            {profile.qualifications!.map((qualification, index) => (
              <li key={index} className="text-sm">{qualification}</li>
            ))}
          </ul>
        </div>
      )}
      
      {hasAccreditations && (
        <div>
          <h3 className="text-md font-medium mb-3">Accreditations</h3>
          <div className="flex flex-wrap gap-2">
            {profile.accreditations!.map((accreditation, index) => (
              <Badge key={index} variant="outline">{accreditation}</Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default QualificationsAccreditationsSection;
