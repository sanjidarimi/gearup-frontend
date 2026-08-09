import { getMe } from "@/services/get-me";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  let user = null;
  try {
    user = await getMe();
  } catch {
    user = null;
  }

  return <NavbarClient user={user} />;
}
