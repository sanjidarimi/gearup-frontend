import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { PackageX } from "lucide-react";
import Link from "next/link";

export default function GearNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24">
      <EmptyState
        icon={PackageX}
        title="This gear isn't available"
        description="The listing may have been removed by its provider, or the link is incorrect."
        action={
          <Button asChild size="lg">
            <Link href="/gear">Browse other gear</Link>
          </Button>
        }
      />
    </main>
  );
}
