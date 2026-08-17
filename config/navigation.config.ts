import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  Wrench,
  BarChart3,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { type DashboardNavigationConfig } from "@/types/navigation";

export const customerNavigation: DashboardNavigationConfig = {
  user: {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatarUrl: "/avatars/alex.png",
  },
  navGroups: [
    {
      groupLabel: "Overview",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        {
          title: "My Orders",
          href: "/dashboard/orders",
          icon: ShoppingCart,
          badge: 2,
        },
      ],
    },
    {
      groupLabel: "Account",
      items: [
        { title: "Settings", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ],
};

export const providerNavigation: DashboardNavigationConfig = {
  user: {
    name: "Sarah Miller",
    email: "sarah@provider.com",
    avatarUrl: "/avatars/sarah.png",
  },
  navGroups: [
    {
      groupLabel: "Management",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard/provider",
          icon: LayoutDashboard,
        },
        { title: "Gears", href: "/dashboard/provider/gears", icon: Wrench },
        {
          title: "Orders",
          href: "/dashboard/provider/orders",
          icon: Package,
          badge: 5,
        },
      ],
    },
    {
      groupLabel: "Analytics",
      items: [
        {
          title: "Performance",
          href: "/dashboard/provider/analytics",
          icon: BarChart3,
        },
      ],
    },
  ],
};

export const adminNavigation: DashboardNavigationConfig = {
  user: {
    name: "System Admin",
    email: "admin@platform.com",
  },
  navGroups: [
    {
      groupLabel: "Administration",
      items: [
        { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { title: "Users", href: "/dashboard/admin/users", icon: Users },
        {
          title: "Transactions",
          href: "/dashboard/admin/transactions",
          icon: CreditCard,
        },
      ],
    },
    {
      groupLabel: "System",
      items: [
        { title: "Audit Logs", href: "/dashboard/admin/logs", icon: FileText },
        {
          title: "Security",
          href: "/dashboard/admin/security",
          icon: ShieldCheck,
        },
      ],
    },
  ],
};
