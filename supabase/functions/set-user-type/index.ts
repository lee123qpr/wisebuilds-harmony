
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse the request body
    const { userId, userType } = await req.json()

    if (!userId) {
      throw new Error('userId is required')
    }

    if (!userType || !['freelancer', 'business', 'admin'].includes(userType)) {
      throw new Error('Valid userType is required')
    }

    console.log(`Setting user ${userId} to type ${userType}`)

    // Update the user metadata using the admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        user_metadata: { 
          user_type: userType 
        } 
      }
    )

    if (error) {
      console.error('Error updating user metadata:', error)
      throw error
    }

    console.log('Successfully updated user metadata')

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `User type updated to ${userType}`,
        user: data.user
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in set-user-type function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400,
      }
    )
  }
})
