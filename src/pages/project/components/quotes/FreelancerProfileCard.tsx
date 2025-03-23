
import React from 'react';
import { format } from 'date-fns';
import { CardTitle, CardDescription } from '@/components/ui/card';
import FreelancerInfo from '@/components/freelancer/FreelancerInfo';

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
    <div className="flex flex-col gap-2">
      <FreelancerInfo
        freelancerId={freelancer?.id || 'unknown'}
        freelancerName={freelancerName}
        profilePhoto={freelancer?.profile_photo}
        jobTitle={freelancer?.job_title || 'Freelancer'}
        isVerified={!!freelancer?.verified}
        rating={freelancer?.rating}
        reviewsCount={freelancer?.reviews_count}
      />
      
      <CardDescription>
        Submitted on {formattedDate}
      </CardDescription>
      
      {freelancer?.location && (
        <CardDescription className="mt-1">
          Location: {freelancer.location}
        </CardDescription>
      )}
    </div>
  );
};

export default FreelancerProfileCard;
