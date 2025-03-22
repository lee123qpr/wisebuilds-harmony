
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from 'https://esm.sh/stripe@12.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';

    if (!stripeSecretKey) {
      console.error('Stripe secret key is missing');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Stripe API key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // For test requests - GET method for health check
    if (req.method === 'GET') {
      try {
        // Quick test of the Stripe API to verify API key works
        const testCustomer = await stripe.customers.list({ limit: 1 });
        console.log('Stripe API test successful');
        
        return new Response(
          JSON.stringify({ 
            status: 'Edge function is operational',
            stripeStatus: 'API key valid'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('Stripe API key test failed:', e.message);
        return new Response(
          JSON.stringify({ 
            status: 'Edge function is operational', 
            stripeStatus: 'API key invalid or error: ' + e.message
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Parse request body for POST requests
    const { planId, userId, successUrl, cancelUrl } = await req.json();

    console.log(`Creating checkout session for plan: ${planId} and user: ${userId}`);
    console.log(`Success URL: ${successUrl}, Cancel URL: ${cancelUrl}`);

    // Get plan details from database
    const { data: plan, error: planError } = await supabase
      .from('credit_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      console.error('Error fetching plan:', planError);
      return new Response(
        JSON.stringify({ error: 'Plan not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found plan:', plan);

    try {
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${plan.name} Credit Package`,
                description: `${plan.credits} credits ${plan.discount_percentage > 0 ? `with ${plan.discount_percentage}% discount` : ''}`,
              },
              unit_amount: plan.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          planId,
          credits: plan.credits.toString(),
        },
      });

      console.log('Created checkout session:', session.id);

      // Create a transaction record in pending state
      const { data: transaction, error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: plan.price,
          credits_purchased: plan.credits,
          stripe_payment_id: session.id,
          status: 'pending'
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Error creating transaction record:', transactionError);
        return new Response(
          JSON.stringify({ error: 'Failed to create transaction record' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Created transaction record:', transaction.id);

      return new Response(
        JSON.stringify({ 
          sessionId: session.id,
          sessionUrl: session.url 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return new Response(
        JSON.stringify({ error: `Stripe error: ${stripeError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
