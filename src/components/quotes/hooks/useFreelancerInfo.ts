
import { useState, useEffect } from 'react';
import { getFreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';
import { FreelancerInfo } from '@/types/messaging';
import { QuoteWithFreelancer } from '@/types/quotes';

export const useFreelancerInfo = (quote: QuoteWithFreelancer) => {
  const [freelancerInfo, setFreelancerInfo] = useState<FreelancerInfo | null>(null);
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(false);
  
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
  
  // Derived values
  const freelancerName = quote.freelancer_profile?.display_name || 
    (quote.freelancer_profile?.first_name && quote.freelancer_profile?.last_name 
      ? `${quote.freelancer_profile.first_name} ${quote.freelancer_profile.last_name}`
      : freelancerInfo?.full_name || freelancerInfo?.name || 'Freelancer');
  
  const profilePhoto = quote.freelancer_profile?.profile_photo || 
                     freelancerInfo?.profile_image || 
                     freelancerInfo?.profilePhoto;
  
  const isVerified = quote.freelancer_profile?.verified || 
                   freelancerInfo?.verified || 
                   freelancerInfo?.isVerified || 
                   false;
  
  const jobTitle = quote.freelancer_profile?.job_title || 
                 freelancerInfo?.job_title || 
                 freelancerInfo?.jobTitle || 
                 'Freelancer';
                 
  return {
    freelancerInfo,
    isLoadingFreelancer,
    freelancerName,
    profilePhoto,
    isVerified,
    jobTitle
  };
};
