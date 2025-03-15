
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.37.0';

// Set CORS headers
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
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API SERVICE ROLE KEY - env var exported by default.
      // WARNING: The service role key has admin privileges and should only be used in secure server environments!
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create the ID documents bucket if it doesn't exist
    try {
      const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.getBucket('id-documents');
      
      if (bucketError || !bucketData) {
        console.log('Creating id-documents bucket...');
        const { error: createBucketError } = await supabaseAdmin.storage.createBucket('id-documents', {
          public: false, // Make sure it's private
        });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          throw createBucketError;
        }
      }
    } catch (bucketError) {
      console.error('Bucket operation error:', bucketError);
      return new Response(
        JSON.stringify({ error: 'Bucket operation failed', details: bucketError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Set up storage policies for the id-documents bucket
    try {
      // Remove existing policies to avoid conflicts
      await supabaseAdmin.storage.from('id-documents').deletePolicy();
      
      // Create policy for users to upload their own documents
      await supabaseAdmin.storage.from('id-documents').createPolicy({
        name: 'User Upload Policy',
        definition: {
          type: 'INSERT',
          match: { prefix: "{{auth.uid}}/" },
          roles: ['authenticated'],
        }
      });

      // Create policy for users to read their own documents
      await supabaseAdmin.storage.from('id-documents').createPolicy({
        name: 'User Read Policy',
        definition: {
          type: 'SELECT',
          match: { prefix: "{{auth.uid}}/" },
          roles: ['authenticated'],
        }
      });

      // Create policy for service_role to read all documents
      await supabaseAdmin.storage.from('id-documents').createPolicy({
        name: 'Admin Read Policy',
        definition: {
          type: 'SELECT',
          match: { prefix: "*" },
          roles: ['service_role'],
        }
      });

    } catch (policyError) {
      console.log('Policy setup error (may already exist):', policyError);
      // We continue even if policy creation fails as policies might already exist
    }

    // Return success
    return new Response(
      JSON.stringify({ success: true, message: 'Verification system setup completed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
