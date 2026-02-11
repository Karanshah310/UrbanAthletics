import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    name: string;
    size: number;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const order: OrderDetails = await req.json();
    console.log("Received order:", order);

    // Format the order message
    const itemsList = order.items
      .map((item) => `• ${item.name} (Size: EU ${item.size}) x${item.quantity} - ₹${item.price * item.quantity}`)
      .join("\n");

    const message = `🛒 *NEW ORDER RECEIVED!*

👤 *Customer Details:*
Name: ${order.fullName}
Phone: ${order.phone}
Email: ${order.email}

📍 *Delivery Address:*
${order.address}
${order.city}, ${order.state} - ${order.pincode}

📦 *Order Items:*
${itemsList}

💰 *Total: ₹${order.totalPrice}*

📅 Order Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

    // Send WhatsApp message using TextMeBot API
    // The business owner's number
    const businessPhone = "6352947066";
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Use the TextMeBot API for WhatsApp notifications
    const apiKey = Deno.env.get("TEXTMEBOT_API_KEY");
    
    if (apiKey) {
      const whatsappUrl = `https://api.textmebot.com/send.php?recipient=91${businessPhone}&apikey=${apiKey}&text=${encodedMessage}`;
      
      console.log("Sending WhatsApp notification via TextMeBot...");
      const response = await fetch(whatsappUrl);
      const responseText = await response.text();
      console.log("TextMeBot API response:", response.status, responseText);
      
      if (!response.ok) {
        console.error("Failed to send WhatsApp message:", responseText);
      }
    } else {
      console.log("TEXTMEBOT_API_KEY not set, skipping WhatsApp notification");
      console.log("Order details logged for manual processing:", message);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Order notification sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-whatsapp-order function:", error);
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
