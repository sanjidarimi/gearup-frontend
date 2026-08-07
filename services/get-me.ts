"use server";
import { cookies } from "next/headers";
import { User } from "@/types/auth";

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    throw new Error("user not found");
  }
  const res = await fetch(`${process.env.BACKEND_API_URL}/auth/get-me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await res.json();
  return result.data;
};
