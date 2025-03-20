
import React from 'react';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { useAuth } from '@/context/AuthContext';
import QuotesTab from '@/components/dashboard/freelancer/QuotesTab';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const QuotesTabContent: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch all quotes for this freelancer
  const { data: quotes, isLoading: isLoadingQuotes } = useQuotes({
    forClient: false,
    includeAllQuotes: false
  });
  
  // Count of accepted quotes
  const acceptedQuotes = quotes?.filter(q => q.status === 'accepted') || [];
  const hasAcceptedQuotes = acceptedQuotes.length > 0;
  
  return (
    <div className="space-y-4">
      {hasAcceptedQuotes && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-green-800">
                You have been hired for {acceptedQuotes.length} project{acceptedQuotes.length > 1 ? 's' : ''}!
              </h3>
            </div>
            <p className="text-green-700 mt-1 pl-7">
              You can see your active jobs in the "Active Jobs" tab.
            </p>
          </CardContent>
        </Card>
      )}
      <QuotesTab />
    </div>
  );
};

export default QuotesTabContent;
