
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useReviewSubmission } from '@/hooks/projects/useReviewSubmission';
import RatingSelector from './RatingSelector';
import { toast } from 'sonner';

interface ReviewFormProps {
  projectId: string;
  quoteId: string;
  revieweeId: string;
  revieweeName: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  projectId,
  quoteId,
  revieweeId,
  revieweeName,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  
  const { submitReview, isSubmitting } = useReviewSubmission();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting review form with data:', {
      projectId,
      quoteId,
      revieweeId,
      rating,
      reviewText
    });
    
    if (!projectId || !quoteId || !revieweeId) {
      toast.error('Missing required information', {
        description: 'Project, quote, or reviewee information is missing.'
      });
      return;
    }
    
    try {
      await submitReview({
        projectId,
        quoteId,
        revieweeId,
        rating,
        reviewText: reviewText.trim() || undefined
      });
      
      // Reset form
      setRating(5);
      setReviewText('');
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };
  
  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Leave a Review</CardTitle>
          <CardDescription>
            Share your experience working with {revieweeName}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="rating" className="text-sm font-medium">
              Rating
            </label>
            <RatingSelector 
              value={rating} 
              onChange={setRating} 
              max={5}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium">
              Review (Optional)
            </label>
            <Textarea
              id="review"
              placeholder="Tell others about your experience..."
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewForm;
