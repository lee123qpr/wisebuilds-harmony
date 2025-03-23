
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteWithFreelancer } from '@/types/quotes';
import ProjectCompletionStatus from '@/components/projects/ProjectCompletionStatus';
import { cn } from '@/lib/utils';
import { formatRole } from '@/utils/projectFormatters';
import { getFreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';
import { FreelancerInfo as FreelancerInfoType } from '@/types/messaging';

// Import our refactored components
import { getQuoteCardStyle } from './card/QuoteCardStyles';
import QuoteCardHeader from './card/CardHeader';
import FreelancerInfo from './card/FreelancerInfo';
import QuoteMetadata from './card/QuoteMetadata';
import QuoteActions from './card/QuoteActions';

interface QuoteListItemProps {
  quote: QuoteWithFreelancer;
  user: any;
}

const QuoteListItem: React.FC<QuoteListItemProps> = ({ quote, user }) => {
  const [freelancerInfo, setFreelancerInfo] = useState<FreelancerInfoType | null>(null);
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(false);
  
  // More robust project title handling
  const projectTitle = quote.project?.title && 
                      quote.project.title !== 'null' && 
                      quote.project.title !== 'undefined' && 
                      quote.project.title.trim() !== '' 
                        ? quote.project.title 
                        : 'Untitled Project';
  
  // Safely access role with proper fallback and format it
  const role = quote.project?.role || 'Not specified';
  const roleFormatted = formatRole(role);
  
  const formattedDate = quote.created_at 
    ? format(new Date(quote.created_at), 'MMM d, yyyy')
    : 'Unknown date';
  
  // Format price
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : quote.day_rate 
        ? 'Day Rate' 
        : 'Not specified';
  
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';
  const formattedPrice = priceValue === 'Not specified' ? priceValue : `£${priceValue}`;
  
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
                   
  const isAccepted = quote.status === 'accepted';

  return (
    <Card key={quote.id} className={cn("w-full", getQuoteCardStyle(quote.status))}>
      <QuoteCardHeader 
        projectTitle={projectTitle}
        isAccepted={isAccepted}
        roleFormatted={roleFormatted}
      />
      
      <CardContent>
        <div className="space-y-4">
          <FreelancerInfo
            freelancerName={freelancerName}
            profilePhoto={profilePhoto}
            jobTitle={jobTitle}
            isVerified={isVerified}
            isLoadingFreelancer={isLoadingFreelancer}
          />
          
          <QuoteMetadata
            formattedDate={formattedDate}
            priceType={priceType}
            formattedPrice={formattedPrice}
            availableStartDate={quote.available_start_date}
          />
          
          {isAccepted && (
            <ProjectCompletionStatus
              quoteId={quote.id}
              projectId={quote.project_id}
              freelancerId={quote.freelancer_id}
              clientId={quote.client_id}
              freelancerName={freelancerName}
              clientName={user?.user_metadata?.contact_name || 'Client'}
            />
          )}
          
          <QuoteActions
            projectId={quote.project_id}
            quoteId={quote.id}
            freelancerId={quote.freelancer_id}
            isAccepted={isAccepted}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteListItem;
