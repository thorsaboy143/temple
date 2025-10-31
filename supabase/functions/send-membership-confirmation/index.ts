import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resend_api_key = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  fullName: string;
  donationAmount: number;
  applicationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, donationAmount, applicationId }: ConfirmationEmailRequest = await req.json();

    console.log("Sending confirmation email to:", email);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resend_api_key}`,
      },
      body: JSON.stringify({
        from: "Temple Membership <onboarding@resend.dev>",
        to: [email],
        subject: "Membership Application Confirmation",
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #FF9933, #FFD700);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .details {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #FF9933;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 14px;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #FF9933, #FFD700);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🕉️ Temple Membership</h1>
              <p>Application Confirmation</p>
            </div>
            <div class="content">
              <h2>Namaste, ${fullName}!</h2>
              <p>Thank you for applying for temple membership. We have received your application successfully.</p>
              
              <div class="details">
                <h3>Application Details:</h3>
                <p><strong>Application ID:</strong> ${applicationId}</p>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Donation Amount:</strong> ₹${donationAmount}</p>
                <p><strong>Status:</strong> Pending Approval</p>
              </div>
              
              <p>Your application is currently under review. You will receive another email once your application has been approved by our admin team.</p>
              
              <p>You can track your application status anytime by logging into your dashboard.</p>
              
              <div class="footer">
                <p>May you be blessed with peace and prosperity 🙏</p>
                <p>© 2025 Temple Membership. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-membership-confirmation function:", error);
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
