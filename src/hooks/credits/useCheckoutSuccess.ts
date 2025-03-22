
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

  // Enhanced function to manually force update a pending transaction
  const forceUpdateTransaction = async (sessionId: string) => {
    try {
      console.log(`Attempting to manually update transaction for session: ${sessionId}`);
      
      // First check if the transaction exists and is still pending
      const { data: existingTx, error: txError } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('stripe_payment_id', sessionId)
        .maybeSingle();
      
      if (txError) {
        console.error('Error checking transaction status:', txError);
        return false;
      }
      
      if (!existingTx) {
        console.error('Transaction not found for session ID:', sessionId);
        return false;
      }
      
      console.log('Current transaction status:', existingTx.status);
      
      // Only attempt update if still pending
      if (existingTx.status === 'pending') {
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
      } else if (existingTx.status === 'completed') {
        console.log('Transaction already completed, no update needed');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Exception during manual transaction update:', error);
      return false;
    }
  };

  const handleCheckoutSuccess = async (sessionId: string) => {
    if (!sessionId) return;
    
    try {
      console.log('Processing checkout success with session ID:', sessionId);
      
      // Wait to ensure all backend processes complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Manually update the transaction
      console.log('Attempting manual transaction update...');
      await forceUpdateTransaction(sessionId);
      
      // Wait a bit longer after manual update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
          
          // Do multiple refresh attempts with delays
          const refreshIntervals = [3000, 6000, 10000];
          
          refreshIntervals.forEach((delay, index) => {
            setTimeout(async () => {
              try {
                console.log(`Performing refresh attempt ${index + 1}...`);
                
                await queryClient.refetchQueries({ 
                  queryKey: ['creditBalance', user.id],
                  exact: true 
                });
                
                await queryClient.refetchQueries({ 
                  queryKey: ['creditTransactions', user.id],
                  exact: true 
                });
                
                console.log(`Refresh attempt ${index + 1} completed`);
              } catch (err) {
                console.error(`Error in refresh attempt ${index + 1}:`, err);
              }
            }, delay);
          });
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
      
      // Navigate to the credits page after a delay
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

  return { handleCheckoutSuccess, forceUpdateTransaction };
};
