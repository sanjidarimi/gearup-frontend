import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface DashboardHeaderProps {
  title?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  title = "Dashboard",
  children,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/95 px-4 backdrop-blur transition-all duration-200 ease-in-out">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 cursor-pointer text-foreground" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-border" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                {title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
