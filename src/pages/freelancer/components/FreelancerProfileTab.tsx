
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { Info } from 'lucide-react';
import BasicInformationSection from './profile/BasicInformationSection';
import ContactInformationSection from './profile/ContactInformationSection';
import ProfessionalDetailsSection from './profile/ProfessionalDetailsSection';
import SkillsSection from './profile/SkillsSection';
import PreviousEmployersSection from './profile/PreviousEmployersSection';
import IndemnityInsuranceSection from './profile/IndemnityInsuranceSection';
import QualificationsAccreditationsSection from './profile/QualificationsAccreditationsSection';

interface FreelancerProfileTabProps {
  profile: FreelancerProfile;
}

const FreelancerProfileTab: React.FC<FreelancerProfileTabProps> = ({ profile }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Bio */}
      {profile.bio && (
        <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <span>About</span>
          </h3>
          <p className="text-foreground whitespace-pre-line break-words overflow-hidden text-balance">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Professional Information Sections */}
      <BasicInformationSection profile={profile} />
      <ContactInformationSection profile={profile} />
      <ProfessionalDetailsSection profile={profile} />
      <SkillsSection profile={profile} />
      <PreviousEmployersSection profile={profile} />
      <QualificationsAccreditationsSection profile={profile} />
      <IndemnityInsuranceSection profile={profile} />
    </div>
  );
};

export default FreelancerProfileTab;
