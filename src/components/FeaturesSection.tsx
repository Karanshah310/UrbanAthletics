import { useEffect, useRef, useState } from "react";
import { Zap, Shield, Cloud, Target } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Flexibility",
    description: "Advanced flex technology adapts to every movement for natural motion",
  },
  {
    icon: Shield,
    title: "Durability",
    description: "Built with premium materials designed to withstand intense workouts",
  },
  {
    icon: Cloud,
    title: "Comfort",
    description: "Cloud-like cushioning provides all-day comfort and support",
  },
  {
    icon: Target,
    title: "Performance",
    description: "Engineered for peak athletic performance in any condition",
  },
];

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      id="features"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 md:px-8">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary border border-primary/30 rounded-full bg-primary/10">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient mb-4">
            PREMIUM FEATURES
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Where Style Meets Performance — crafted for athletes who demand the best
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-6 md:p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:bg-card/80 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                transform: isVisible ? 'perspective(1000px) rotateX(0deg)' : 'perspective(1000px) rotateX(10deg)'
              }}
            >
              {/* Icon */}
              <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-brand text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <feature.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl text-foreground mb-3 group-hover:text-gradient transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10" />
              </div>

              {/* Corner accent */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;