"use client";

import { ModeToggle } from "@/components/shared/ModeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { findActiveNavItem } from "@/config/navigation.config";
import type { DashboardNavigationConfig } from "@/types/navigation";
import { Compass } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  config: DashboardNavigationConfig;
}

export function DashboardHeader({ config }: DashboardHeaderProps) {
  const pathname = usePathname();
  const activeItem = findActiveNavItem(config.navGroups, pathname);
  const isHome = !activeItem || activeItem.href === config.homeHref;

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className={isHome ? undefined : "hidden sm:block"}>
            {isHome ? (
              <BreadcrumbPage className="font-semibold">
                {config.title}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={config.homeHref}>{config.title}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!isHome && activeItem && (
            <>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {activeItem.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="hidden sm:inline-flex"
        >
          <Link href="/gear">
            <Compass />
            Browse gear
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
