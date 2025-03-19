
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FreelancerProfile } from '@/types/applications';
import { Mail, Phone } from 'lucide-react';
import ProfileHeaderSection from './profile/ProfileHeaderSection';
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
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <ProfileHeaderSection profile={profile} />
        </CardContent>
      </Card>

      {/* Professional Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 overflow-hidden">
          {/* Basic Information */}
          <BasicInformationSection profile={profile} />
          
          {/* Contact Information */}
          <ContactInformationSection profile={profile} />
          
          {/* Professional Details */}
          <ProfessionalDetailsSection profile={profile} />
          
          {/* Skills */}
          <SkillsSection profile={profile} />
          
          {/* Previous Employers */}
          <PreviousEmployersSection profile={profile} />

          {/* Professional Indemnity Insurance */}
          <IndemnityInsuranceSection profile={profile} />
          
          {/* Qualifications and Accreditations */}
          <QualificationsAccreditationsSection profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FreelancerProfileTab;
