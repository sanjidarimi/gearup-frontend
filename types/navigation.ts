export type IconName =
  | "LayoutDashboard"
  | "ShoppingBag"
  | "CreditCard"
  | "Star"
  | "UserCircle"
  | "Package"
  | "PlusCircle"
  | "ClipboardList"
  | "Users"
  | "Tags"
  | "Boxes"
  | "Receipt";

export interface NavItem {
  title: string;
  href: string;
  icon: IconName;
  exact?: boolean;
}

export interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export interface DashboardNavigationConfig {
  title: string;
  subtitle: string;
  homeHref: string;
  navGroups: NavGroup[];
}
