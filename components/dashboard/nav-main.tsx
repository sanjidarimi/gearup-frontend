"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { findActiveNavItem } from "@/config/navigation.config";
import { type NavGroup } from "@/types/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicIcon } from "./dynamic-icon";

interface NavMainProps {
  groups: NavGroup[];
}

export function NavMain({ groups }: NavMainProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const activeHref = findActiveNavItem(groups, pathname)?.href;

  return (
    <>
      {groups.map((group, index) => (
        <SidebarGroup key={group.groupLabel ?? `group-${index}`}>
          {group.groupLabel && (
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
          )}
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={item.href === activeHref}
                  tooltip={item.title}
                >
                  <Link
                    href={item.href}
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <DynamicIcon name={item.icon} />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
