
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
      console.log('Creating checkout session for planId:', planId);
      
      // Get current auth token to persist the session
      const { data: { session } } = await supabase.auth.getSession();
      
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
      
      // Open Stripe Checkout in a new window to avoid iframe restrictions
      if (response.data && response.data.sessionUrl) {
        console.log('Opening Stripe checkout in new window:', response.data.sessionUrl);
        
        // Add session token to localStorage before opening Stripe
        if (session) {
          localStorage.setItem('sb-session-backup', JSON.stringify(session));
        }
        
        window.open(response.data.sessionUrl, '_blank');
        
        // Also reduce loading state since we're not leaving the page
        setIsCheckoutLoading(false);
        
        toast({
          title: 'Checkout Started',
          description: 'Stripe checkout has opened in a new tab',
          variant: 'default',
        });
      } else {
        console.error('No checkout URL returned', response.data);
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setIsCheckoutLoading(false);
      toast({
        title: 'Checkout Error',
        description: error.message || 'Failed to start checkout process. Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  return {
    purchaseCredits,
    isCheckoutLoading
  };
};
