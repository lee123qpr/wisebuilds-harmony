
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
    console.log('Setting up storage policies...')

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
      console.log('Bucket created successfully')
    } else {
      console.log('Bucket verification_documents already exists')
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
