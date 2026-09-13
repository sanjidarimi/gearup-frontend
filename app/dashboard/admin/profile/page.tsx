import { ProfileView } from "@/components/dashboard/profile-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function AdminProfilePage() {
  return <ProfileView />;
}
