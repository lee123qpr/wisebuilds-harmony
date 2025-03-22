
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useCheckoutSuccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Function to manually force update a pending transaction
  const forceUpdateTransaction = async (sessionId: string) => {
    try {
      console.log(`Attempting to manually update transaction for session: ${sessionId}`);
      
      const response = await supabase.functions.invoke('webhook-stripe', {
        body: {
          type: 'manual_update',
          data: {
            sessionId
          }
        }
      });
      
      if (response.error) {
        console.error('Error with manual transaction update:', response.error);
        return false;
      }
      
      console.log('Manual transaction update response:', response.data);
      return true;
    } catch (error) {
      console.error('Exception during manual transaction update:', error);
      return false;
    }
  };

  const handleCheckoutSuccess = async (sessionId: string) => {
    if (!sessionId) return;
    
    try {
      console.log('Processing checkout success with session ID:', sessionId);
      
      // Add a short delay to ensure all backend processes complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if the transaction is still pending after a short delay
      const { data: transaction } = await supabase
        .from('credit_transactions')
        .select('status')
        .eq('stripe_payment_id', sessionId)
        .maybeSingle();
      
      console.log('Transaction current status:', transaction?.status);
      
      // If transaction is still pending, try to manually update it
      if (transaction?.status === 'pending') {
        console.log('Transaction still pending, attempting manual update...');
        await forceUpdateTransaction(sessionId);
        
        // Additional wait after manual update
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Force an immediate invalidation AND refetch of credit-related queries
      if (user?.id) {
        console.log(`Refreshing credit data for user ${user.id}`);
        
        // First invalidate the queries
        await queryClient.invalidateQueries({ queryKey: ['creditBalance', user.id] });
        await queryClient.invalidateQueries({ queryKey: ['creditTransactions', user.id] });
        
        // Then force immediate refetches to update the UI
        try {
          await queryClient.refetchQueries({ 
            queryKey: ['creditBalance', user.id],
            exact: true 
          });
          
          await queryClient.refetchQueries({ 
            queryKey: ['creditTransactions', user.id],
            exact: true 
          });
          
          console.log('Initial credit data refresh completed');
          
          // Do a second refresh after a short delay to ensure we have the most up-to-date data
          setTimeout(async () => {
            try {
              await queryClient.refetchQueries({ 
                queryKey: ['creditBalance', user.id],
                exact: true 
              });
              
              await queryClient.refetchQueries({ 
                queryKey: ['creditTransactions', user.id],
                exact: true 
              });
              
              console.log('Secondary refresh completed');
            } catch (err) {
              console.error('Error in secondary refresh:', err);
            }
          }, 2000);
          
          // Do a third refresh after a longer delay as a final attempt
          setTimeout(async () => {
            try {
              await queryClient.refetchQueries({ 
                queryKey: ['creditBalance', user.id],
                exact: true 
              });
              
              await queryClient.refetchQueries({ 
                queryKey: ['creditTransactions', user.id],
                exact: true 
              });
              
              console.log('Final refresh completed');
            } catch (err) {
              console.error('Error in final refresh:', err);
            }
          }, 5000);
        } catch (err) {
          console.error('Error during refetch operations:', err);
        }
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
