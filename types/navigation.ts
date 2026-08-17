import { type LucideIcon } from "lucide-react";

export interface NavSubItem {
  title: string;
  href: string;
  badge?: string | number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
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
