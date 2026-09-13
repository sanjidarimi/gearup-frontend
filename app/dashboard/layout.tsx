import { SessionProvider } from "@/components/session-provider";
import { requireUser } from "@/lib/auth-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return <SessionProvider user={user}>{children}</SessionProvider>;
}
