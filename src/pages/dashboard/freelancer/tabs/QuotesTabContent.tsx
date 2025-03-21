
import React from 'react';
import QuotesTab from '@/components/dashboard/freelancer/QuotesTab';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuotesTab } from '@/hooks/dashboard/useQuotesTab';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

const QuotesTabContent: React.FC = () => {
  const { showNotification, handleDismissNotification } = useQuotesTab();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Prefetch quotes data for this tab
  React.useEffect(() => {
    if (!user?.id) return;
    
    queryClient.prefetchQuery({
      queryKey: ['quotes', undefined, user.id, false, false]
    });
  }, [user?.id, queryClient]);
  
  return (
    <div className="space-y-4">
      {showNotification && (
        <ActiveJobsNotification onDismiss={handleDismissNotification} />
      )}
      <QuotesTab />
    </div>
  );
};

// Extracted component for the notification
const ActiveJobsNotification: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
  <Card className="bg-green-50 border-green-200">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800">
              You have been hired for projects!
            </h3>
            <p className="text-green-700 mt-1">
              You can see your active jobs in the "Active Jobs" tab.
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 text-green-700 hover:bg-green-100 hover:text-green-800 -mt-1 -mr-1"
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default QuotesTabContent;
