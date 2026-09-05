export type IconName =
  | "LayoutDashboard"
  | "ShoppingCart"
  | "Settings"
  | "Package"
  | "Wrench"
  | "BarChart3"
  | "Users"
  | "CreditCard"
  | "FileText"
  | "ShieldCheck"
  | "ChartColumnStacked";

export interface NavSubItem {
  title: string;
  href: string;
  badge?: string | number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: IconName;
  badge?: string | number;
  items?: NavSubItem[];
}

export interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface DashboardNavigationConfig {
  user: UserProfile;
  navGroups: NavGroup[];
}
