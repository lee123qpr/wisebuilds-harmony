
import React, { useState, useEffect } from 'react';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { useAuth } from '@/context/AuthContext';
import QuotesTab from '@/components/dashboard/freelancer/QuotesTab';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const QuotesTabContent: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showNotification, setShowNotification] = useState(true);
  
  // Fetch all quotes for this freelancer
  const { data: quotes, isLoading: isLoadingQuotes } = useQuotes({
    forClient: false,
    includeAllQuotes: false
  });
  
  // Count of accepted quotes
  const acceptedQuotes = quotes?.filter(q => q.status === 'accepted') || [];
  const hasAcceptedQuotes = acceptedQuotes.length > 0;
  
  // Load notification state from localStorage
  useEffect(() => {
    const dismissedKey = `quotes-notification-dismissed-${user?.id}`;
    const isDismissed = localStorage.getItem(dismissedKey) === 'true';
    
    if (isDismissed) {
      setShowNotification(false);
    }
  }, [user?.id]);
  
  // Handle dismiss of notification
  const handleDismissNotification = () => {
    const dismissedKey = `quotes-notification-dismissed-${user?.id}`;
    localStorage.setItem(dismissedKey, 'true');
    setShowNotification(false);
    
    toast({
      title: "Notification dismissed",
      description: "You can view your active jobs in the 'Active Jobs' tab.",
      variant: "default",
    });
  };
  
  return (
    <div className="space-y-4">
      {hasAcceptedQuotes && showNotification && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">
                    You have been hired for {acceptedQuotes.length} project{acceptedQuotes.length > 1 ? 's' : ''}!
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
                onClick={handleDismissNotification}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <QuotesTab />
    </div>
  );
};

export default QuotesTabContent;
