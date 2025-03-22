
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
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

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

    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');
    if (!signature && req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Missing Stripe signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For testing - return a success message for GET requests
    if (req.method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'webhook endpoint operational' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the raw body
    const body = await req.text();
    
    // Verify webhook signature and extract the event
    let event;
    try {
      if (endpointSecret) {
        event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
      } else {
        // For testing without a webhook secret
        event = JSON.parse(body);
        console.warn('Warning: No webhook secret provided, skipping signature verification');
      }
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Received webhook event: ${event.type}`);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, credits } = session.metadata;
      const paymentStatus = session.payment_status;
      const sessionId = session.id;

      console.log(`Processing completed checkout for user: ${userId}, credits: ${credits}, status: ${paymentStatus}`);

      if (paymentStatus === 'paid') {
        // Update the transaction status to completed
        const { error: updateError } = await supabase
          .from('credit_transactions')
          .update({ status: 'completed' })
          .eq('stripe_payment_id', sessionId);

        if (updateError) {
          console.error('Error updating transaction status:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update transaction status' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Log transaction update
        console.log(`Updated transaction status to completed for session: ${sessionId}`);

        // Check if user already has a credit record
        const { data: creditRecord, error: creditError } = await supabase
          .from('freelancer_credits')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (creditError) {
          console.error('Error checking credit record:', creditError);
          return new Response(
            JSON.stringify({ error: 'Failed to check credit record' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Add credits to user's balance
        if (creditRecord) {
          // Update existing record
          const { error: updateBalanceError } = await supabase
            .from('freelancer_credits')
            .update({ 
              credit_balance: creditRecord.credit_balance + parseInt(credits, 10) 
            })
            .eq('user_id', userId);

          if (updateBalanceError) {
            console.error('Error updating credit balance:', updateBalanceError);
            return new Response(
              JSON.stringify({ error: 'Failed to update credit balance' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          console.log(`Updated credit balance for user ${userId}: added ${credits} credits, new balance: ${creditRecord.credit_balance + parseInt(credits, 10)}`);
        } else {
          // Create new record
          const { error: insertError } = await supabase
            .from('freelancer_credits')
            .insert({ 
              user_id: userId, 
              credit_balance: parseInt(credits, 10) 
            });

          if (insertError) {
            console.error('Error creating credit record:', insertError);
            return new Response(
              JSON.stringify({ error: 'Failed to create credit record' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          console.log(`Created new credit record for user ${userId} with initial balance: ${credits}`);
        }
      } else {
        console.log(`Payment status not paid: ${paymentStatus}, not updating credits`);
      }
    } else {
      console.log(`Received webhook event: ${event.type}, not processing`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
