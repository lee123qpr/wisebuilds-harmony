
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VerificationBadge from '@/components/common/VerificationBadge';
import { FreelancerProfile } from '@/types/applications';

interface FreelancerAvatarProps {
  profile?: FreelancerProfile;
}

const FreelancerAvatar: React.FC<FreelancerAvatarProps> = ({ profile }) => {
  const getInitials = (name?: string) => {
    if (!name) return 'AF';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profile?.profile_photo} alt={profile?.display_name} />
        <AvatarFallback>{getInitials(profile?.display_name)}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-center gap-1">
        {profile?.email_verified && (
          <VerificationBadge 
            type="email" 
            status="verified" 
            showTooltip={true}
          />
        )}
        
        <VerificationBadge 
          type="id" 
          status={profile?.verified ? 'verified' : 'not_submitted'} 
          showTooltip={true}
        />
      </div>
    </div>
  );
};

export default FreelancerAvatar;
