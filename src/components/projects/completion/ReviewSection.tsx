
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import ReviewForm from '@/components/reviews/ReviewForm';

interface ReviewSectionProps {
  hasReviewed: boolean;
  revieweeId: string;
  revieweeName: string;
  projectId: string;
  quoteId: string;
  onReviewSubmitted: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  hasReviewed,
  revieweeId,
  revieweeName,
  projectId,
  quoteId,
  onReviewSubmitted
}) => {
  if (hasReviewed) {
    return (
      <Alert className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          You have submitted your review for this project.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
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
        onReviewSubmitted={onReviewSubmitted}
      />
    </div>
  );
};

export default ReviewSection;
