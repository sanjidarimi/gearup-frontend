import { Navbar } from "@/components/navbar/navbar";
import { SessionProvider } from "@/components/session-provider";
import { Footer } from "@/components/shared/Footer";
import { getMe } from "@/services/get-me";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  return (
    <SessionProvider user={user}>
      <Navbar />
      <div className="min-h-[60vh]">{children}</div>
      <Footer />
    </SessionProvider>
  );
}
