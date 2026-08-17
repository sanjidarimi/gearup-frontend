import { type DashboardNavigationConfig } from "@/types/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./header";

interface DashboardShellProps {
  config: DashboardNavigationConfig;
  title?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({
  config,
  title,
  headerActions,
  children,
}: DashboardShellProps) {
  return (
    <SidebarProvider className="min-h-screen bg-background text-foreground">
      <DashboardSidebar config={config} />
      <SidebarInset className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title={title}>{headerActions}</DashboardHeader>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
