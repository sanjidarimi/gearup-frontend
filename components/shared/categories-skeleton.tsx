export function CategoriesSkeleton() {
  return (
    <div className="space-y-3 container mx-auto">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex h-16 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-3"
          >
            <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
            <div className="h-2.5 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
