
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
  replyTo?: string;
}

interface LeadMatchEmailRequest {
  freelancerId: string;
  projectId: string;
  email: string;
  name: string;
}

interface NotificationEmailRequest {
  userId: string;
  email: string;
  notificationType: string;
  title: string;
  description: string;
  data?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();
    console.log(`Email endpoint called: ${path}`);

    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);

    // Handle different email types based on the endpoint path
    switch (path) {
      case "lead-match":
        return await handleLeadMatchEmail(body);
      case "notification":
        return await handleNotificationEmail(body);
      case "custom":
        return await handleCustomEmail(body);
      default:
        throw new Error(`Unknown email type: ${path}`);
    }
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

// Handle sending emails for new lead matches
async function handleLeadMatchEmail(body: LeadMatchEmailRequest) {
  const { freelancerId, projectId, email, name } = body;

  // Fetch project details from database
  const { data: project, error: projectError } = await fetch(
    `${Deno.env.get("SUPABASE_URL")}/rest/v1/projects?id=eq.${projectId}&select=*`,
    {
      headers: {
        apikey: Deno.env.get("SUPABASE_ANON_KEY") || "",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY") || ""}`,
      },
    }
  ).then(res => res.json());

  if (projectError || !project || project.length === 0) {
    throw new Error(`Could not fetch project details: ${projectError || "Project not found"}`);
  }

  const projectDetails = project[0];
  
  // Send the email
  const emailResponse = await resend.emails.send({
    from: "Freelance Portal <notifications@your-domain.com>",
    to: [email],
    subject: `New Lead: ${projectDetails.title} - Matching Your Skills`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>New Project Match</h1>
        <p>Hello ${name},</p>
        <p>We found a new project that matches your skills and preferences:</p>
        <div style="border-left: 4px solid #4f46e5; padding: 10px; background-color: #f9fafb; margin: 20px 0;">
          <h2 style="margin-top: 0;">${projectDetails.title}</h2>
          <p><strong>Location:</strong> ${projectDetails.location}</p>
          <p><strong>Role:</strong> ${projectDetails.role}</p>
          <p><strong>Budget:</strong> ${projectDetails.budget}</p>
          <p><strong>Work Type:</strong> ${projectDetails.work_type}</p>
        </div>
        <p style="margin-bottom: 30px;">Log in to your account to view the complete project details and submit your quote.</p>
        <a href="${Deno.env.get("FRONTEND_URL") || "https://your-domain.com"}/projects/${projectId}" 
           style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          View Project
        </a>
      </div>
    `,
  });

  console.log("Lead match email response:", emailResponse);
  
  return new Response(JSON.stringify(emailResponse), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// Handle sending emails for normal notifications
async function handleNotificationEmail(body: NotificationEmailRequest) {
  const { email, notificationType, title, description, data } = body;
  
  // Customize email content based on notification type
  let emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>${title}</h1>
      <p>${description}</p>
  `;

  // Add specific content based on notification type
  switch (notificationType) {
    case "message":
      emailHtml += `
        <p>You have received a new message. Log in to view and respond.</p>
        <a href="${Deno.env.get("FRONTEND_URL") || "https://your-domain.com"}/dashboard/messages?conversation=${data?.conversation_id}" 
           style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 15px;">
          View Message
        </a>
      `;
      break;
    case "hired":
      emailHtml += `
        <p>Congratulations! A client has accepted your quote.</p>
        <a href="${Deno.env.get("FRONTEND_URL") || "https://your-domain.com"}/dashboard/freelancer/quotes" 
           style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 15px;">
          View Quote
        </a>
      `;
      break;
    // Add more cases for other notification types
    default:
      emailHtml += `
        <a href="${Deno.env.get("FRONTEND_URL") || "https://your-domain.com"}/dashboard" 
           style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 15px;">
          Go to Dashboard
        </a>
      `;
  }

  emailHtml += `
    </div>
  `;

  // Send the email
  const emailResponse = await resend.emails.send({
    from: "Freelance Portal <notifications@your-domain.com>",
    to: [email],
    subject: title,
    html: emailHtml,
  });

  console.log("Notification email response:", emailResponse);
  
  return new Response(JSON.stringify(emailResponse), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// Handle sending custom emails
async function handleCustomEmail(body: EmailRequest) {
  const { to, subject, html, from, text, replyTo } = body;
  
  // Send the email
  const emailResponse = await resend.emails.send({
    from: from || "Freelance Portal <notifications@your-domain.com>",
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    reply_to: replyTo,
  });

  console.log("Custom email response:", emailResponse);
  
  return new Response(JSON.stringify(emailResponse), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
