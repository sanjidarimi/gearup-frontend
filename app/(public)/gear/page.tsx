import { GearCardSkeleton } from "@/components/gears/gear-card";
import type { Metadata } from "next";
import { Suspense } from "react";
import { GearPageContent } from "./gear-content";

export const metadata: Metadata = {
  title: "Browse gear",
  description:
    "Search and filter sports and outdoor equipment by category, brand, price and rental dates.",
};

export default function GearPage() {
  return (
    <Suspense fallback={<GearPageFallback />}>
      <GearPageContent />
    </Suspense>
  );
}

function GearPageFallback() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pt-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <GearCardSkeleton key={index} />
      ))}
    </div>
  );
}
