import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Check, ShoppingCart, RotateCcw, Image } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import shoeImage from "@/assets/urban-athletics-shoe.png";

const Shoe3DViewer = lazy(() => import("./Shoe3DViewer"));

const sizes = [37, 38, 39, 40, 41, 42];

const specs = [
  "Premium Breathable Mesh Upper",
  "Advanced Cushioning System",
  "Non-Slip Rubber Outsole",
  "Lightweight EVA Midsole",
  "Reinforced Heel Counter",
  "Moisture-Wicking Insole",
];

const ProductSection = () => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<"image" | "3d">("image");
  const sectionRef = useRef<HTMLElement>(null);
  const { addToCart } = useCart();

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }

    addToCart({
      name: "Urban Athletics Series",
      price: 3700,
      size: selectedSize,
      quantity: 1,
      image: shoeImage,
    });

    toast.success("Added to cart!");
  };

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-muted/30 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Product Image / 3D View */}
          <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            {/* View toggle */}
            <div className="flex gap-2 mb-4 justify-center lg:justify-start">
              <button
                onClick={() => setView("image")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === "image"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Image className="w-4 h-4" />
                Photo
              </button>
              <button
                onClick={() => setView("3d")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === "3d"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                3D View
              </button>
            </div>

            {view === "image" ? (
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Background circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
                
                {/* Image */}
                <img
                  src={shoeImage}
                  alt="Urban Athletics Premium Shoe Details"
                  className="relative w-full h-full object-contain animate-float-subtle"
                  style={{
                    filter: "drop-shadow(0 30px 60px rgba(255, 107, 0, 0.3))"
                  }}
                />

                {/* Floating badge */}
                <div className="absolute bottom-8 left-8 px-4 py-2 rounded-xl bg-card/90 border border-border backdrop-blur-sm">
                  <span className="text-sm font-medium text-gradient">Premium Quality</span>
                </div>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="aspect-square max-w-lg mx-auto flex items-center justify-center bg-muted/30 rounded-2xl border border-border">
                    <div className="text-center text-muted-foreground">
                      <RotateCcw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                      <p>Loading 3D View...</p>
                    </div>
                  </div>
                }
              >
                <div className="relative max-w-lg mx-auto">
                  <Shoe3DViewer />
                </div>
              </Suspense>
            )}
          </div>

          {/* Right - Product Info */}
          <div className={`space-y-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Limited Edition
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-gradient mt-2 mb-4">
                URBAN ATHLETICS
              </h2>
              <p className="text-muted-foreground text-lg">
                Where Style Meets Performance — engineered for those who refuse to compromise
              </p>
            </div>

            {/* Size selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Select Size</span>
                <span className="text-sm text-muted-foreground">EU Sizing</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`relative w-14 h-14 rounded-xl font-medium text-lg transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-gradient-brand text-primary-foreground scale-105 glow-orange'
                        : 'bg-card border border-border text-foreground hover:border-primary/50 hover:bg-card/80'
                    }`}
                  >
                    {size}
                    {selectedSize === size && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
                        <Check className="w-3 h-3 text-secondary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <span className="font-medium text-foreground">Specifications</span>
              <div className="grid sm:grid-cols-2 gap-3">
                {specs.map((spec, index) => (
                  <div
                    key={spec}
                    className={`flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-3xl font-display text-gradient">₹3700</span>
                  <span className="ml-2 text-muted-foreground line-through">₹4500</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  Save 18%
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
