"use server"
import { cookies } from "next/headers";

export const getMe = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    throw new Error("user not found");
  }
  const res = await fetch(`${process.env.BACKEND_API_URL}/auth/get-me`, {
    headers: {
      // Authorization : accessToken as unknown as string => way 1
      // Authorization : `${accessToken}` => way 2
      Cookies: `accessToken=${accessToken}`,
    },
  });
  const result = await res.json();
  return result;
};
