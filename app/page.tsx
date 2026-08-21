import { FeaturedGearSection } from "@/components/gears/featured-gear-section";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/ui/hero";
import { Categories } from "@/components/gears/categories";
import { HowItWorks } from "@/components/gears/how-it-works";

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
      <Footer />
    </>
  );
}
