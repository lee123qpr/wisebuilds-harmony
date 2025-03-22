
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const usePurchaseCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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
    setCheckoutError(null);
    
    try {
      console.log('Creating checkout session for planId:', planId);
      
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planId,
          userId: user.id,
          successUrl: `${window.location.origin}/dashboard/freelancer/credits/success`,
          cancelUrl: `${window.location.origin}/dashboard/freelancer/credits`,
        },
      });
      
      if (response.error) {
        console.error('Checkout error response:', response.error);
        throw new Error(response.error.message || 'Failed to create checkout session');
      }
      
      console.log('Checkout session response:', response.data);
      
      // Redirect to Stripe Checkout
      if (response.data && response.data.sessionUrl) {
        console.log('Redirecting to Stripe checkout:', response.data.sessionUrl);
        window.location.href = response.data.sessionUrl;
      } else {
        console.error('No checkout URL returned', response.data);
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setCheckoutError(error.message || 'Failed to start checkout process');
      toast({
        title: 'Checkout Error',
        description: error.message || 'Failed to start checkout process. Please try again later.',
        variant: 'destructive',
      });
      setIsCheckoutLoading(false);
    }
  };

  const testStripeConnection = async () => {
    try {
      const response = await supabase.functions.invoke('create-checkout-session', {
        method: 'GET'
      });
      
      console.log('Stripe connection test response:', response);
      return response.data;
    } catch (error) {
      console.error('Error testing Stripe connection:', error);
      return { error: error.message };
    }
  };

  return {
    purchaseCredits,
    isCheckoutLoading,
    checkoutError,
    testStripeConnection
  };
};
