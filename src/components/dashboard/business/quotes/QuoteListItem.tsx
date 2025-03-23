
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Coins, Check, Briefcase, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { QuoteWithFreelancer } from '@/types/quotes';
import ProjectCompletionStatus from '@/components/projects/ProjectCompletionStatus';
import { cn } from '@/lib/utils';
import { formatRole } from '@/utils/projectFormatters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';
import { FreelancerInfo } from '@/types/messaging';
import { Skeleton } from '@/components/ui/skeleton';
import VerificationBadge from '@/components/common/VerificationBadge';

interface QuoteListItemProps {
  quote: QuoteWithFreelancer;
  user: any;
}

const QuoteListItem: React.FC<QuoteListItemProps> = ({ quote, user }) => {
  const navigate = useNavigate();
  const [freelancerInfo, setFreelancerInfo] = useState<FreelancerInfo | null>(null);
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(false);
  
  // More robust project title handling
  const projectTitle = quote.project?.title && 
                      quote.project.title !== 'null' && 
                      quote.project.title !== 'undefined' && 
                      quote.project.title.trim() !== '' 
                        ? quote.project.title 
                        : 'Untitled Project';
  
  // Safely access role with proper fallback
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
  
  // Get card style based on quote status
  const getCardStyle = () => {
    switch (quote.status) {
      case 'accepted':
        return "border-2 border-green-500";
      case 'pending':
        return "border-2 border-amber-500";
      case 'declined':
        return "border-2 border-red-500";
      default:
        return "border-2 border-gray-300";
    }
  };

  return (
    <Card key={quote.id} className={cn("w-full", getCardStyle())}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <CardTitle className="text-xl">{projectTitle}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Looking for: <span className="font-medium text-primary">{roleFormatted}</span>
            </p>
          </div>
          {isAccepted && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Quote Accepted
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            {isLoadingFreelancer ? (
              <>
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{isAccepted ? 'Accepted' : 'Received'} on: {formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4" />
              <span>{priceType}: {formattedPrice}</span>
            </div>
            
            {quote.available_start_date && (
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>Start date: {format(new Date(quote.available_start_date), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
          
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
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/project/${quote.project_id}`)}
            >
              View Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/project/${quote.project_id}/quotes/${quote.id}`)}
            >
              View Quote Details
            </Button>
            
            {isAccepted && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate(`/dashboard/business?tab=messages&freelancerId=${quote.freelancer_id}`)}
              >
                <MessageSquare className="h-4 w-4" />
                Message Freelancer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteListItem;
