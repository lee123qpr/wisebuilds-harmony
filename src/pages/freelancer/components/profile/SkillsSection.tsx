
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
    <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-md">
          <Wrench className="h-4 w-4 text-primary" />
        </div>
        <span>Skills</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="outline"
            className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground border-secondary/20 px-3 py-1 rounded-full"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
