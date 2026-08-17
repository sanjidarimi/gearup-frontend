import { Command } from "lucide-react";
import { type DashboardNavigationConfig } from "@/types/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

interface DashboardSidebarProps {
  config: DashboardNavigationConfig;
}

export function DashboardSidebar({ config }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    Acme Corp
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Enterprise
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain groups={config.navGroups} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={config.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
