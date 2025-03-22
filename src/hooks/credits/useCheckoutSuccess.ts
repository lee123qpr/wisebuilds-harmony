
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useCheckoutSuccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleCheckoutSuccess = async (sessionId: string) => {
    if (!sessionId) return;
    
    try {
      console.log('Processing checkout success with session ID:', sessionId);
      
      // Add a short delay to ensure all backend processes complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force an immediate invalidation AND refetch of credit-related queries
      if (user?.id) {
        console.log(`Refreshing credit data for user ${user.id}`);
        
        // First invalidate the queries
        await queryClient.invalidateQueries({ queryKey: ['creditBalance', user.id] });
        await queryClient.invalidateQueries({ queryKey: ['creditTransactions', user.id] });
        
        // Then force immediate refetches to update the UI
        const balancePromise = queryClient.refetchQueries({ 
          queryKey: ['creditBalance', user.id],
          exact: true 
        });
        
        const transactionsPromise = queryClient.refetchQueries({ 
          queryKey: ['creditTransactions', user.id],
          exact: true 
        });
        
        // Wait for both refetches to complete
        await Promise.all([balancePromise, transactionsPromise]);
        console.log('Credit data refresh completed');
      } else {
        console.log('No user ID available for credit refresh');
      }
      
      toast({
        title: 'Purchase Successful',
        description: 'Your credits have been added to your account',
        variant: 'default',
      });
      
      // After a short delay, redirect to the credits page
      setTimeout(() => {
        navigate('/dashboard/freelancer/credits');
      }, 2000);
    } catch (error) {
      console.error('Error processing successful checkout:', error);
      toast({
        title: 'Error',
        description: 'There was an issue processing your payment confirmation',
        variant: 'destructive',
      });
    }
  };

  return { handleCheckoutSuccess };
};
