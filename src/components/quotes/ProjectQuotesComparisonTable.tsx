
import React, { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Table, TableBody } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { QuoteWithFreelancer } from '@/types/quotes';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import QuoteTableHeader from './table/QuoteTableHeader';
import QuoteTableRow from './table/QuoteTableRow';
import EmptyQuotesState from './table/EmptyQuotesState';

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
    return <EmptyQuotesState />;
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
        <QuoteTableHeader />
        <TableBody>
          {sortedQuotes.map((quote) => (
            <QuoteTableRow 
              key={quote.id} 
              quote={quote}
              onViewDetails={handleViewDetails}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectQuotesComparisonTable;
