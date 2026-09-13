import { type IconName } from "@/types/navigation";
import {
  Boxes,
  ClipboardList,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  Package,
  PlusCircle,
  Receipt,
  ShoppingBag,
  Star,
  Tags,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<IconName, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Star,
  UserCircle,
  Package,
  PlusCircle,
  ClipboardList,
  Users,
  Tags,
  Boxes,
  Receipt,
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
