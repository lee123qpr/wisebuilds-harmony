
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import FreelancerInfo from '@/components/freelancer/FreelancerInfo';

interface FreelancerInfoCellProps {
  freelancer: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    profile_photo?: string;
    job_title?: string;
    rating?: number;
    reviews_count?: number;
    verified?: boolean;
    location?: string;
  };
  freelancerId: string;
  isLoading?: boolean;
}

const FreelancerInfoCell: React.FC<FreelancerInfoCellProps> = ({ 
  freelancer, 
  freelancerId,
  isLoading = false
}) => {
  const freelancerName = freelancer.display_name || 
    (freelancer.first_name && freelancer.last_name 
      ? `${freelancer.first_name} ${freelancer.last_name}`
      : 'Freelancer');

  return (
    <div className="flex flex-col gap-2">
      {/* Use the standardized FreelancerInfo component */}
      <FreelancerInfo
        freelancerId={freelancerId}
        freelancerName={freelancerName}
        profilePhoto={freelancer.profile_photo}
        jobTitle={freelancer.job_title || 'Freelancer'}
        isVerified={!!freelancer.verified}
        isLoading={isLoading}
        rating={freelancer.rating}
        reviewsCount={freelancer.reviews_count}
        linkToProfile={false}
      />
      
      {/* Show location separately if provided */}
      {freelancer.location && !isLoading && (
        <div className="text-xs text-muted-foreground mt-1">
          {freelancer.location}
        </div>
      )}
      
      {/* Freelancer profile link */}
      {!isLoading && (
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
      )}
    </div>
  );
};

export default FreelancerInfoCell;
