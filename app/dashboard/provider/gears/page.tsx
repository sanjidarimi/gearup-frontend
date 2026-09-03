import { AddGearModal } from "@/components/gears/add-gear-modal";
import { GearTable } from "@/components/gears/gear-table";

export default function ProviderGearsPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gear Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage your sports and camping equipment rentals.
          </p>
        </div>
        <AddGearModal />
      </div>

      <GearTable />
    </div>
  );
}
