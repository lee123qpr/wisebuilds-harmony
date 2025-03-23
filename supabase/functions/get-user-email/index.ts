
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
    // Check if Supabase environment variables are available
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Supabase URL available:', !!supabaseUrl);
    console.log('Supabase Service Role Key available:', !!supabaseServiceRoleKey);
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    // Extract the request body
    const { userId } = await req.json();
    
    if (!userId) {
      console.error('No userId provided in request');
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log('Fetching user data for userId:', userId);

    // First, try to get user from client_profiles
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('client_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error('Error fetching client profile:', profileError);
    }
    
    console.log('Client profile data:', profileData);

    // Get the user's data from auth.users table
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      console.error('Error fetching user data:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('User data fetched successfully:', !!data);
    console.log('User object available:', !!data?.user);
    
    if (data?.user) {
      console.log('Email available:', !!data.user.email);
      console.log('User metadata available:', !!data.user.user_metadata);
      if (data.user.user_metadata) {
        console.log('User metadata keys:', Object.keys(data.user.user_metadata));
        console.log('Full name in metadata:', data.user.user_metadata.full_name);
      }
    }
    
    // Get the full name from user metadata or other sources
    const fullName = profileData?.contact_name || 
                    data?.user?.user_metadata?.full_name || 
                    data?.user?.user_metadata?.name ||
                    null;
                    
    const email = profileData?.email || data?.user?.email || null;
    
    console.log('Extracted full name:', fullName);
    console.log('Extracted email:', email);
    
    // Return the combined information, prioritizing profile data
    return new Response(
      JSON.stringify({
        email,
        full_name: fullName,
        contact_name: profileData?.contact_name || null,
        company_name: profileData?.company_name || null,
        phone_number: profileData?.phone_number || null,
        company_address: profileData?.company_address || null,
        website: profileData?.website || null,
        user_metadata: data?.user?.user_metadata || null,
        // Include the profile data if available
        profile: profileData || null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
