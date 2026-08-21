import { Categories } from "@/components/custom/categories";
import { ContactSection } from "@/components/custom/contact-section";
import { HowItWorks } from "@/components/custom/how-it-works";
import { FeaturedGearSection } from "@/components/gears/featured-gear-section";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/ui/hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedGearSection
        title="Featured Gear"
        subtitle="Explore top-rated gear available for immediate booking"
      />
      <Categories />
      <HowItWorks />
      <ContactSection />
      <Footer />
    </>
  );
}
