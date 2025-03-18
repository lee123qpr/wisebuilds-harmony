
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { FreelancerProfile } from '@/types/applications';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        
        {profile?.verified ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  ID Verified
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This freelancer's identity has been verified</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  Not Verified
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This freelancer has not verified their identity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default FreelancerAvatar;
