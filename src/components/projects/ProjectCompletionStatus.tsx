
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useReviewSubmission } from '@/hooks/projects/useReviewSubmission';

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
  
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  const revieweeId = isFreelancer ? clientId : freelancerId;
  const revieweeName = isFreelancer ? clientName : freelancerName;
  
  const { checkReviewExists } = useReviewSubmission();
  
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
  
  // Project is not yet fully complete
  if (!completionStatus.completed_at) {
    return null;
  }
  
  // Project is complete - show review form if user hasn't reviewed yet
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
};

export default ProjectCompletionStatus;
