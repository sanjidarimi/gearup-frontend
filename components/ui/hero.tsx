import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl"
      >
        <div
          className="h-80 w-150 sm:w-225 bg-linear-to-tr from-primary/30 via-primary/10 to-transparent opacity-60 dark:opacity-40"
          style={{
            clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* TOP CONTENT: Centered Badge, Title, Subtitle & CTAs */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-primary shadow-sm backdrop-blur-xs mb-6">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Rent premium sports & outdoor gear instantly</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <Link
              href="/gear"
              className="font-semibold underline underline-offset-2 hover:opacity-80"
            >
              Explore Catalog &rarr;
            </Link>
          </div>

          {/* Main Heading */}
          <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Gear Up for Your Next <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-primary via-primary/80 to-chart-1 bg-clip-text text-transparent">
              Adventure Without Buying
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            Rent high-performance kayaks, mountain bikes, camping gear, and
            sports equipment directly from verified local providers. No
            long-term commitments.
          </p>

          {/* Call To Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/gear"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Gear</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/auth/register?role=PROVIDER"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/80 px-7 py-3.5 text-base font-semibold text-foreground shadow-sm hover:bg-muted transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="h-4 w-4 text-primary fill-primary" />
              <span>List Your Gear</span>
            </Link>
          </div>

          {/* Quick Value Props */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Verified Providers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>Flexible Daily Rentals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Instant Local Pickups</span>
            </div>
          </div>
        </div>

        {/* BOTTOM CONTENT: Large Product Showcase & App UI Visual */}
        <div className="mt-12 sm:mt-16 relative mx-auto max-w-5xl">
          {/* Main Frame Container */}
          <div className="relative rounded-2xl border border-border/80 bg-card p-2 sm:p-4 shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-xs">
            {/* Mock App Window Header */}
            <div className="mb-3 flex items-center justify-between px-2 sm:px-3 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-chart-1/60" />
                <div className="h-3 w-3 rounded-full bg-primary/60" />
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-1 text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">gearup.com/gear</span>
              </div>
              <div className="w-12" />
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/30">
              <Image
                src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop"
                alt="GearUp Rental Platform Dashboard Preview"
                fill
                priority
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 rounded-xl border border-border/80 bg-background/90 p-3 sm:p-4 shadow-lg backdrop-blur-md hidden xs:flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-medium text-muted-foreground">
                    Rental Reserved
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    Peak Performance Kayak
                  </span>
                </div>
              </div>

              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-xl border border-border/80 bg-background/90 p-2.5 sm:p-3 shadow-lg backdrop-blur-md flex items-center gap-2">
                <div className="flex items-center text-chart-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-xs font-bold text-foreground">
                    4.9
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  (1.2k+ Rentals)
                </span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 left-1/2 -z-10 h-10 w-[90%] -translate-x-1/2 rounded-[100%] bg-primary/20 blur-xl" />
        </div>
      </div>
    </section>
  );
}
