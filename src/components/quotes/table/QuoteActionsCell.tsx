
import React from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface QuoteActionsCellProps {
  differentClientId: boolean;
  onViewDetails: () => void;
}

const QuoteActionsCell: React.FC<QuoteActionsCellProps> = ({ 
  differentClientId, 
  onViewDetails 
}) => {
  if (differentClientId) {
    return (
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
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onViewDetails}
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
  );
};

export default QuoteActionsCell;
