
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, Eye, User } from 'lucide-react';
import { QuoteWithFreelancer } from '@/types/quotes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import QuoteStatusBadge from './table/QuoteStatusBadge';
import { getFreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { FreelancerInfo } from '@/types/messaging';
import VerificationBadge from '@/components/common/VerificationBadge';
import { formatRole } from '@/utils/projectFormatters';

interface QuoteCardProps {
  quote: QuoteWithFreelancer;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const navigate = useNavigate();
  const [freelancerInfo, setFreelancerInfo] = useState<FreelancerInfo | null>(null);
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(false);
  
  // Format the created date
  const formattedDate = format(new Date(quote.created_at), 'MMM d, yyyy');
  
  console.log('Quote data in QuoteCard:', quote);
  console.log('Project role from quote:', quote.project?.role);
  
  // Get project role if available - with proper fallback
  const role = quote.project?.role || 'Not specified';
  const roleFormatted = formatRole(role);
  
  // Get freelancer info
  const freelancer = quote.freelancer_profile || {};
  
  // Fetch freelancer info if profile is empty
  useEffect(() => {
    const hasEmptyProfile = !freelancer.display_name && !freelancer.first_name && !freelancer.last_name;
    
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
  }, [quote.freelancer_id, freelancer, freelancerInfo, isLoadingFreelancer]);
  
  // Create a combined freelancer name from both sources
  const freelancerName = freelancer.display_name || 
    (freelancer.first_name && freelancer.last_name 
      ? `${freelancer.first_name} ${freelancer.last_name}`
      : freelancerInfo?.full_name || 'Freelancer');
  
  // Get quote price info
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : 'Day Rate';
  
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';
  
  const handleViewDetails = () => {
    navigate(`/project/${quote.project_id}/quotes/${quote.id}`);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
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
                <AvatarImage src={freelancer.profile_photo || freelancerInfo?.profile_image} alt={freelancerName} />
                <AvatarFallback>{freelancerName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium flex items-center gap-1">
                  {freelancerName}
                  {(freelancer.verified || freelancerInfo?.verified) && 
                    <VerificationBadge type="none" status="verified" showTooltip={false} className="h-4 w-4" />
                  }
                </h3>
                <p className="text-sm text-muted-foreground">{freelancer.job_title || freelancerInfo?.job_title || 'Freelancer'}</p>
              </div>
            </>
          )}
        </div>
        <QuoteStatusBadge status={quote.status} />
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Submitted on {formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <User className="h-4 w-4" />
              <span>Looking for: {roleFormatted}</span>
            </div>
          </div>
          
          <div className="line-clamp-3 text-sm">
            {quote.description || 'No description provided.'}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-2">
            {/* Price info */}
            <div className="border rounded-md p-3 flex flex-col">
              <span className="text-sm text-muted-foreground mb-1 flex items-center">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                {priceType}
              </span>
              <span className="font-medium">{priceValue}</span>
            </div>
            
            {/* Start date */}
            <div className="border rounded-md p-3 flex flex-col">
              <span className="text-sm text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Start Date
              </span>
              <span className="font-medium">
                {quote.available_start_date 
                  ? format(new Date(quote.available_start_date), 'MMM d, yyyy')
                  : 'Not specified'}
              </span>
            </div>
            
            {/* Duration */}
            <div className="border rounded-md p-3 flex flex-col">
              <span className="text-sm text-muted-foreground mb-1 flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Duration
              </span>
              <span className="font-medium">
                {quote.estimated_duration && quote.duration_unit
                  ? `${quote.estimated_duration} ${quote.duration_unit}`
                  : 'Not specified'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewDetails}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
