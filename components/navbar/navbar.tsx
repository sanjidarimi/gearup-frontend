import { getMe } from "@/services/get-me";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const user = await getMe();

  return <NavbarClient user={user} />;
}
