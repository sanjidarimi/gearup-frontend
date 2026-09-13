import { SITE_IMAGES } from "@/lib/images";
import { CalendarCheck2, CreditCard } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShowcase } from "../_components/auth-showcase";
import { LoginForm } from "../_components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your GearUp account.",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div className="flex flex-col justify-center py-12 lg:px-8">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>

      <AuthShowcase
        image={SITE_IMAGES.authLogin}
        imageAlt="Hiker standing on a rocky ridge above the clouds"
        eyebrow="Instant equipment booking"
        title="Your next summit starts with the right gear."
        description="Pick up where you left off: track rentals, pay for confirmed bookings or update your inventory."
        highlights={[
          {
            icon: CalendarCheck2,
            title: "Flexible dates",
            description: "Book by the day, return when you're done.",
          },
          {
            icon: CreditCard,
            title: "Secure payments",
            description: "Checkout is handled by Stripe.",
          },
        ]}
      />
    </div>
  );
}
