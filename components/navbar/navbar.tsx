import { getMe } from "@/services/get-me";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  let user = null;
  try {
    user = await getMe();
  } catch {
    user = null;
  }

  async function handleLogout() {
    "use server";
  }

  return <NavbarClient user={user} onLogout={handleLogout} />;
}
