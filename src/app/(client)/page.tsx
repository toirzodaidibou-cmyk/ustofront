import SwiperHero from "@/components/SwiperHero";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASectionAlternative";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <SwiperHero />
      <ServicesSection />
      <WhyUsSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}
