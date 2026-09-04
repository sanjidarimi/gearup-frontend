// app/gear/page.tsx
import { Suspense } from "react";
import { GearPageContent } from "./gear-content";

export default function GearPage() {
  return (
    <Suspense>
      <GearPageContent />
    </Suspense>
  );
}


