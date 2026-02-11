import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import shoeImage from "@/assets/urban-athletics-shoe.png";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16 md:pt-20">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container relative z-10 px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left content */}
          <div className={`space-y-6 md:space-y-8 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            {/* Brand badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm"
              style={{ animationDelay: '0.2s' }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Premium Collection</span>
            </div>

            {/* Main title */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-wider">
              <span className="block text-primary">URBAN</span>
              <span className="block text-primary">ATHLETICS</span>
              <span className="block text-foreground/90">SERIES</span>
            </h1>

            {/* Features badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {["Flexible", "Durable", "Comfortable Fit"].map((feature, index) => (
                <span
                  key={feature}
                  className="px-4 py-2 rounded-full bg-muted/50 border border-border text-sm font-medium text-foreground/80 backdrop-blur-sm"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 justify-center lg:justify-start">
              <span className="text-4xl md:text-5xl font-display text-gradient">₹3700</span>
              <span className="text-muted-foreground line-through">₹4500</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={scrollToFeatures}
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-full bg-gradient-brand text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-105 animate-pulse-glow"
            >
              <span className="relative z-10">Explore Now</span>
              <ChevronDown className="relative z-10 w-5 h-5 animate-bounce" />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Right - Product Image */}
          <div className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {/* Glow behind shoe */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 md:w-[450px] md:h-[450px] bg-primary/15 rounded-full blur-[60px]" />
            </div>
            
            {/* Shoe image */}
            <div className="relative animate-float">
              <img
                src={shoeImage}
                alt="Urban Athletics Premium Performance Shoe"
                className="w-full max-w-md md:max-w-lg lg:max-w-xl drop-shadow-2xl"
                style={{
                  filter: "drop-shadow(0 25px 50px rgba(255, 107, 0, 0.4))"
                }}
              />
              
              {/* Floating particles */}
              <div className="absolute top-1/4 -left-8 w-4 h-4 bg-primary rounded-full blur-sm animate-float-subtle" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 -right-4 w-3 h-3 bg-secondary rounded-full blur-sm animate-float-subtle" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-primary rounded-full blur-sm animate-float-subtle" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
};

export default HeroSection;
