import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, Truck, CreditCard, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        ...formData,
        items: items.map(item => ({
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice,
      };

      // Send order notification via WhatsApp
      const { error: whatsappError } = await supabase.functions.invoke('send-whatsapp-order', {
        body: orderData,
      });

      if (whatsappError) {
        console.error('WhatsApp notification error:', whatsappError);
      }

      // Send email confirmation if email is provided (non-blocking)
      if (formData.email) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-order-email', {
            body: orderData,
          });

          if (emailError) {
            console.error('Email notification failed (non-critical):', emailError);
          }
        } catch (emailErr) {
          // Email is optional - log and continue
          console.error('Email service unavailable:', emailErr);
        }
      }

      setOrderPlaced(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error('Order error:', err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-scale-in">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl text-gradient">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll contact you shortly to confirm delivery details.
          </p>
          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Truck className="w-5 h-5" />
              <span className="font-medium">Cash on Delivery</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Expected delivery: 5-7 business days
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-brand hover:opacity-90"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl px-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </button>

        <h1 className="font-display text-4xl md:text-5xl text-gradient mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4 bg-gradient-brand"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-8 p-6 rounded-2xl bg-card border border-border space-y-4">
                <h3 className="font-display text-xl text-foreground">Order Summary</h3>
                
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-lg bg-muted p-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Size: EU {item.size} × {item.quantity}</p>
                        <p className="text-sm text-primary font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-primary">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-gradient">₹{totalPrice}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="text-sm text-primary font-medium">Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                  <h3 className="font-display text-xl text-foreground">Contact Information</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="bg-muted border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-muted border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-muted border-border"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                  <h3 className="font-display text-xl text-foreground">Delivery Address</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="bg-muted border-border"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="bg-muted border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="bg-muted border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        className="bg-muted border-border"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 text-lg font-semibold bg-gradient-brand hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "Processing..." : `Place Order • ₹${totalPrice}`}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  By placing this order, you agree to our terms and conditions
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
