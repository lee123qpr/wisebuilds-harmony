
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
      // If user exists, we can update their data immediately
      if (user) {
        await queryClient.invalidateQueries({ queryKey: ['creditBalance', user.id] });
        await queryClient.invalidateQueries({ queryKey: ['creditTransactions', user.id] });
      }
      
      toast({
        title: 'Purchase Successful',
        description: 'Your credits have been added to your account',
        variant: 'default',
      });
      
      // After a short delay, redirect to the credits page
      setTimeout(() => {
        navigate('/dashboard/freelancer/credits');
      }, 3000);
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
