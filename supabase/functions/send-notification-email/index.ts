
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define the interface for the notification email request
interface NotificationEmailRequest {
  email: string;
  notificationType: string;
  title: string;
  description: string;
  data?: any;
  recipientName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, notificationType, title, description, data, recipientName } = await req.json() as NotificationEmailRequest;
    
    console.log("Sending email notification:", { email, notificationType, title });

    // Generate appropriate action URL based on notification type
    let actionUrl = `${Deno.env.get("FRONTEND_URL") || "https://your-domain.com"}/dashboard`;
    let actionText = "View Dashboard";
    
    switch (notificationType) {
      case "message":
        actionUrl = `${Deno.env.get("FRONTEND_URL") || "https://your-domain.com"}/dashboard/messages?conversation=${data?.conversation_id}`;
        actionText = "View Message";
        break;
      case "lead":
        actionUrl = `${Deno.env.get("FRONTEND_URL") || "https://your-domain.com"}/dashboard/freelancer/leads`;
        actionText = "View Lead";
        break;
      case "hired":
        actionUrl = `${Deno.env.get("FRONTEND_URL") || "https://your-domain.com"}/dashboard/freelancer/quotes`;
        actionText = "View Quote";
        break;
      case "credit_update":
        actionUrl = `${Deno.env.get("FRONTEND_URL") || "https://your-domain.com"}/dashboard/freelancer/credits`;
        actionText = "View Credits";
        break;
      // Add more cases as needed
    }

    // Create HTML email content with a responsive design
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Freelance Portal</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #111827;">${title}</h2>
          <p style="color: #4b5563; line-height: 1.5;">${description}</p>
          <div style="margin: 30px 0;">
            <a href="${actionUrl}" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              ${actionText}
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If the button above doesn't work, copy and paste this URL into your browser:<br>
            <a href="${actionUrl}" style="color: #4f46e5; word-break: break-all;">${actionUrl}</a>
          </p>
        </div>
        <div style="padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Freelance Portal. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Freelance Portal <notifications@resend-domain.com>", // Replace with your verified domain
      to: [email],
      subject: title,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);
    
    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
