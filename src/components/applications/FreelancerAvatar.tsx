
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CheckCircle2 } from 'lucide-react';
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
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Email Verified
          </Badge>
        )}
        
        {profile?.verified && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            ID Verified
          </Badge>
        )}
      </div>
    </div>
  );
};

export default FreelancerAvatar;
