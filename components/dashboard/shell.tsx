import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { IUserProfile } from "@/types/auth";
import { type DashboardNavigationConfig } from "@/types/navigation";
import { DashboardHeader } from "./header";
import { DashboardSidebar } from "./sidebar";

interface DashboardShellProps {
  config: DashboardNavigationConfig;
  user: IUserProfile;
  children: React.ReactNode;
}

export function DashboardShell({ config, user, children }: DashboardShellProps) {
  return (
    <SidebarProvider className="min-h-screen bg-background text-foreground">
      <DashboardSidebar config={config} user={user} />
      <SidebarInset className="min-w-0">
        <DashboardHeader config={config} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
