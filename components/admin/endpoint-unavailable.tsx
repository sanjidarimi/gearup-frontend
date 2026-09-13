import { EmptyState } from "@/components/shared/empty-state";
import { ServerCrash } from "lucide-react";

export function EndpointUnavailable({ endpoint }: { endpoint: string }) {
  return (
    <EmptyState
      icon={ServerCrash}
      title="This admin API isn't available"
      description={`The connected backend doesn't expose ${endpoint} yet. Once the admin routes are deployed, this view will fill in automatically.`}
    />
  );
}
