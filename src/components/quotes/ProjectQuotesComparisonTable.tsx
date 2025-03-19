
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Check, X, Clock } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { QuoteWithFreelancer } from '@/types/quotes';

interface ProjectQuotesComparisonTableProps {
  quotes: QuoteWithFreelancer[];
}

const ProjectQuotesComparisonTable: React.FC<ProjectQuotesComparisonTableProps> = ({ quotes }) => {
  const navigate = useNavigate();
  
  // Sort quotes by creation date (newest first)
  const sortedQuotes = useMemo(() => {
    return [...quotes].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [quotes]);

  const handleViewDetails = (quoteId: string) => {
    if (sortedQuotes.length > 0) {
      navigate(`/project/${sortedQuotes[0].project_id}/quotes/${quoteId}`);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="border">
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[200px]">Freelancer</TableHead>
            <TableHead>Quote Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedQuotes.map((quote) => {
            // Get freelancer info
            const freelancer = quote.freelancer_profile || {};
            const freelancerName = freelancer.display_name || 
              (freelancer.first_name && freelancer.last_name 
                ? `${freelancer.first_name} ${freelancer.last_name}`
                : 'Freelancer');
            
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
              <TableRow key={quote.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={freelancer.profile_photo} alt={freelancerName} />
                      <AvatarFallback>{freelancerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{freelancerName}</div>
                      <div className="text-xs text-muted-foreground">{freelancer.job_title || 'Freelancer'}</div>
                    </div>
                  </div>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(quote.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const QuoteStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case 'accepted':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Accepted
        </Badge>
      );
    case 'declined':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
          <X className="h-3 w-3" />
          Declined
        </Badge>
      );
    default:
      return null;
  }
};

export default ProjectQuotesComparisonTable;
