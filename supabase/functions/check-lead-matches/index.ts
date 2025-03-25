
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting lead match check...");
    
    // Get recent projects (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data: recentProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .gte('created_at', yesterday.toISOString());
      
    if (projectsError) {
      throw new Error(`Error fetching recent projects: ${projectsError.message}`);
    }
    
    console.log(`Found ${recentProjects.length} recent projects to check for matches`);
    
    if (recentProjects.length === 0) {
      return new Response(
        JSON.stringify({ message: "No recent projects to check" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Get all freelancers with lead settings
    const { data: freelancersWithSettings, error: freelancersError } = await supabase
      .from('lead_settings')
      .select(`
        *,
        freelancer:user_id (
          id,
          email:freelancer_profiles!inner(email, first_name, last_name)
        )
      `)
      .eq('notifications_enabled', true);
      
    if (freelancersError) {
      throw new Error(`Error fetching freelancers: ${freelancersError.message}`);
    }
    
    console.log(`Found ${freelancersWithSettings.length} freelancers with lead settings`);
    
    // For each project, find matching freelancers
    const matchResults = await Promise.all(
      recentProjects.map(async (project) => {
        // Find matching freelancers based on lead settings
        const matches = freelancersWithSettings.filter((settings) => {
          // Basic matching logic - extend this as needed
          let isMatch = true;
          
          if (settings.role && settings.role !== 'any' && settings.role !== project.role) {
            isMatch = false;
          }
          
          if (settings.location && settings.location !== project.location) {
            isMatch = false;
          }
          
          if (settings.work_type && settings.work_type !== project.work_type) {
            isMatch = false;
          }
          
          if (settings.project_type && Array.isArray(settings.project_type) && settings.project_type.length > 0) {
            if (!settings.project_type.includes(project.work_type)) {
              isMatch = false;
            }
          }
          
          return isMatch;
        });
        
        console.log(`Project ${project.id} matches ${matches.length} freelancers`);
        
        // Send notifications and emails to matching freelancers
        for (const match of matches) {
          if (!match.freelancer || !match.freelancer.email) continue;
          
          const freelancerData = match.freelancer.email[0];
          if (!freelancerData || !freelancerData.email) continue;
          
          const freelancerId = match.user_id;
          const freelancerEmail = freelancerData.email;
          const freelancerName = `${freelancerData.first_name || ''} ${freelancerData.last_name || ''}`.trim();
          
          // Create notification
          const notification = {
            type: 'lead',
            title: 'New Lead Available',
            description: `A new project "${project.title}" matching your criteria has been posted`,
            user_id: freelancerId,
            data: {
              id: project.id,
              title: project.title
            },
            read: false
          };
          
          // Insert notification in database
          const { error: notifError } = await supabase
            .from('notifications')
            .insert(notification);
            
          if (notifError) {
            console.error(`Error creating notification for freelancer ${freelancerId}:`, notifError);
            continue;
          }
          
          // Send email if email_alerts is enabled
          if (match.email_alerts) {
            // Call the send-email edge function
            const { error: emailError } = await supabase.functions.invoke("send-email/lead-match", {
              body: {
                freelancerId,
                projectId: project.id,
                email: freelancerEmail,
                name: freelancerName
              }
            });
            
            if (emailError) {
              console.error(`Error sending email to freelancer ${freelancerId}:`, emailError);
            }
          }
        }
        
        return {
          projectId: project.id,
          matchCount: matches.length
        };
      })
    );
    
    return new Response(
      JSON.stringify({ 
        message: "Lead matching complete", 
        results: matchResults,
        projectsChecked: recentProjects.length,
        freelancersChecked: freelancersWithSettings.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
    
  } catch (error) {
    console.error("Error in check-lead-matches function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
