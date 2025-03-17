
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Define CORS headers to allow requests from your frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client with the Admin key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify the user is authenticated and is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is an admin
    if (user.user_metadata?.user_type !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch all users (admin operation)
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) {
      console.error('Error fetching users:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Make sure users data exists and has the expected structure
    if (!users || !users.users || !Array.isArray(users.users)) {
      console.error('Invalid user data structure received from Supabase')
      return new Response(
        JSON.stringify({ error: 'Invalid user data received from server' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // In Supabase Auth, when users are soft-deleted they're moved to a "deleted" status
    // The proper way to check for deleted users is by looking at the 'banned_until' field
    // and determining if the user has been soft-deleted
    const activeUsers = [];
    const deletedUsers = [];
    
    users.users.forEach(user => {
      // Log a sample user to see the structure
      if (activeUsers.length === 0 && deletedUsers.length === 0) {
        console.log('Sample user structure:', JSON.stringify(user, null, 2));
      }
      
      // Supabase doesn't use 'deleted_at' in the Auth API
      // Instead, it marks deleted users with a special banned status
      // Check if user has been deleted by looking at their properties
      const isDeleted = user.banned_until === 'infinity';
      
      if (isDeleted) {
        deletedUsers.push(user);
      } else {
        activeUsers.push(user);
      }
    });
    
    console.log(`Found ${activeUsers.length} active users and ${deletedUsers.length} deleted users`);

    return new Response(
      JSON.stringify({ 
        users: activeUsers,
        deletedUsers: deletedUsers 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
