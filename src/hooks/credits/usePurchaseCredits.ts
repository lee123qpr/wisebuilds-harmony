
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const usePurchaseCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

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
    } catch (error: any) {
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

  return {
    purchaseCredits,
    isCheckoutLoading
  };
};
