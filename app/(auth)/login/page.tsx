import Image from "next/image";
import { Clock, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { LoginForm } from "../_components/login-from";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      <Suspense fallback={null}>
        <div className="flex flex-col justify-center py-12 lg:px-8">
          <LoginForm />
        </div>
      </Suspense>

      <div className="hidden lg:relative lg:flex flex-col justify-between p-12 overflow-hidden bg-muted/40 border-l border-border">
        <Image
          src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1974&auto=format&fit=crop"
          alt="Outdoor sports equipment"
          fill
          priority
          className="object-cover object-center opacity-25 dark:opacity-15"
        />

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-1 text-xs font-semibold text-foreground backdrop-blur-md">
            <Zap className="h-3.5 w-3.5 text-primary fill-primary" />
            <span>Instant Equipment Booking</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-md my-auto space-y-6">
          <div className="rounded-2xl border border-border/80 bg-background/80 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary font-bold">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Verified Local Owners
                </h3>
                <p className="text-xs text-muted-foreground">
                  Inspected and ready to use gear
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Log in to manage active rentals, extend booking dates, or review
              incoming requests for gear you own.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 backdrop-blur-xs">
              <Clock className="h-5 w-5 text-primary mb-2" />
              <h5 className="text-xs font-bold text-foreground">
                Flexible Pickups
              </h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Contactless or in-person delivery.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 backdrop-blur-xs">
              <ShieldAlert className="h-5 w-5 text-primary mb-2" />
              <h5 className="text-xs font-bold text-foreground">
                Secure Payments
              </h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Powered by Stripe.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} GearUp Inc.</span>
          <span>Rent Sports & Outdoor Gear Instantly</span>
        </div>
      </div>
    </div>
  );
}
