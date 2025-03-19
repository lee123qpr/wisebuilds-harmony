
import React from 'react';
import { format } from 'date-fns';
import { TableRow, TableCell } from '@/components/ui/table';
import { QuoteWithFreelancer } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';
import FreelancerInfoCell from './FreelancerInfoCell';
import QuoteStatusBadge from './QuoteStatusBadge';
import QuoteActionsCell from './QuoteActionsCell';

interface QuoteTableRowProps {
  quote: QuoteWithFreelancer;
  onViewDetails: (quoteId: string) => void;
}

const QuoteTableRow: React.FC<QuoteTableRowProps> = ({ quote, onViewDetails }) => {
  const { user } = useAuth();
  
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
  
  return (
    <TableRow className={differentClientId ? "bg-yellow-50" : ""}>
      <TableCell className="font-medium">
        <FreelancerInfoCell 
          freelancer={freelancer}
          freelancerId={quote.freelancer_id}
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
