
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: PasswordResetRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Brixium Global Bank <noreply@brixium.com>",
      to: [email],
      subject: "Reset Your Brixium Account Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #7c3aed 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Brixium Global Bank</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0;">Secure Digital Banking Platform</p>
          </div>
          
          <h2 style="color: #1e293b; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
            We received a request to reset your password for your Brixium account. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            This link will expire in 24 hours for security reasons.
          </p>
          
          <div style="border-top: 1px solid #e2e8f0; margin-top: 40px; padding-top: 20px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2024 Brixium Global Bank. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
