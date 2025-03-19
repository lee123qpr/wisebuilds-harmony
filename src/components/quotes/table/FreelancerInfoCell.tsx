
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FreelancerInfoCellProps {
  freelancer: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    profile_photo?: string;
    job_title?: string;
    rating?: number;
    location?: string;
  };
  freelancerId: string;
}

const FreelancerInfoCell: React.FC<FreelancerInfoCellProps> = ({ freelancer, freelancerId }) => {
  const freelancerName = freelancer.display_name || 
    (freelancer.first_name && freelancer.last_name 
      ? `${freelancer.first_name} ${freelancer.last_name}`
      : 'Freelancer');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={freelancer.profile_photo} alt={freelancerName} />
          <AvatarFallback>{(freelancerName?.substring(0, 2) || 'FR').toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{freelancerName}</div>
          <div className="text-xs text-muted-foreground">{freelancer.job_title || 'Freelancer'}</div>
          
          {/* Show more freelancer details */}
          {freelancer.location && (
            <div className="text-xs text-muted-foreground mt-1">
              {freelancer.location}
            </div>
          )}
          
          {/* Check if the freelancer has a rating and show it */}
          {freelancer.rating && (
            <div className="text-xs text-amber-600 font-medium mt-1">
              ★ {Number(freelancer.rating).toFixed(1)} rating
            </div>
          )}
        </div>
      </div>
      
      {/* Add freelancer profile link */}
      <Button
        variant="outline"
        size="sm"
        className="mt-1 w-full text-xs flex items-center gap-1 justify-center"
        asChild
      >
        <Link to={`/freelancer/${freelancerId}`}>
          <ExternalLink className="h-3 w-3" />
          View Freelancer Profile
        </Link>
      </Button>
    </div>
  );
};

export default FreelancerInfoCell;
