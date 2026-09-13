import { getCategoryVisual } from "@/lib/images";
import { cn } from "@/lib/utils";
import { fetchCategories } from "@/services/gear-server";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function CategoryShowcase() {
  const categories = await fetchCategories();
  if (categories.length === 0) return null;

  const featured = categories.slice(0, 7);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Categories
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Find gear for every sport
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {categories.length} categories, from weekend camping kits to
            race-ready bikes.
          </p>
        </div>
        <Link
          href="/gear"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Browse all gear
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[190px] md:grid-cols-4">
        {featured.map((category, index) => (
          <Link
            key={category.id}
            href={`/gear?category=${encodeURIComponent(category.name)}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border bg-muted",
              index === 0 && "col-span-2 row-span-2",
            )}
          >
            <Image
              src={getCategoryVisual(category.name).cover}
              alt={category.name}
              fill
              sizes={
                index === 0
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 50vw, 25vw"
              }
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
              <span
                className={cn(
                  "font-bold text-white",
                  index === 0 ? "text-2xl" : "text-sm sm:text-base",
                )}
              >
                {category.name}
              </span>
              <span className="flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}

        <Link
          href="/gear"
          className="group flex flex-col justify-between rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
        >
          <span className="text-sm font-semibold text-primary">
            View everything
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Full catalog
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </section>
  );
}
