import { GearGallery, type GalleryImage } from "@/components/gears/gear-gallery";
import { GearReviews } from "@/components/gears/gear-reviews";
import { RentalBookingCard } from "@/components/rental/rental-booking-card";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate, shortId } from "@/lib/format";
import { getCategoryVisual } from "@/lib/images";
import { fetchCategories, fetchGearById } from "@/services/gear-server";
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  Handshake,
  ShieldCheck,
  Store,
  Tag,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface GearDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}

export async function generateMetadata({
  params,
}: GearDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const gear = await fetchGearById(id);

  if (!gear) return { title: "Gear not found" };

  return {
    title: gear.name,
    description:
      gear.description?.slice(0, 155) ??
      `Rent ${gear.name} for ${formatCurrency(gear.pricePerDay)} per day on GearUp.`,
  };
}

export default async function GearDetailsPage({
  params,
  searchParams,
}: GearDetailsPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [gear, categories] = await Promise.all([
    fetchGearById(id),
    fetchCategories(),
  ]);

  if (!gear) notFound();

  const categoryName =
    gear.category?.name ??
    categories.find((category) => category.id === gear.categoryId)?.name ??
    null;
  const isAvailable = gear.isAvailable && gear.stock > 0;

  const galleryImages: GalleryImage[] = [
    { src: gear.imageUrl, alt: gear.name, isProductPhoto: true },
    ...getCategoryVisual(categoryName)
      .gallery.slice(0, 3)
      .map((src) => ({
        src,
        alt: `${categoryName ?? "Outdoor"} gear in action`,
        isProductPhoto: false,
      })),
  ];

  const specifications = [
    { label: "Brand", value: gear.brand || "Independent brand" },
    { label: "Category", value: categoryName ?? "Uncategorised" },
    { label: "Daily rate", value: formatCurrency(gear.pricePerDay) },
    { label: "Units in stock", value: String(gear.stock) },
    { label: "Listed on", value: formatDate(gear.createdAt) },
    { label: "Last updated", value: formatDate(gear.updatedAt) },
    { label: "Reference", value: shortId(gear.id) },
  ];

  return (
    <main className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href="/gear" className="transition-colors hover:text-foreground">
            Gear
          </Link>
          {categoryName && (
            <>
              <ChevronRight className="size-3.5" />
              <Link
                href={`/gear?category=${encodeURIComponent(categoryName)}`}
                className="transition-colors hover:text-foreground"
              >
                {categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="size-3.5" />
          <span className="truncate text-foreground">{gear.name}</span>
        </nav>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Tag className="size-3" />
              {gear.brand || "Independent brand"}
            </span>
            <AvailabilityBadge available={isAvailable} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {gear.name}
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <GearGallery images={galleryImages} category={categoryName} />
          </div>

          <aside className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <div className="lg:sticky lg:top-28">
              <RentalBookingCard
                gear={gear}
                initialFrom={query.from}
                initialTo={query.to}
              />
            </div>
          </aside>

          <div className="space-y-10 lg:col-span-7">
            <section aria-labelledby="about-heading" className="space-y-3">
              <h2 id="about-heading" className="text-xl font-bold text-foreground">
                About this gear
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {gear.description?.trim() ||
                  "The provider hasn't added a description yet. Reach out after booking if you have questions about sizing or condition."}
              </p>
            </section>

            <section aria-labelledby="specs-heading" className="space-y-3">
              <h2 id="specs-heading" className="text-xl font-bold text-foreground">
                Specifications
              </h2>
              <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid grid-cols-2 gap-4 px-5 py-3 text-sm"
                  >
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="text-right font-medium text-foreground">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="provider-heading" className="space-y-3">
              <h2 id="provider-heading" className="text-xl font-bold text-foreground">
                Provider
              </h2>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Store className="size-6" />
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 font-semibold text-foreground">
                      {gear.provider?.name ?? "GearUp rental partner"}
                      <BadgeCheck className="size-4 text-primary" />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Verified provider
                      {gear.providerId && ` · ID ${shortId(gear.providerId)}`}
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Clock, text: "Reviews each request personally" },
                    { icon: Handshake, text: "In-person pickup and return" },
                    { icon: ShieldCheck, text: "Paid securely via Stripe" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground"
                    >
                      <Icon className="size-4 shrink-0 text-primary" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <GearReviews gearId={gear.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
