
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';

interface SkillsSectionProps {
  profile: FreelancerProfile;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ profile }) => {
  if (!profile.skills || profile.skills.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-md font-medium mb-3 flex items-center gap-2 text-foreground">
        <Wrench className="h-4 w-4 text-primary/70" />
        Skills
      </h3>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="bg-primary/5 text-primary hover:bg-primary/10 px-3 py-1 rounded-full"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
