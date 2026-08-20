"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type NavGroup } from "@/types/navigation";
import { DynamicIcon } from "./dynamic-icon";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

interface NavMainProps {
  groups: NavGroup[];
}

export function NavMain({ groups }: NavMainProps) {
  const pathname = usePathname();

  return (
    <>
      {groups.map((group, idx) => (
        <SidebarGroup key={group.groupLabel ?? `group-${idx}`}>
          {group.groupLabel && (
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
          )}
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const hasSubItems = Boolean(item.items && item.items.length > 0);
              const isSubActive = item.items?.some(
                (sub) => sub.href === pathname,
              );

              if (hasSubItems) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isActive || isSubActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {/* Render icon via string key lookup */}
                          <DynamicIcon name={item.icon} />
                          <span className="flex-1 text-sm font-medium">
                            {item.title}
                          </span>
                          <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const isSubLinkActive = pathname === subItem.href;
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubLinkActive}
                                >
                                  <Link href={subItem.href}>
                                    <span>{subItem.title}</span>
                                    {subItem.badge !== undefined && (
                                      <SidebarMenuBadge className="ml-auto">
                                        {subItem.badge}
                                      </SidebarMenuBadge>
                                    )}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      {/* Render icon via string key lookup */}
                      <DynamicIcon name={item.icon} />
                      <span className="flex-1 text-sm font-medium">
                        {item.title}
                      </span>
                      {item.badge !== undefined && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
