import { GearCardSkeleton } from "@/components/gears/gear-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GearLoading() {
  return (
    <main className="px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <Skeleton className="h-44 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <Skeleton className="hidden h-96 rounded-2xl lg:block" />
          <div className="space-y-5 lg:col-span-3">
            <Skeleton className="h-11 w-full rounded-xl" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <GearCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
