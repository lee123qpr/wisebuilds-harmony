import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteWithFreelancer } from '@/types/quotes';
import ProjectCompletionStatus from '@/components/projects/ProjectCompletionStatus';
import { cn } from '@/lib/utils';
import { formatRole } from '@/utils/projectFormatters';
import { getFreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';
import { FreelancerInfo as FreelancerInfoType } from '@/types/messaging';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuoteListItemProps {
  quote: QuoteWithFreelancer;
  user: any;
}

const QuoteListItem: React.FC<QuoteListItemProps> = ({ quote, user }) => {
  const [freelancerInfo, setFreelancerInfo] = useState<FreelancerInfoType | null>(null);
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(false);
  
  const projectTitle = quote.project?.title && 
                      quote.project.title !== 'null' && 
                      quote.project.title !== 'undefined' && 
                      quote.project.title.trim() !== '' 
                        ? quote.project.title 
                        : 'Untitled Project';
  
  const role = quote.project?.role || 'Not specified';
  const roleFormatted = formatRole(role);
  
  const formattedDate = quote.created_at 
    ? format(new Date(quote.created_at), 'MMM d, yyyy')
    : 'Unknown date';
  
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : quote.day_rate 
        ? 'Day Rate' 
        : 'Not specified';
  
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';
  const formattedPrice = priceValue === 'Not specified' ? priceValue : `£${priceValue}`;
  
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

export const QuoteRetractedAlert = () => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        This quote has been retracted by the freelancer and is no longer available for acceptance.
      </AlertDescription>
    </Alert>
  );
};

export default QuoteListItem;
