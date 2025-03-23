
import { toast } from '@/hooks/toast';

/**
 * Handles successful completion status update and shows appropriate toast notifications
 */
export const handleCompletionSuccess = (data: any, isFreelancer: boolean, user: any) => {
  console.log('Project completion mutation succeeded:', data);
  
  const otherParty = isFreelancer ? 'client' : 'freelancer';
  
  // Check if both parties have completed or just one
  if (data.freelancer_completed && data.client_completed) {
    toast({
      title: 'Project marked as complete!',
      description: 'You can now leave a review for this project.',
      variant: 'success'
    });
  } else {
    // Show appropriate message based on whether both parties have marked complete
    const isUserCompleted = isFreelancer ? data.freelancer_completed : data.client_completed;
    const isOtherPartyCompleted = isFreelancer ? data.client_completed : data.freelancer_completed;
    
    if (isUserCompleted && !isOtherPartyCompleted) {
      toast({
        title: 'Completion request sent',
        description: `The ${otherParty} has been notified to confirm completion.`,
        variant: 'default'
      });
    } else if (!isUserCompleted && isOtherPartyCompleted) {
      toast({
        title: 'Confirmation requested',
        description: `The ${otherParty} has marked this project as complete. Please confirm completion.`,
        variant: 'default'
      });
    }
  }
};
