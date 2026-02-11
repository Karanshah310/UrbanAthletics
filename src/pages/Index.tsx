import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";

import ProductSection from "@/components/ProductSection";
import OrderSection from "@/components/OrderSection";

const Index = () => {
  return (
    <>
      <Header />
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      
      <ProductSection />
      <OrderSection />
      
      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <span className="font-display text-xl text-gradient">URBAN ATHLETICS</span>
              <p className="text-muted-foreground text-sm mt-1">Where Style Meets Performance</p>
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Urban Athletics. Created by Karan Shah.
            </p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
};

export default Index;