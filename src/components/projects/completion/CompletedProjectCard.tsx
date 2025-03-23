
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import ReviewSection from './ReviewSection';

interface CompletedProjectCardProps {
  hasReviewed: boolean;
  revieweeId: string;
  revieweeName: string;
  projectId: string;
  quoteId: string;
  onReviewSubmitted: () => void;
}

const CompletedProjectCard: React.FC<CompletedProjectCardProps> = ({
  hasReviewed,
  revieweeId,
  revieweeName,
  projectId,
  quoteId,
  onReviewSubmitted
}) => {
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
        <ReviewSection
          hasReviewed={hasReviewed}
          revieweeId={revieweeId}
          revieweeName={revieweeName}
          projectId={projectId}
          quoteId={quoteId}
          onReviewSubmitted={onReviewSubmitted}
        />
      </CardContent>
    </Card>
  );
};

export default CompletedProjectCard;
