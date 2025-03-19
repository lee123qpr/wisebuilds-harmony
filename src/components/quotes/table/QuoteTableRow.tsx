
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { TableRow, TableCell } from '@/components/ui/table';
import { QuoteWithFreelancer } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';
import FreelancerInfoCell from './FreelancerInfoCell';
import QuoteStatusBadge from './QuoteStatusBadge';
import QuoteActionsCell from './QuoteActionsCell';
import { getFreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';
import { FreelancerInfo } from '@/types/messaging';

interface QuoteTableRowProps {
  quote: QuoteWithFreelancer;
  onViewDetails: (quoteId: string) => void;
}

const QuoteTableRow: React.FC<QuoteTableRowProps> = ({ quote, onViewDetails }) => {
  const { user } = useAuth();
  const [freelancerInfo, setFreelancerInfo] = useState<FreelancerInfo | null>(null);
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(false);
  
  // Check if this quote belongs to the current user
  const differentClientId = quote.client_id !== user?.id;
  
  // Get freelancer info - handle potentially undefined properties safely
  const freelancer = quote.freelancer_profile || {};
  
  // Get price info
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : quote.day_rate 
        ? 'Day Rate' 
        : 'Not specified';
  
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';

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
  
  // Create a combined freelancer object with data from both sources
  const combinedFreelancer = {
    first_name: freelancer.first_name || freelancerInfo?.full_name?.split(' ')[0] || '',
    last_name: freelancer.last_name || (freelancerInfo?.full_name?.split(' ').slice(1).join(' ')) || '',
    display_name: freelancer.display_name || freelancerInfo?.full_name || 'Freelancer',
    profile_photo: freelancer.profile_photo || freelancerInfo?.profile_image || '',
    job_title: freelancer.job_title || 'Freelancer',
    rating: freelancer.rating || freelancerInfo?.rating || 0,
    location: freelancerInfo?.location || freelancer.location || '',
    verified: freelancerInfo?.verified || freelancer.verified || false, // Changed from id_verified to verified
  };
  
  return (
    <TableRow className={differentClientId ? "bg-yellow-50" : ""}>
      <TableCell className="font-medium">
        <FreelancerInfoCell 
          freelancer={combinedFreelancer}
          freelancerId={quote.freelancer_id}
          isLoading={isLoadingFreelancer}
        />
      </TableCell>
      <TableCell>{priceType}</TableCell>
      <TableCell className="font-medium">{priceValue}</TableCell>
      <TableCell>
        {quote.available_start_date 
          ? format(new Date(quote.available_start_date), 'MMM d, yyyy')
          : 'Not specified'}
      </TableCell>
      <TableCell>
        {quote.estimated_duration && quote.duration_unit
          ? `${quote.estimated_duration} ${quote.duration_unit}`
          : 'Not specified'}
      </TableCell>
      <TableCell>
        <QuoteStatusBadge status={quote.status} />
      </TableCell>
      <TableCell className="text-right">
        <QuoteActionsCell 
          differentClientId={differentClientId}
          onViewDetails={() => onViewDetails(quote.id)}
        />
      </TableCell>
    </TableRow>
  );
};

export default QuoteTableRow;
