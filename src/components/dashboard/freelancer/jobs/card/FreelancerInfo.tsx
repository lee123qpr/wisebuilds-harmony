
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import VerificationBadge from '@/components/common/VerificationBadge';
import { getFreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';
import { FreelancerInfo as FreelancerInfoType } from '@/types/messaging';
import { QuoteWithFreelancer } from '@/types/quotes';

interface FreelancerInfoProps {
  quote: QuoteWithFreelancer;
}

const FreelancerInfo: React.FC<FreelancerInfoProps> = ({ quote }) => {
  const [freelancerInfo, setFreelancerInfo] = useState<FreelancerInfoType | null>(null);
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(false);
  
  // Fetch freelancer info if profile is empty or incomplete
  useEffect(() => {
    const hasEmptyProfile = !quote.freelancer_profile || 
                            (!quote.freelancer_profile.display_name && 
                             !quote.freelancer_profile.first_name && 
                             !quote.freelancer_profile.last_name);
    
    if (hasEmptyProfile && !freelancerInfo && !isLoadingFreelancer) {
      const fetchFreelancerInfo = async () => {
        setIsLoadingFreelancer(true);
        try {
          const info = await getFreelancerInfo(quote.freelancer_id);
          setFreelancerInfo(info);
        } catch (error) {
          console.error('Error fetching freelancer info:', error);
        } finally {
          setIsLoadingFreelancer(false);
        }
      };
      
      fetchFreelancerInfo();
    }
  }, [quote.freelancer_id, quote.freelancer_profile, freelancerInfo, isLoadingFreelancer]);
  
  // Create a combined freelancer name from both sources
  const freelancerName = quote.freelancer_profile?.display_name || 
    (quote.freelancer_profile?.first_name && quote.freelancer_profile?.last_name 
      ? `${quote.freelancer_profile.first_name} ${quote.freelancer_profile.last_name}`
      : freelancerInfo?.full_name || freelancerInfo?.name || 'Freelancer');
  
  // Get the profile photo from either source
  const profilePhoto = quote.freelancer_profile?.profile_photo || 
                     freelancerInfo?.profile_image || 
                     freelancerInfo?.profilePhoto;
  
  // Check if freelancer is verified from either source
  const isVerified = quote.freelancer_profile?.verified || 
                   freelancerInfo?.verified || 
                   freelancerInfo?.isVerified || 
                   false;
  
  // Get the job title with fallbacks
  const jobTitle = quote.freelancer_profile?.job_title || 
                 freelancerInfo?.job_title || 
                 freelancerInfo?.jobTitle || 
                 'Freelancer';
  
  if (isLoadingFreelancer) {
    return (
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3 mb-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={profilePhoto} alt={freelancerName} />
        <AvatarFallback>{freelancerName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium flex items-center gap-1">
          {freelancerName}
          {isVerified && <VerificationBadge type="none" status="verified" showTooltip={false} className="h-4 w-4" />}
        </p>
        <p className="text-sm text-muted-foreground">{jobTitle}</p>
      </div>
    </div>
  );
};

export default FreelancerInfo;
