import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { IUserProfile } from "@/types/auth";
import { type DashboardNavigationConfig } from "@/types/navigation";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

interface DashboardSidebarProps {
  config: DashboardNavigationConfig;
  user: IUserProfile;
}

export function DashboardSidebar({ config, user }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                  <Dumbbell className="size-4" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-extrabold">
                    Gear<span className="text-primary">Up</span>
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {config.subtitle}
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
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
