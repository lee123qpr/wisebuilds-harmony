
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import IncompleteProjectDialog from './IncompleteProjectDialog';

interface PartialCompletionCardProps {
  userCompleted: boolean;
  otherPartyCompleted: boolean;
  otherPartyLabel: string;
  incompleteDialogOpen: boolean;
  setIncompleteDialogOpen: (open: boolean) => void;
  handleMarkIncomplete: (reason: string) => void;
  isMarkingIncomplete: boolean;
}

const PartialCompletionCard: React.FC<PartialCompletionCardProps> = ({
  userCompleted,
  otherPartyCompleted,
  otherPartyLabel,
  incompleteDialogOpen,
  setIncompleteDialogOpen,
  handleMarkIncomplete,
  isMarkingIncomplete
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Completion Status</CardTitle>
            <CardDescription>
              {userCompleted 
                ? `Waiting for ${otherPartyLabel} to confirm completion` 
                : `${otherPartyLabel} has marked this as complete`}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Awaiting Confirmation
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Alert className={userCompleted 
            ? "bg-blue-50 text-blue-700 border-blue-200" 
            : "bg-yellow-50 text-yellow-700 border-yellow-200"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {userCompleted 
                ? `You've marked this project as complete. The project will be finalized once the ${otherPartyLabel.toLowerCase()} confirms completion.` 
                : `The ${otherPartyLabel.toLowerCase()} has marked this project as complete. Please confirm if you agree the work is completed.`}
            </AlertDescription>
          </Alert>
          
          {/* Note: Dispute button removed from here */}
        </div>
        
        {/* Incomplete dialog for providing a reason */}
        <IncompleteProjectDialog
          open={incompleteDialogOpen}
          onOpenChange={setIncompleteDialogOpen}
          onConfirm={handleMarkIncomplete}
          isProcessing={isMarkingIncomplete}
          otherPartyLabel={otherPartyLabel}
        />
      </CardContent>
    </Card>
  );
};

export default PartialCompletionCard;
