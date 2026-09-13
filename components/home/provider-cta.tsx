import { SITE_IMAGES } from "@/lib/images";
import { ArrowRight, BadgeCheck, ClipboardList, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PERKS = [
  {
    icon: ClipboardList,
    title: "List in minutes",
    description: "Add photos, a daily price and stock. We handle the booking flow.",
  },
  {
    icon: BadgeCheck,
    title: "You stay in control",
    description: "Confirm each request and track pickups and returns in one table.",
  },
  {
    icon: Wallet,
    title: "Paid before pickup",
    description: "Customers pay through Stripe before the gear leaves your shop.",
  },
];

export function ProviderCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-2">
        <div className="relative min-h-72 lg:min-h-full">
          <Image
            src={SITE_IMAGES.ctaProvider}
            alt="Camping tent and hammock set up in the woods at golden hour"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-transparent to-card/20" />
        </div>

        <div className="p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            For rental shops
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Turn idle gear into steady income
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join GearUp as a provider and reach people looking for exactly the
            equipment sitting in your storeroom.
          </p>

          <ul className="mt-8 space-y-5">
            {PERKS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    {title}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/auth/register?role=PROVIDER"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
          >
            Become a provider
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
