import { ContactSection } from "@/components/custom/contact-section";
import { HowItWorks } from "@/components/custom/how-it-works";
import { FeaturedGearSection } from "@/components/gears/featured-gear-section";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { Hero } from "@/components/home/hero";
import { ProviderCta } from "@/components/home/provider-cta";
import { CategoriesSkeleton } from "@/components/shared/categories-skeleton";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoryShowcase />
      </Suspense>
      <FeaturedGearSection />
      <HowItWorks />
      <ProviderCta />
      <ContactSection />
    </>
  );
}
