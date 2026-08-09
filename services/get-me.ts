"use server";
import { IUserProfile } from "@/types/auth";
import { cookies } from "next/headers";

export const getMe = async (): Promise<IUserProfile> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    throw new Error("user not found");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["my-profile"],
    },
  });

  const result = await res.json();
  return result.data;
};
