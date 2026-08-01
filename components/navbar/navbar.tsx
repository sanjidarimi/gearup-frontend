import { User } from '@/types/auth';
import { NavbarClient } from './navbar-client';


async function getCurrentUser(): Promise<User | null> {
  
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { headers });
  // return res.ok ? await res.json() : null;

  return null;
}

export async function Navbar() {
  const user = await getCurrentUser();

  async function handleLogout() {
    'use server';
    // Add server action logout logic (e.g., clear session cookies / invalidate JWT token)
  }

  return <NavbarClient user={user} onLogout={handleLogout} />;
}