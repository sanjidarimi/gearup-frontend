import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[190px] md:grid-cols-4">
        <Skeleton className="col-span-2 row-span-2 rounded-2xl" />
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="rounded-2xl" />
        ))}
      </div>
    </section>
  );
}
