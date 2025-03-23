
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FreelancerProfile } from '@/types/applications';
import { Briefcase, Shield, GraduationCap, Award, Info } from 'lucide-react';
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
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-base break-words overflow-hidden text-balance">
              {profile.bio}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Professional Information */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 overflow-hidden">
          {/* Basic Information */}
          <BasicInformationSection profile={profile} />
          <Separator />
          
          {/* Contact Information */}
          <ContactInformationSection profile={profile} />
          <Separator />
          
          {/* Professional Details */}
          <ProfessionalDetailsSection profile={profile} />
          
          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <>
              <Separator />
              <SkillsSection profile={profile} />
            </>
          )}
          
          {/* Previous Employers */}
          {profile.previous_employers && profile.previous_employers.length > 0 && (
            <>
              <Separator />
              <PreviousEmployersSection profile={profile} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Qualifications */}
      {((profile.qualifications && profile.qualifications.length > 0) || 
         (profile.accreditations && profile.accreditations.length > 0)) && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Qualifications & Accreditations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <QualificationsAccreditationsSection profile={profile} />
          </CardContent>
        </Card>
      )}

      {/* Insurance */}
      {profile.indemnity_insurance && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Professional Insurance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IndemnityInsuranceSection profile={profile} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FreelancerProfileTab;
