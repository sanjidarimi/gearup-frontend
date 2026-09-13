import { SITE_IMAGES } from "@/lib/images";
import { ShieldCheck, Store } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShowcase } from "../_components/auth-showcase";
import { RegisterForm } from "../_components/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Join GearUp as a customer or rental provider.",
};

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <AuthShowcase
        image={SITE_IMAGES.authRegister}
        imageAlt="Two hikers with backpacks walking a mountain trail"
        eyebrow="Join the GearUp community"
        title="Adventure is better when you don't have to buy everything."
        description="Create a free account to rent from local shops, or list your own equipment and start earning."
        highlights={[
          {
            icon: ShieldCheck,
            title: "Verified shops",
            description: "Every provider manages real, inspected inventory.",
          },
          {
            icon: Store,
            title: "Built for providers",
            description: "Inventory, orders and status updates in one place.",
          },
        ]}
      />

      <div className="flex flex-col justify-center py-12 lg:px-8">
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
