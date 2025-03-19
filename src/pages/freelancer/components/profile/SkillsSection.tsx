
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { Badge } from '@/components/ui/badge';

interface SkillsSectionProps {
  profile: FreelancerProfile;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ profile }) => {
  if (!profile.skills || profile.skills.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-md font-medium mb-3">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill, index) => (
          <Badge key={index} variant="secondary">{skill}</Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
