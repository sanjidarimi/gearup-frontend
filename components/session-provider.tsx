"use client";

import type { IUserProfile } from "@/types/auth";
import { createContext, useContext } from "react";

const SessionContext = createContext<IUserProfile | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: IUserProfile | null;
  children: React.ReactNode;
}) {
  return <SessionContext value={user}>{children}</SessionContext>;
}

export function useSession() {
  return useContext(SessionContext);
}
