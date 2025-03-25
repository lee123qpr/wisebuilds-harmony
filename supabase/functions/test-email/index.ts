
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  to: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to } = await req.json() as TestEmailRequest;
    
    console.log("Sending test email to:", to);

    // Create HTML email content with a responsive design
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Freelance Portal</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #111827;">Test Email</h2>
          <p style="color: #4b5563; line-height: 1.5;">This is a test email to verify that the Resend API integration is working correctly.</p>
          <div style="margin: 30px 0;">
            <a href="https://resend.com" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Visit Resend
            </a>
          </div>
        </div>
        <div style="padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>This is an automated test message.</p>
          <p>&copy; ${new Date().getFullYear()} Freelance Portal. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Freelance Portal <onboarding@resend.dev>", // Using Resend default domain
      to: [to],
      subject: "Test Email from Freelance Portal",
      html: html,
    });

    console.log("Test email sent successfully:", emailResponse);
    
    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in test-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
