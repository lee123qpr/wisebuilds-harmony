
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, Clock, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useReviewSubmission } from '@/hooks/projects/useReviewSubmission';
import IncompleteProjectDialog from './completion/IncompleteProjectDialog';
import { useProjectCompletion } from '@/hooks/projects/useProjectCompletion';

interface ProjectCompletionStatusProps {
  quoteId: string;
  projectId: string;
  freelancerId: string;
  clientId: string;
  freelancerName?: string;
  clientName?: string;
}

const ProjectCompletionStatus: React.FC<ProjectCompletionStatusProps> = ({
  quoteId,
  projectId,
  freelancerId,
  clientId,
  freelancerName = 'the freelancer',
  clientName = 'the client'
}) => {
  const { user } = useAuth();
  const [completionStatus, setCompletionStatus] = useState<{
    freelancer_completed: boolean;
    client_completed: boolean;
    completed_at: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [incompleteDialogOpen, setIncompleteDialogOpen] = useState(false);
  
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  const revieweeId = isFreelancer ? clientId : freelancerId;
  const revieweeName = isFreelancer ? clientName : freelancerName;
  
  const { checkReviewExists } = useReviewSubmission();
  const { markProjectIncomplete, isMarkingIncomplete } = useProjectCompletion({ 
    quoteId, 
    projectId 
  });
  
  const loadCompletionStatus = async () => {
    setIsLoading(true);
    
    // Check quote completion status
    const { data, error } = await supabase
      .from('quotes')
      .select('freelancer_completed, client_completed, completed_at')
      .eq('id', quoteId)
      .single();
      
    if (error) {
      console.error('Error checking completion status:', error);
      setIsLoading(false);
      return;
    }
    
    setCompletionStatus(data);
    
    // Check if user has already left a review
    if (data.completed_at && user?.id) {
      const hasLeftReview = await checkReviewExists(quoteId);
      setHasReviewed(hasLeftReview);
    }
    
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (quoteId) {
      loadCompletionStatus();
    }
  }, [quoteId, user?.id]);
  
  const handleReviewSubmitted = () => {
    setHasReviewed(true);
  };
  
  const handleIncomplete = (reason: string) => {
    markProjectIncomplete({ reason });
    setIncompleteDialogOpen(false);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Status</CardTitle>
          <CardDescription>Loading status...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (!completionStatus) {
    return null;
  }
  
  // Get completion details
  const isFullyCompleted = completionStatus.completed_at && completionStatus.client_completed && completionStatus.freelancer_completed;
  const userCompleted = isFreelancer ? completionStatus.freelancer_completed : completionStatus.client_completed;
  const otherPartyCompleted = isFreelancer ? completionStatus.client_completed : completionStatus.freelancer_completed;
  const otherPartyLabel = isFreelancer ? 'Client' : 'Freelancer';
  
  // If neither party has marked complete, don't show anything
  if (!userCompleted && !otherPartyCompleted) {
    return null;
  }
  
  // If project is fully complete - show review form if user hasn't reviewed yet
  if (isFullyCompleted) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-lg">Project Complete</CardTitle>
              <CardDescription>
                This project has been marked as complete by both parties
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {hasReviewed ? (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                You have submitted your review for this project.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please take a moment to review your experience working with {revieweeName}.
                </AlertDescription>
              </Alert>
              
              <ReviewForm
                projectId={projectId}
                quoteId={quoteId}
                revieweeId={revieweeId}
                revieweeName={revieweeName}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Project is partially complete (waiting for other party)
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
          
          {/* Show an option to mark as incomplete if the user wants to dispute */}
          {(userCompleted || otherPartyCompleted) && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1"
                onClick={() => setIncompleteDialogOpen(true)}
              >
                <X className="h-4 w-4" />
                Dispute Completion
              </Button>
            </div>
          )}
        </div>
        
        {/* Incomplete dialog for providing a reason */}
        <IncompleteProjectDialog
          open={incompleteDialogOpen}
          onOpenChange={setIncompleteDialogOpen}
          onConfirm={handleIncomplete}
          isProcessing={isMarkingIncomplete}
          otherPartyLabel={otherPartyLabel}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectCompletionStatus;
