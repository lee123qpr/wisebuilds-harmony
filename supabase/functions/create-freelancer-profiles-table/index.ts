
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

    // Check if the freelancer_profiles table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'freelancer_profiles')

    if (tablesError) {
      throw tablesError;
    }

    // If table doesn't exist, create it
    if (!tables.length) {
      // Create the freelancer_profiles table
      const { error: createTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE public.freelancer_profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            display_name TEXT,
            first_name TEXT,
            last_name TEXT,
            job_title TEXT,
            location TEXT,
            bio TEXT,
            email TEXT,
            phone_number TEXT,
            website TEXT,
            profile_photo TEXT,
            hourly_rate TEXT,
            availability TEXT,
            skills JSONB,
            experience TEXT,
            qualifications JSONB,
            accreditations JSONB,
            indemnity_insurance JSONB,
            previous_work JSONB,
            previous_employers JSONB,
            id_verified BOOLEAN DEFAULT FALSE,
            jobs_completed INTEGER DEFAULT 0,
            rating DECIMAL(3,1),
            reviews_count INTEGER DEFAULT 0,
            member_since TIMESTAMP WITH TIME ZONE DEFAULT now(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );

          CREATE TRIGGER set_freelancer_profiles_updated_at
          BEFORE UPDATE ON public.freelancer_profiles
          FOR EACH ROW
          EXECUTE FUNCTION handle_updated_at();
        `
      });

      if (createTableError) {
        throw createTableError;
      }
    } else {
      // Check for missing columns and add them
      const queries = [];
      
      // Check for fields in client_profiles and add them to freelancer_profiles if missing
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'freelancer_profiles');
        
      if (columnsError) {
        throw columnsError;
      }
      
      const existingColumns = columns.map(col => col.column_name);
      
      // Define required columns
      const requiredColumns = [
        { name: 'email', type: 'TEXT' },
        { name: 'profile_photo', type: 'TEXT' },
        { name: 'first_name', type: 'TEXT' },
        { name: 'last_name', type: 'TEXT' },
        { name: 'rating', type: 'DECIMAL(3,1)' },
        { name: 'reviews_count', type: 'INTEGER DEFAULT 0' }
      ];
      
      // Add any missing columns
      for (const col of requiredColumns) {
        if (!existingColumns.includes(col.name)) {
          queries.push(`ALTER TABLE public.freelancer_profiles ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`);
        }
      }
      
      // Execute the queries if any
      if (queries.length > 0) {
        const { error: alterTableError } = await supabase.rpc('exec_sql', {
          sql: queries.join('\n')
        });
        
        if (alterTableError) {
          throw alterTableError;
        }
      }
    }
    
    // Also add email to client_profiles if it doesn't exist
    const { data: clientColumns, error: clientColumnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'client_profiles')
      .eq('column_name', 'email');
      
    if (clientColumnsError) {
      throw clientColumnsError;
    }
    
    // Add email column to client_profiles if it doesn't exist
    if (!clientColumns.length) {
      const { error: alterClientTableError } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE public.client_profiles ADD COLUMN IF NOT EXISTS email TEXT;`
      });
      
      if (alterClientTableError) {
        throw alterClientTableError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Freelancer profiles table checked and updated' 
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
