import type {
  DashboardNavigationConfig,
  NavGroup,
  NavItem,
} from "@/types/navigation";

export const customerNavigation: DashboardNavigationConfig = {
  title: "Customer Dashboard",
  subtitle: "Renter account",
  homeHref: "/dashboard/customer",
  navGroups: [
    {
      groupLabel: "Rentals",
      items: [
        {
          title: "Overview",
          href: "/dashboard/customer",
          icon: "LayoutDashboard",
          exact: true,
        },
        {
          title: "My Rentals",
          href: "/dashboard/customer/orders",
          icon: "ShoppingBag",
        },
        {
          title: "Payments",
          href: "/dashboard/customer/payments",
          icon: "CreditCard",
        },
        {
          title: "Reviews",
          href: "/dashboard/customer/reviews",
          icon: "Star",
        },
      ],
    },
    {
      groupLabel: "Account",
      items: [
        {
          title: "Profile",
          href: "/dashboard/customer/profile",
          icon: "UserCircle",
        },
      ],
    },
  ],
};

export const providerNavigation: DashboardNavigationConfig = {
  title: "Provider Hub",
  subtitle: "Rental shop",
  homeHref: "/dashboard/provider",
  navGroups: [
    {
      groupLabel: "Inventory",
      items: [
        {
          title: "Overview",
          href: "/dashboard/provider",
          icon: "LayoutDashboard",
          exact: true,
        },
        {
          title: "My Gear",
          href: "/dashboard/provider/gear",
          icon: "Package",
        },
        {
          title: "Add Gear",
          href: "/dashboard/provider/gear/new",
          icon: "PlusCircle",
          exact: true,
        },
        {
          title: "Orders",
          href: "/dashboard/provider/orders",
          icon: "ClipboardList",
        },
      ],
    },
    {
      groupLabel: "Account",
      items: [
        {
          title: "Profile",
          href: "/dashboard/provider/profile",
          icon: "UserCircle",
        },
      ],
    },
  ],
};

export const adminNavigation: DashboardNavigationConfig = {
  title: "Admin Console",
  subtitle: "Platform moderation",
  homeHref: "/dashboard/admin",
  navGroups: [
    {
      items: [
        {
          title: "Overview",
          href: "/dashboard/admin",
          icon: "LayoutDashboard",
          exact: true,
        },
      ],
    },
    {
      groupLabel: "Management",
      items: [
        { title: "Users", href: "/dashboard/admin/users", icon: "Users" },
        { title: "Gear", href: "/dashboard/admin/gear", icon: "Boxes" },
        { title: "Rentals", href: "/dashboard/admin/orders", icon: "Receipt" },
        {
          title: "Categories",
          href: "/dashboard/admin/categories",
          icon: "Tags",
        },
      ],
    },
    {
      groupLabel: "Account",
      items: [
        {
          title: "Profile",
          href: "/dashboard/admin/profile",
          icon: "UserCircle",
        },
      ],
    },
  ],
};

// Picks the most specific nav item for the current path, so nested pages
// like /dashboard/provider/gear/new highlight "Add Gear" rather than "My Gear".
export function findActiveNavItem(groups: NavGroup[], pathname: string) {
  let match: NavItem | undefined;

  for (const group of groups) {
    for (const item of group.items) {
      const isMatch = item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);

      if (isMatch && (!match || item.href.length > match.href.length)) {
        match = item;
      }
    }
  }

  return match;
}
