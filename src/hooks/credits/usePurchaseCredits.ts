
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key
// This is a publishable key, so it's safe to include in the frontend code
const stripePromise = loadStripe('pk_test_51OxbboP1oDKULakIOtkLl3DmLI5QrPXrNbQrwKBNRkLQzsvGY6EafB9j4FQnVFFP4QHvRrIvMaLSb46B7MSlPY7c00PJtY0eZo');

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
      
      // Get the Stripe instance
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to initialize Stripe.');
      }
      
      // Create a checkout session via our Supabase Edge Function
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
      
      if (!response.data || !response.data.sessionId) {
        throw new Error('Invalid response from server');
      }
      
      // Redirect to Stripe Checkout using the Stripe JS SDK
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });
      
      if (result.error) {
        console.error('Stripe redirect error:', result.error);
        throw new Error(result.error.message || 'Failed to redirect to checkout');
      }
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setIsCheckoutLoading(false);
      setCheckoutError(error.message || 'Failed to start checkout process');
      toast({
        title: 'Checkout Error',
        description: error.message || 'Failed to start checkout process. Please try again later.',
        variant: 'destructive',
      });
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
