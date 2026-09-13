import { Skeleton } from "@/components/ui/skeleton";

export default function GearDetailsLoading() {
  return (
    <main className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-4 w-60" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-7">
            <Skeleton className="aspect-4/3 w-full rounded-3xl" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-130 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
