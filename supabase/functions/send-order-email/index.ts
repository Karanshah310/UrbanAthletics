import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface OrderEmailRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalPrice: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received order email request");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderEmailRequest = await req.json();
    console.log("Order data:", JSON.stringify(orderData));

    const { fullName, email, items, totalPrice, address, city, state, pincode } = orderData;

    if (!email) {
      console.error("No email provided");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.size}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">₹${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Urban Athletics</h1>
            <p style="color: #a0a0a0; margin: 10px 0 0;">Order Confirmation</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Thank you for your order, ${fullName}!</h2>
            <p style="color: #666; line-height: 1.6;">Your order has been received and is being processed. Here are your order details:</p>
            
            <!-- Order Items -->
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f8f8f8;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #1a1a2e;">Product</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #1a1a2e;">Size</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #1a1a2e;">Qty</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #1a1a2e;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <!-- Total -->
            <div style="background-color: #1a1a2e; color: #ffffff; padding: 15px; text-align: right; font-size: 18px; border-radius: 8px;">
              <strong>Total: ₹${totalPrice.toLocaleString()}</strong>
            </div>
            
            <!-- Shipping Address -->
            <div style="margin-top: 25px; padding: 20px; background-color: #f8f8f8; border-radius: 8px;">
              <h3 style="color: #1a1a2e; margin-top: 0;">Shipping Address</h3>
              <p style="color: #666; margin: 0; line-height: 1.8;">
                ${fullName}<br>
                ${address}<br>
                ${city}, ${state} - ${pincode}
              </p>
            </div>
            
            <p style="color: #666; margin-top: 25px; line-height: 1.6;">
              We'll notify you when your order is on its way. If you have any questions, feel free to reach out to us.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; margin: 0; font-size: 14px;">
              © 2024 Urban Athletics. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("Sending email to:", email);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Urban Athletics <onboarding@resend.dev>",
        to: [email],
        subject: "Order Confirmation - Urban Athletics",
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await response.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
