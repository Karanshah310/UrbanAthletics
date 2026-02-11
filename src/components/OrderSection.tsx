import { useEffect, useRef, useState } from "react";
import { ShoppingCart, MapPin, Clock, Truck, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import shoeImage from "@/assets/urban-athletics-shoe.png";

const OrderSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { setIsCartOpen, totalItems } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="order"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary border border-primary/30 rounded-full bg-primary/10">
              Ready to Order?
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient mb-4">
              GET YOURS TODAY
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Add to cart, checkout with your details, and pay on delivery - it's that simple!
            </p>
          </div>

          {/* Order card */}
          <div className={`relative p-8 md:p-12 rounded-3xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Decorative shoe image */}
            <div className="absolute -top-16 -right-8 md:-right-16 w-32 md:w-48 opacity-30 rotate-12 pointer-events-none">
              <img src={shoeImage} alt="" className="w-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left - Product summary */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={shoeImage}
                    alt="Urban Athletics Shoe"
                    className="w-20 h-20 object-contain rounded-xl bg-muted/50 p-2"
                  />
                  <div>
                    <h3 className="font-display text-xl text-foreground">Urban Athletics Series</h3>
                    <p className="text-muted-foreground text-sm">Performance Footwear</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-display text-gradient">₹3700</span>
                  <span className="text-muted-foreground line-through">₹4500</span>
                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-medium">
                    18% OFF
                  </span>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Pan India Delivery Available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Delivery within 5-7 business days</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>Free Shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Cash on Delivery available</span>
                  </div>
                </div>
              </div>

              {/* Right - Action button */}
              <div className="space-y-4">
                {/* View Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-brand text-primary-foreground font-semibold text-lg transition-all duration-300 hover:scale-[1.02] animate-pulse-glow"
                >
                  <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                  <span>
                    {totalItems > 0 ? `View Cart (${totalItems} items)` : "View Cart"}
                  </span>
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Select your size and add to cart from the product section above
                </p>
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-primary/30 rounded-br-xl" />
          </div>

          {/* Footer note */}
          <p className={`text-center mt-8 text-muted-foreground text-sm transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Cash on Delivery • Free Shipping • Easy Returns
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
