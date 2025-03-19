
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Check, X, Clock, AlertCircle, FileText, AlertTriangle } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { QuoteWithFreelancer } from '@/types/quotes';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';

interface ProjectQuotesComparisonTableProps {
  quotes: QuoteWithFreelancer[];
}

const ProjectQuotesComparisonTable: React.FC<ProjectQuotesComparisonTableProps> = ({ quotes }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Sort quotes by creation date (newest first)
  const sortedQuotes = useMemo(() => {
    console.log('Sorting quotes in table component. Received quotes:', quotes);
    if (!Array.isArray(quotes)) {
      console.error('Expected quotes to be an array but got:', typeof quotes);
      return [];
    }
    return [...quotes].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [quotes]);

  const handleViewDetails = (quoteId: string) => {
    try {
      if (!quoteId) {
        console.error('Cannot navigate: Invalid quoteId');
        toast.error('Cannot view quote details');
        return;
      }
      
      if (sortedQuotes.length > 0) {
        const projectId = sortedQuotes[0].project_id;
        console.log(`Navigating to quote details: /project/${projectId}/quotes/${quoteId}`);
        navigate(`/project/${projectId}/quotes/${quoteId}`);
      } else {
        console.error('Cannot navigate: No quotes available');
        toast.error('Cannot view quote details', {
          description: 'No project information available'
        });
      }
    } catch (error) {
      console.error('Error navigating to quote details:', error);
      toast.error('Error viewing quote details');
    }
  };

  if (!Array.isArray(quotes) || quotes.length === 0) {
    return (
      <div className="border rounded-md p-8 bg-gray-50 text-center">
        <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No quotes to compare</h3>
        <p className="text-muted-foreground">
          There are no quotes available for comparison at this time.
        </p>
      </div>
    );
  }

  // Check if any quotes have a different client_id than the current user
  const hasIncorrectClientIds = sortedQuotes.some(quote => quote.client_id !== user?.id);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-muted-foreground">Showing {quotes.length} quote(s)</p>
        
        {hasIncorrectClientIds && (
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-md border border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-xs text-yellow-700">Some quotes have different client IDs</span>
          </div>
        )}
      </div>
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
            console.log('Rendering quote row for:', quote.id, quote);
            
            // Check if this quote belongs to the current user
            const differentClientId = quote.client_id !== user?.id;
            
            // Get freelancer info - handle potentially undefined properties safely
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
              <TableRow key={quote.id} className={differentClientId ? "bg-yellow-50" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={freelancer.profile_photo} alt={freelancerName} />
                      <AvatarFallback>{(freelancerName?.substring(0, 2) || 'FR').toUpperCase()}</AvatarFallback>
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
                  {differentClientId ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Different Client ID
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This quote is associated with a different client ID</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(quote.id)}
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View Details
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View complete quote details and take action</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
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
