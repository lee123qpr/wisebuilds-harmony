
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

    // For testing - return a success message for GET requests
    if (req.method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'webhook endpoint operational' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the raw body
    const body = await req.text();
    
    // For debugging - log the raw webhook payload
    console.log('Received webhook payload:', body.substring(0, 500) + '...');
    
    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');
    
    // Initialize event
    let event;
    
    try {
      if (endpointSecret && signature) {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
        console.log('Webhook signature verified successfully');
      } else {
        // For testing or manual calls without signature verification
        event = JSON.parse(body);
        console.log('Processing webhook without signature verification');
      }
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Received webhook event type: ${event.type}`);

    // For manually updating pending transactions 
    if (event.type === 'manual_update' && event.data?.sessionId) {
      const sessionId = event.data.sessionId;
      console.log(`Processing manual update for session: ${sessionId}`);
      
      try {
        // Try to fetch session directly from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log(`Retrieved Stripe session: ${session.id}, payment_status: ${session.payment_status}`);
        
        // Only proceed if payment is paid
        if (session.payment_status !== 'paid') {
          console.log(`Session ${sessionId} is not paid (status: ${session.payment_status}), not updating`);
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Payment not completed. Status: ${session.payment_status}` 
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Get transaction from database
        const { data: transaction, error: txError } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('stripe_payment_id', sessionId)
          .single();
        
        if (txError || !transaction) {
          console.error('Transaction not found:', txError);
          
          // If transaction not found but payment is successful, try to create one
          if (session.metadata && session.metadata.userId && session.metadata.credits) {
            // Extract metadata directly from the session
            const userId = session.metadata.userId;
            const credits = parseInt(session.metadata.credits, 10);
            const amount = session.amount_total;
            
            console.log(`Creating new transaction record from session metadata: userId=${userId}, credits=${credits}`);
            
            // Create transaction record
            const { data: newTransaction, error: insertError } = await supabase
              .from('credit_transactions')
              .insert({
                user_id: userId,
                credits_purchased: credits,
                amount: amount,
                stripe_payment_id: sessionId,
                status: 'completed'
              })
              .select()
              .single();
              
            if (insertError) {
              console.error('Error creating transaction record:', insertError);
              return new Response(
                JSON.stringify({ error: 'Failed to create transaction record' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
            
            // Add credits to user's balance
            const { data: creditRecord } = await supabase
              .from('freelancer_credits')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
            
            if (creditRecord) {
              // Update existing record
              await supabase
                .from('freelancer_credits')
                .update({ 
                  credit_balance: creditRecord.credit_balance + credits
                })
                .eq('user_id', userId);
                
              console.log(`Updated credit balance for user ${userId}: added ${credits} credits, new balance: ${creditRecord.credit_balance + credits}`);
            } else {
              // Create new record
              await supabase
                .from('freelancer_credits')
                .insert({ 
                  user_id: userId, 
                  credit_balance: credits
                });
                
              console.log(`Created new credit record for user ${userId} with initial balance: ${credits}`);
            }
            
            return new Response(
              JSON.stringify({ 
                success: true, 
                message: 'Created and completed transaction from session data',
                transaction: newTransaction
              }),
              { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          return new Response(
            JSON.stringify({ error: 'Transaction not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Don't update if already completed
        if (transaction.status === 'completed') {
          console.log(`Transaction for session ${sessionId} is already completed`);
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Transaction already completed',
              transaction: transaction
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Update transaction status
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
        
        console.log(`Updated transaction status to completed for session: ${sessionId}`);
        
        // Add credits to user's balance
        const userId = transaction.user_id;
        const credits = transaction.credits_purchased;
        
        // Check if user already has a credit record
        const { data: creditRecord } = await supabase
          .from('freelancer_credits')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (creditRecord) {
          // Update existing record
          await supabase
            .from('freelancer_credits')
            .update({ 
              credit_balance: creditRecord.credit_balance + credits
            })
            .eq('user_id', userId);
            
          console.log(`Updated credit balance for user ${userId}: added ${credits} credits, new balance: ${creditRecord.credit_balance + credits}`);
        } else {
          // Create new record
          await supabase
            .from('freelancer_credits')
            .insert({ 
              user_id: userId, 
              credit_balance: credits
            });
            
          console.log(`Created new credit record for user ${userId} with initial balance: ${credits}`);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Manual update completed',
            transaction: {
              ...transaction,
              status: 'completed'
            }
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error(`Error processing manual update: ${error.message}`);
        return new Response(
          JSON.stringify({ error: `Error processing manual update: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing completed checkout session:', session.id);
      
      try {
        // Extract critical info from session
        const sessionId = session.id;
        const paymentStatus = session.payment_status;
        let userId, credits;
        
        // Get metadata from session or from database if not available
        if (session.metadata && session.metadata.userId && session.metadata.credits) {
          userId = session.metadata.userId;
          credits = parseInt(session.metadata.credits, 10);
          console.log(`Metadata from session: userId=${userId}, credits=${credits}`);
        } else {
          // If metadata is missing, try to get it from the transaction record
          console.log('Metadata missing from session, fetching from database');
          const { data: transaction, error: txError } = await supabase
            .from('credit_transactions')
            .select('*')
            .eq('stripe_payment_id', sessionId)
            .single();
          
          if (txError || !transaction) {
            console.error('Transaction not found:', txError);
            return new Response(
              JSON.stringify({ error: 'Transaction not found and no metadata available' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          userId = transaction.user_id;
          credits = transaction.credits_purchased;
          console.log(`Data from transaction record: userId=${userId}, credits=${credits}`);
        }

        // Validate required data
        if (!userId || !credits) {
          console.error('Missing required data:', { userId, credits });
          return new Response(
            JSON.stringify({ error: 'Missing required data (userId or credits)' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Processing completed checkout: user=${userId}, credits=${credits}, status=${paymentStatus}`);

        if (paymentStatus === 'paid') {
          // Check if transaction record exists
          const { data: existingTx, error: checkError } = await supabase
            .from('credit_transactions')
            .select('*')
            .eq('stripe_payment_id', sessionId)
            .maybeSingle();
            
          // Create transaction record if it doesn't exist
          if (!existingTx && !checkError) {
            console.log(`No transaction record found for session ${sessionId}, creating one`);
            const { error: createError } = await supabase
              .from('credit_transactions')
              .insert({
                stripe_payment_id: sessionId,
                user_id: userId,
                credits_purchased: credits,
                amount: session.amount_total,
                status: 'pending'
              });
              
            if (createError) {
              console.error('Error creating transaction record:', createError);
              return new Response(
                JSON.stringify({ error: 'Failed to create transaction record' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
            
            console.log(`Created transaction record for session ${sessionId}`);
          } else if (checkError) {
            console.error('Error checking for existing transaction:', checkError);
          } else {
            console.log(`Found existing transaction record for session ${sessionId}, status: ${existingTx.status}`);
          }
          
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
                credit_balance: creditRecord.credit_balance + credits 
              })
              .eq('user_id', userId);

            if (updateBalanceError) {
              console.error('Error updating credit balance:', updateBalanceError);
              return new Response(
                JSON.stringify({ error: 'Failed to update credit balance' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
            
            console.log(`Updated credit balance for user ${userId}: added ${credits} credits, new balance: ${creditRecord.credit_balance + credits}`);
          } else {
            // Create new record
            const { error: insertError } = await supabase
              .from('freelancer_credits')
              .insert({ 
                user_id: userId, 
                credit_balance: credits 
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
      } catch (error) {
        console.error(`Error processing checkout.session.completed: ${error.message}`);
        return new Response(
          JSON.stringify({ error: `Error processing checkout event: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
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
