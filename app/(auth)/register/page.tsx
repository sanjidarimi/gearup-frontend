import { Flame, ShieldCheck, Star, Users } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { RegisterForm } from "../_components/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      <div className="hidden lg:relative lg:flex flex-col justify-between p-12 overflow-hidden bg-muted/40 border-l border-border">
        {/* Background Overlay Image */}
        <Image
          src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1974&auto=format&fit=crop"
          alt="Outdoor camping gear"
          fill
          priority
          className="object-cover object-center opacity-25 dark:opacity-15"
        />

        {/* Top Tagline Badge */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-1 text-xs font-semibold text-foreground backdrop-blur-md">
            <Flame className="h-3.5 w-3.5 text-primary fill-primary" />
            <span>Join 10,000+ Sports Enthusiasts</span>
          </div>
        </div>

        {/* Center Feature Card Overlay */}
        <div className="relative z-10 mx-auto max-w-md my-auto space-y-6">
          <div className="rounded-2xl border border-border/80 bg-background/80 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-1 text-chart-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-base font-medium text-foreground italic leading-relaxed">
              &ldquo;GearUp made it so easy to rent a carbon mountain bike for
              my weekend trip. Saved me over $2,000!&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
                JD
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Jordan Davies
                </h4>
                <p className="text-xs text-muted-foreground">
                  Outdoor Enthusiast
                </p>
              </div>
            </div>
          </div>

          {/* Value Props Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 backdrop-blur-xs">
              <ShieldCheck className="h-5 w-5 text-primary mb-2" />
              <h5 className="text-xs font-bold text-foreground">
                100% Insured
              </h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Protected gear for total peace of mind.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 backdrop-blur-xs">
              <Users className="h-5 w-5 text-primary mb-2" />
              <h5 className="text-xs font-bold text-foreground">
                Verified Shop Owners
              </h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Top-tier local equipment providers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} GearUp Inc.</span>
          <span>Rent Sports & Outdoor Gear Instantly</span>
        </div>
      </div>
      <div className="flex flex-col justify-center py-12 lg:px-8">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
