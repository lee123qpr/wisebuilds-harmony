
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCheckoutSuccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCheckoutSuccess = async (sessionId: string) => {
    if (!user || !sessionId) return;
    
    try {
      // We don't need to do anything here as the webhook will handle
      // adding credits to the user's account, but we can refresh the data
      await queryClient.invalidateQueries({ queryKey: ['creditBalance', user.id] });
      await queryClient.invalidateQueries({ queryKey: ['creditTransactions', user.id] });
      
      toast({
        title: 'Purchase Successful',
        description: 'Your credits have been added to your account',
        variant: 'default',
      });
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
