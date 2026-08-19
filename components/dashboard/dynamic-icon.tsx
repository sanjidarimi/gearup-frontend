// src/components/dashboard/dynamic-icon.tsx
import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  Package,
  Wrench,
  BarChart3,
  Users,
  CreditCard,
  FileText,
  ShieldCheck,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { type IconName } from "@/types/navigation";

const iconMap: Record<IconName, LucideIcon> = {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  Package,
  Wrench,
  BarChart3,
  Users,
  CreditCard,
  FileText,
  ShieldCheck,
};

interface DynamicIconProps {
  name: IconName;
  className?: string;
}

export function DynamicIcon({
  name,
  className = "size-4 shrink-0",
}: DynamicIconProps) {
  const IconComponent = iconMap[name] ?? HelpCircle;
  return <IconComponent className={className} />;
}
