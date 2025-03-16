
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

      // Create policy for users to delete their own documents
      await supabaseAdmin.storage.from('id-documents').createPolicy('User Delete Policy', {
        name: 'User Delete Policy',
        definition: {
          type: 'DELETE',
          match: { prefix: '{{auth.uid}}/' },
          roles: ['authenticated'],
        }
      });
      console.log('Created delete policy');

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

    // Make sure RLS is properly set up for the freelancer_verification table
    try {
      console.log('Setting up row level security policies...');
      
      // Make sure RLS is enabled
      const enableRlsSql = `ALTER TABLE public.freelancer_verification ENABLE ROW LEVEL SECURITY;`;
      await supabaseAdmin.rpc('exec_sql', { sql: enableRlsSql }).catch(e => console.log('RLS already enabled'));
      
      // Define the RLS policies to create
      const policies = [
        // Drop existing policies first
        `DROP POLICY IF EXISTS "Users can insert their own verification records" ON public.freelancer_verification;`,
        `DROP POLICY IF EXISTS "Users can view their own verification records" ON public.freelancer_verification;`,
        `DROP POLICY IF EXISTS "Users can update their own verification records" ON public.freelancer_verification;`,
        `DROP POLICY IF EXISTS "Users can delete their own verification records" ON public.freelancer_verification;`,
        `DROP POLICY IF EXISTS "Service role can access all verification records" ON public.freelancer_verification;`,
        `DROP POLICY IF EXISTS "Admin users can view all verification records" ON public.freelancer_verification;`,
        
        // Create new policies
        `CREATE POLICY "Users can insert their own verification records" 
         ON public.freelancer_verification FOR INSERT WITH CHECK (auth.uid() = user_id);`,
        
        `CREATE POLICY "Users can view their own verification records" 
         ON public.freelancer_verification FOR SELECT USING (auth.uid() = user_id);`,
        
        `CREATE POLICY "Users can update their own verification records" 
         ON public.freelancer_verification FOR UPDATE USING (auth.uid() = user_id);`,
        
        `CREATE POLICY "Users can delete their own verification records" 
         ON public.freelancer_verification FOR DELETE USING (auth.uid() = user_id);`,
        
        `CREATE POLICY "Admin users can view all verification records" 
         ON public.freelancer_verification FOR ALL USING (
           auth.jwt() ->> 'user_type' = 'admin' OR
           auth.uid() IN (
             SELECT id FROM auth.users
             WHERE raw_user_meta_data ->> 'user_type' = 'admin'
           )
         );`,
        
        `CREATE POLICY "Service role can access all verification records" 
         ON public.freelancer_verification FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');`
      ];
      
      // Apply each policy
      for (const policySQL of policies) {
        try {
          await supabaseAdmin.rpc('exec_sql', { sql: policySQL });
          console.log(`Applied policy SQL: ${policySQL.substring(0, 50)}...`);
        } catch (error) {
          console.log('Policy operation error (may already exist):', error);
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
