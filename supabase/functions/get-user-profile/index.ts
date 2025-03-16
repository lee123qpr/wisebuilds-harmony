
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

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
    const { userId } = await req.json()

    if (!userId) {
      throw new Error('userId is required')
    }

    // Get the user by ID using the admin API
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId)

    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('User not found')
    }
    
    console.log('User found:', user.user.id);
    console.log('User metadata:', JSON.stringify(user.user.user_metadata));

    // Try to get profile data from freelancer_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileData && !profileError) {
      console.log('Found profile data in freelancer_profiles');
      
      // Ensure skills is properly formatted
      let skills = [];
      if (profileData.skills) {
        if (Array.isArray(profileData.skills)) {
          skills = profileData.skills;
        } else if (typeof profileData.skills === 'string') {
          skills = [profileData.skills];
        } else if (typeof profileData.skills === 'object') {
          // Handle case where skills might be a JSON object
          try {
            const parsedSkills = JSON.parse(JSON.stringify(profileData.skills));
            skills = Array.isArray(parsedSkills) ? parsedSkills : [];
          } catch (e) {
            console.error('Error parsing skills:', e);
            skills = [];
          }
        }
      }
      
      // Return both user data and profile data
      return new Response(
        JSON.stringify({
          email: user.user.email,
          user_metadata: user.user.user_metadata,
          profile_data: {
            ...profileData,
            skills: skills
          }
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          status: 200,
        }
      )
    }

    // Return the user email and metadata if no profile data found
    return new Response(
      JSON.stringify({
        email: user.user.email,
        user_metadata: user.user.user_metadata,
        profile_data: null
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
    console.error('Error in get-user-profile:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
