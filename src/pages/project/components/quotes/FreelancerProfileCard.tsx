
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VerificationBadge from '@/components/common/VerificationBadge';

interface FreelancerProfileCardProps {
  freelancer: any;
  quoteDate: string;
}

const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({ 
  freelancer, 
  quoteDate 
}) => {
  const freelancerName = freelancer?.display_name || 
    (freelancer?.first_name && freelancer?.last_name 
      ? `${freelancer.first_name} ${freelancer.last_name}`
      : 'Freelancer');
      
  const formattedDate = format(new Date(quoteDate), 'MMMM d, yyyy');

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={freelancer?.profile_photo} alt={freelancerName} />
        <AvatarFallback>{freelancerName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="flex items-center gap-1">
          {freelancerName}
          {freelancer?.verified && 
            <VerificationBadge type="none" status="verified" showTooltip={false} className="h-4 w-4" />
          }
        </CardTitle>
        <CardDescription>
          {freelancer?.job_title || 'Freelancer'} • Submitted on {formattedDate}
        </CardDescription>
        {freelancer?.location && (
          <CardDescription className="mt-1">
            Location: {freelancer.location}
          </CardDescription>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfileCard;
