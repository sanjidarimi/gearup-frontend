import { SITE_IMAGES } from "@/lib/images";
import {
  ArrowRight,
  CalendarCheck2,
  Clock,
  CreditCard,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";

const POPULAR_SEARCHES = ["Tent", "Kayak", "Mountain bike", "Ski"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-120 w-5xl -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary sm:text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Rent sports & outdoor gear instantly
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Gear up for your next adventure{" "}
            <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              without buying it.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
            Book kayaks, mountain bikes, tents and ski kits from verified local
            rental shops. Pick your dates, pay securely, and collect your gear.
          </p>

          <Form
            action="/gear"
            className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-black/5 lg:mx-0"
          >
            <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              name="search"
              type="search"
              aria-label="Search gear"
              placeholder="Search tents, bikes, kayaks…"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Search
            </button>
          </Form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs lg:justify-start">
            <span className="text-muted-foreground">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/gear?search=${encodeURIComponent(term)}`}
                className="rounded-full border border-border bg-background px-3 py-1 font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {term}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/gear"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Explore all gear
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/register?role=PROVIDER"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              List your gear
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Verified providers
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" /> Flexible daily rentals
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> Local pickup
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/10 sm:aspect-square lg:aspect-4/5">
            <Image
              src={SITE_IMAGES.hero}
              alt="A tent pitched on a mountain ridge at sunset"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="absolute -left-4 bottom-8 hidden items-center gap-3 rounded-2xl border border-border bg-background/95 p-3.5 shadow-xl backdrop-blur sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Booking confirmed</p>
              <p className="text-sm font-bold text-foreground">
                2-person tent · 3 days
              </p>
            </div>
          </div>

          <div className="absolute -right-4 top-8 hidden w-40 overflow-hidden rounded-2xl border border-border bg-background shadow-xl sm:block">
            <div className="relative aspect-4/3">
              <Image
                src="/images/categories/water-sports.jpg"
                alt="Surfer riding a wave"
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <p className="px-3 py-2 text-xs font-semibold text-foreground">
              Water sports gear
            </p>
          </div>

          <div className="absolute bottom-8 right-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md">
            <CreditCard className="h-4 w-4" />
            Secure checkout with Stripe
          </div>
        </div>
      </div>
    </section>
  );
}
