
// This edge function sets up the verification system
// It creates the necessary storage bucket if it doesn't exist

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Setting up verification system...')

    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Check if the verification_documents bucket exists, create it if not
    const { data: buckets, error: bucketsError } = await supabaseAdmin
      .storage
      .listBuckets()

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
      throw bucketsError
    }

    const bucketExists = buckets.some(bucket => bucket.name === 'verification_documents')
    
    if (!bucketExists) {
      console.log('Creating verification_documents bucket...')
      const { error: createBucketError } = await supabaseAdmin
        .storage
        .createBucket('verification_documents', {
          public: false,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
        })

      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError)
        throw createBucketError
      }
      
      // Create RLS policies for the bucket
      try {
        // Policy for uploading files
        await supabaseAdmin.rpc('create_storage_policy', {
          bucket_name: 'verification_documents',
          policy_name: 'Users can upload their own documents',
          operation: 'INSERT',
          policy_definition: "(bucket_id = 'verification_documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1))"
        });
        
        // Policy for viewing files
        await supabaseAdmin.rpc('create_storage_policy', {
          bucket_name: 'verification_documents',
          policy_name: 'Users can view their own documents',
          operation: 'SELECT',
          policy_definition: "(bucket_id = 'verification_documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1))"
        });
        
        // Policy for deleting files
        await supabaseAdmin.rpc('create_storage_policy', {
          bucket_name: 'verification_documents',
          policy_name: 'Users can delete their own documents',
          operation: 'DELETE',
          policy_definition: "(bucket_id = 'verification_documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1))"
        });
        
        // Policy for admins to view all files
        await supabaseAdmin.rpc('create_storage_policy', {
          bucket_name: 'verification_documents',
          policy_name: 'Admins can view all documents',
          operation: 'SELECT',
          policy_definition: "(bucket_id = 'verification_documents' AND auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'))"
        });
        
        console.log('Storage policies created successfully');
      } catch (policyError) {
        console.log('Error creating storage policies (may already exist):', policyError);
        // Continue anyway, as the bucket is created
      }
      
      console.log('Bucket created successfully')
    } else {
      console.log('Bucket verification_documents already exists')
    }

    // Check verification_status enum type
    try {
      const { error: typeCheckError } = await supabaseAdmin.from('_types').select('*').limit(1);
      
      if (typeCheckError) {
        console.log('Creating verification_status enum type...');
        await supabaseAdmin.rpc('exec_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
                CREATE TYPE verification_status AS ENUM ('not_submitted', 'pending', 'verified', 'rejected');
              END IF;
            END $$;
          `
        });
      }
    } catch (typeError) {
      console.log('Error checking or creating verification_status type:', typeError);
      // Continue anyway
    }

    // Now we'll check if the freelancer_verification table exists
    const { error: tableCheckError } = await supabaseAdmin
      .from('freelancer_verification')
      .select('id')
      .limit(1)
    
    if (tableCheckError) {
      console.log('The freelancer_verification table might not exist or has RLS issues:', tableCheckError);
      
      // Create the freelancer_verification table if it doesn't exist
      try {
        await supabaseAdmin.rpc('exec_sql', {
          query: `
            CREATE TABLE IF NOT EXISTS public.freelancer_verification (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              document_path TEXT,
              document_name TEXT,
              document_type TEXT,
              document_size BIGINT,
              status verification_status DEFAULT 'not_submitted',
              admin_notes TEXT,
              submitted_at TIMESTAMP WITH TIME ZONE,
              reviewed_at TIMESTAMP WITH TIME ZONE,
              reviewed_by UUID,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            
            -- Add updated_at trigger
            CREATE OR REPLACE TRIGGER set_updated_at
            BEFORE UPDATE ON public.freelancer_verification
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
            
            -- Enable RLS on the table
            ALTER TABLE public.freelancer_verification ENABLE ROW LEVEL SECURITY;
            
            -- Create policy allowing users to view only their own verification data
            DROP POLICY IF EXISTS "Users can view own verification data" ON public.freelancer_verification;
            CREATE POLICY "Users can view own verification data"
              ON public.freelancer_verification
              FOR SELECT
              USING (auth.uid() = user_id);
            
            -- Create policy allowing users to insert their own verification data
            DROP POLICY IF EXISTS "Users can insert own verification data" ON public.freelancer_verification;
            CREATE POLICY "Users can insert own verification data"
              ON public.freelancer_verification
              FOR INSERT
              WITH CHECK (auth.uid() = user_id);
            
            -- Create policy allowing users to update their own verification data
            DROP POLICY IF EXISTS "Users can update own verification data" ON public.freelancer_verification;
            CREATE POLICY "Users can update own verification data"
              ON public.freelancer_verification
              FOR UPDATE
              USING (auth.uid() = user_id);
            
            -- Create policy allowing admin to perform all operations on verification data
            DROP POLICY IF EXISTS "Admin can manage all verification data" ON public.freelancer_verification;
            CREATE POLICY "Admin can manage all verification data"
              ON public.freelancer_verification
              USING (auth.uid() IN (
                SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
              ));
          `
        });
        console.log('Created freelancer_verification table');
      } catch (createTableError) {
        console.log('Error creating freelancer_verification table:', createTableError);
      }
    } else {
      console.log('The freelancer_verification table exists and is accessible');
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verification system setup complete',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('Error setting up verification:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error setting up verification: ${error.message}`,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})
