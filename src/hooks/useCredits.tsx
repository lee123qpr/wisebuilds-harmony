
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  discount_percentage: number;
  is_active: boolean;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  credits_purchased: number;
  stripe_payment_id: string | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export const useCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Get credit balance
  const {
    data: creditBalance,
    isLoading: isLoadingBalance,
    error: balanceError,
  } = useQuery({
    queryKey: ['creditBalance', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('freelancer_credits')
        .select('credit_balance')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching credit balance:', error);
        throw error;
      }
      
      return data?.credit_balance || 0;
    },
    enabled: !!user,
  });
  
  // Get credit plans
  const {
    data: creditPlans,
    isLoading: isLoadingPlans,
    error: plansError,
  } = useQuery({
    queryKey: ['creditPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_plans')
        .select('*')
        .eq('is_active', true)
        .order('credits', { ascending: true });
      
      if (error) {
        console.error('Error fetching credit plans:', error);
        throw error;
      }
      
      return data as CreditPlan[];
    },
  });
  
  // Get transaction history
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ['creditTransactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      
      return data as CreditTransaction[];
    },
    enabled: !!user,
  });
  
  // Create a checkout session
  const purchaseCredits = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to purchase credits',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCheckoutLoading(true);
    
    try {
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planId,
          userId: user.id,
          successUrl: `${window.location.origin}/dashboard/freelancer/credits/success`,
          cancelUrl: `${window.location.origin}/dashboard/freelancer/credits`,
        },
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe Checkout
      if (response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Checkout Error',
        description: error.message || 'Failed to start checkout process',
        variant: 'destructive',
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };
  
  // Handle success redirect from Stripe
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
  
  return {
    creditBalance,
    creditPlans,
    transactions,
    isLoadingBalance,
    isLoadingPlans,
    isLoadingTransactions,
    isCheckoutLoading,
    balanceError,
    plansError,
    transactionsError,
    purchaseCredits,
    handleCheckoutSuccess,
  };
};
