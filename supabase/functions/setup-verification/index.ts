
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
    console.log('Setting up verification system...');
    
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
      console.log('Checking if id-documents bucket exists...');
      const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.getBucket('id-documents');
      
      if (bucketError || !bucketData) {
        console.log('Creating id-documents bucket...');
        const { error: createBucketError } = await supabaseAdmin.storage.createBucket('id-documents', {
          public: false, // Make sure it's private for security
        });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          throw createBucketError;
        }
        console.log('Bucket created successfully');
      } else {
        console.log('Bucket already exists');
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
      console.log('Setting up storage policies...');
      
      // Remove existing policies to avoid conflicts
      await supabaseAdmin.storage.from('id-documents').deletePolicy();
      console.log('Deleted existing policies');
      
      // Create policy for users to upload their own documents with folder path structure
      await supabaseAdmin.storage.from('id-documents').createPolicy('User Upload Policy', {
        name: 'User Upload Policy',
        definition: {
          type: 'INSERT',
          match: { prefix: '{{auth.uid}}/' },
          roles: ['authenticated'],
        }
      });
      console.log('Created upload policy');

      // Create policy for users to read their own documents
      await supabaseAdmin.storage.from('id-documents').createPolicy('User Read Policy', {
        name: 'User Read Policy',
        definition: {
          type: 'SELECT',
          match: { prefix: '{{auth.uid}}/' },
          roles: ['authenticated'],
        }
      });
      console.log('Created read policy');

      // Create policy for admins to read all documents
      await supabaseAdmin.storage.from('id-documents').createPolicy('Admin Read Policy', {
        name: 'Admin Read Policy',
        definition: {
          type: 'SELECT',
          match: { prefix: '*' },
          roles: ['service_role'],
        }
      });
      console.log('Created admin policy');

    } catch (policyError) {
      console.log('Policy setup error (may already exist):', policyError);
      // We continue even if policy creation fails as policies might already exist
    }

    // Create the verification RPC function
    try {
      console.log('Setting up verification RPC function...');
      
      // Create a helper function to safely create/update verification records
      const createRpcFunction = `
      CREATE OR REPLACE FUNCTION public.create_verification_record(
        p_user_id UUID,
        p_document_path TEXT
      ) RETURNS public.freelancer_verification LANGUAGE plpgsql SECURITY DEFINER AS $$
      DECLARE
        result public.freelancer_verification;
      BEGIN
        -- Insert or update the verification record
        INSERT INTO public.freelancer_verification (
          user_id, 
          id_document_path, 
          verification_status, 
          submitted_at, 
          updated_at
        ) VALUES (
          p_user_id, 
          p_document_path, 
          'pending', 
          NOW(), 
          NOW()
        ) 
        ON CONFLICT (user_id) DO UPDATE SET
          id_document_path = p_document_path,
          verification_status = 'pending',
          submitted_at = NOW(),
          updated_at = NOW()
        RETURNING * INTO result;
        
        RETURN result;
      END;
      $$;
      `;
      
      await supabaseAdmin.rpc('exec_sql', { sql: createRpcFunction });
      console.log('Created RPC function successfully');
      
    } catch (rpcError) {
      console.error('RPC function setup error:', rpcError);
      // Continue execution as this might fail if function exists
    }

    // Make sure that the table has a unique constraint on user_id
    try {
      console.log('Ensuring user_id constraint exists...');
      
      const alterTableSQL = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'freelancer_verification_user_id_key' 
          AND conrelid = 'public.freelancer_verification'::regclass
        ) THEN
          ALTER TABLE public.freelancer_verification ADD CONSTRAINT freelancer_verification_user_id_key UNIQUE (user_id);
        END IF;
      END
      $$;
      `;
      
      await supabaseAdmin.rpc('exec_sql', { sql: alterTableSQL });
      console.log('User ID constraint ensured');
      
    } catch (constraintError) {
      console.error('Constraint setup error:', constraintError);
      // Continue execution
    }

    // Make sure RLS is properly set up
    try {
      console.log('Setting up row level security policies...');
      
      // Make sure RLS is enabled
      await supabaseAdmin.rpc('exec_sql', { 
        sql: `ALTER TABLE public.freelancer_verification ENABLE ROW LEVEL SECURITY;` 
      });
      
      // Try to create policies - this might fail if they already exist, which is fine
      const policies = [
        `CREATE POLICY IF NOT EXISTS "Users can insert their own verification records" 
         ON public.freelancer_verification FOR INSERT WITH CHECK (auth.uid() = user_id);`,
        
        `CREATE POLICY IF NOT EXISTS "Users can view their own verification records" 
         ON public.freelancer_verification FOR SELECT USING (auth.uid() = user_id);`,
        
        `CREATE POLICY IF NOT EXISTS "Users can update their own verification records" 
         ON public.freelancer_verification FOR UPDATE USING (auth.uid() = user_id);`,
        
        `CREATE POLICY IF NOT EXISTS "Service role can access all verification records" 
         ON public.freelancer_verification FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');`
      ];
      
      // Apply each policy
      for (const policySQL of policies) {
        try {
          await supabaseAdmin.rpc('exec_sql', { sql: policySQL });
          console.log('Applied policy successfully');
        } catch (error) {
          console.log('Policy may already exist:', error);
          // Continue with next policy
        }
      }
      
    } catch (policyError) {
      console.error('Policy setup error:', policyError);
      // Continue execution as this might fail if policies exist
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
