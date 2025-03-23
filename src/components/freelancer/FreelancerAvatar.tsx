
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VerificationBadge from '@/components/common/VerificationBadge';
import { FreelancerProfile } from '@/types/applications';

interface FreelancerAvatarProps {
  profile?: FreelancerProfile;
  size?: 'sm' | 'md' | 'lg';
  showVerificationBadges?: boolean;
}

const FreelancerAvatar: React.FC<FreelancerAvatarProps> = ({ 
  profile, 
  size = 'md',
  showVerificationBadges = true
}) => {
  const getInitials = (name?: string) => {
    if (!name) return 'FP';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Size mappings for consistent avatar sizing
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className={`${sizeClasses[size]} border-2 border-slate-100`}>
        <AvatarImage src={profile?.profile_photo} alt={profile?.display_name} />
        <AvatarFallback className="bg-slate-100 text-slate-600 text-xl font-semibold">
          {getInitials(profile?.display_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`)}
        </AvatarFallback>
      </Avatar>
      
      {showVerificationBadges && (
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
      )}
    </div>
  );
};

export default FreelancerAvatar;
