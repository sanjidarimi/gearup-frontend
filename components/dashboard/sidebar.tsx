import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type DashboardNavigationConfig } from "@/types/navigation";
import { Dumbbell } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Link from "next/link";

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
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    Gear Up
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Enterprise
                  </span>
                </div>
              </Link>
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
