
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { QuoteWithFreelancer } from '@/types/quotes';
import { formatRole } from '@/utils/projectFormatters';

// Import our refactored components
import StatusBadge from './components/StatusBadge';
import FreelancerProfile from './components/FreelancerProfile';
import QuoteMetadata from './components/QuoteMetadata';
import QuoteActions from './components/QuoteActions';
import { useFreelancerInfo } from './hooks/useFreelancerInfo';

interface QuoteCardProps {
  quote: QuoteWithFreelancer;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  // Format dates and metadata
  const formattedDate = format(new Date(quote.created_at), 'MMM d, yyyy');
  const role = quote.project?.role || 'Not specified';
  const roleFormatted = formatRole(role);
  
  // Get freelancer info using our custom hook
  const {
    freelancerName,
    profilePhoto,
    isVerified,
    jobTitle,
    isLoadingFreelancer
  } = useFreelancerInfo(quote);
  
  // Format price values
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : 'Day Rate';
  
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 p-4 flex flex-row items-center justify-between">
        <FreelancerProfile
          freelancerName={freelancerName}
          profilePhoto={profilePhoto}
          jobTitle={jobTitle}
          isVerified={isVerified}
          isLoadingFreelancer={isLoadingFreelancer}
        />
        <StatusBadge status={quote.status} />
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          <QuoteMetadata
            formattedDate={formattedDate}
            roleFormatted={roleFormatted}
            priceType={priceType}
            priceValue={priceValue}
            availableStartDate={quote.available_start_date}
            estimatedDuration={quote.estimated_duration}
            durationUnit={quote.duration_unit}
          />
          
          <div className="line-clamp-3 text-sm">
            {quote.description || 'No description provided.'}
          </div>
          
          <QuoteActions
            projectId={quote.project_id}
            quoteId={quote.id}
            freelancerId={quote.freelancer_id}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
