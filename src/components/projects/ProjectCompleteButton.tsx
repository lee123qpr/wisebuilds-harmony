
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Loader2, Clock } from 'lucide-react';
import { useProjectCompletion } from '@/hooks/projects/useProjectCompletion';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/toast';

interface ProjectCompleteButtonProps {
  quoteId: string;
  projectId: string;
  projectTitle?: string;
  onStatusUpdate?: () => void;
}

const ProjectCompleteButton: React.FC<ProjectCompleteButtonProps> = ({
  quoteId,
  projectId,
  projectTitle = 'this project',
  onStatusUpdate
}) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<{
    freelancer_completed: boolean;
    client_completed: boolean;
    completed_at: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  
  const { 
    markProjectCompleted, 
    isMarkingComplete, 
    checkCompletionStatus 
  } = useProjectCompletion({ quoteId, projectId });
  
  const loadCompletionStatus = async () => {
    setIsLoading(true);
    try {
      const status = await checkCompletionStatus();
      setCompletionStatus(status);
    } catch (error) {
      console.error("Error loading completion status:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (quoteId) {
      loadCompletionStatus();
    }
  }, [quoteId]);
  
  const handleComplete = async () => {
    try {
      await markProjectCompleted();
      setDialogOpen(false);
      // Add delay before refreshing status to ensure database has updated
      setTimeout(() => {
        loadCompletionStatus();
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      }, 500);
    } catch (error) {
      console.error('Error completing project:', error);
      toast({
        title: 'Failed to complete project',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    }
  };
  
  if (isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking status...
      </Button>
    );
  }
  
  if (!completionStatus) {
    return null;
  }
  
  if (completionStatus.completed_at && completionStatus.freelancer_completed && completionStatus.client_completed) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 px-3 py-1">
        <CheckCircle2 className="h-4 w-4" />
        Project Completed
      </Badge>
    );
  }
  
  const userCompleted = isFreelancer 
    ? completionStatus.freelancer_completed 
    : completionStatus.client_completed;
  
  const otherPartyCompleted = isFreelancer 
    ? completionStatus.client_completed 
    : completionStatus.freelancer_completed;
  
  const otherPartyLabel = isFreelancer ? 'client' : 'freelancer';
  
  if (userCompleted) {
    return (
      <Alert className="bg-blue-50 text-blue-700 border-blue-200">
        <Clock className="h-4 w-4" />
        <AlertDescription>
          {otherPartyCompleted 
            ? 'Project completion in progress' 
            : `Waiting for ${otherPartyLabel} to confirm completion`}
        </AlertDescription>
      </Alert>
    );
  }
  
  // If the other party has completed but user hasn't, show a more prominent button
  const buttonVariant = otherPartyCompleted ? "default" : "outline";
  const buttonClass = otherPartyCompleted 
    ? "bg-green-600 hover:bg-green-700 gap-2" 
    : "gap-2";
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          className={buttonClass}
        >
          <CheckCircle2 className="h-4 w-4" />
          {otherPartyCompleted 
            ? 'Confirm Completion' 
            : 'Mark as Complete'}
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {otherPartyCompleted 
              ? 'Confirm Project Completion' 
              : 'Mark Project as Complete'}
          </DialogTitle>
          <DialogDescription>
            {otherPartyCompleted 
              ? `The ${otherPartyLabel} has marked this project as complete. By confirming, you agree that all work has been delivered satisfactorily.` 
              : `This will notify the ${otherPartyLabel} that you consider the project complete. The project will be marked as completed when both parties confirm.`}
          </DialogDescription>
        </DialogHeader>
        
        {otherPartyCompleted && (
          <Alert className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              After confirming completion, you'll be able to leave a review for the {otherPartyLabel}.
            </AlertDescription>
          </Alert>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={isMarkingComplete}
            className={otherPartyCompleted ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isMarkingComplete 
              ? 'Processing...' 
              : otherPartyCompleted 
                ? 'Confirm Completion' 
                : 'Mark as Complete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCompleteButton;
