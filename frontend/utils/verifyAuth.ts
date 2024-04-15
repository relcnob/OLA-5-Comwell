import { getCookie, getCookies, setCookie } from "cookies-next";
import "dotenv/config";

export default async function verifyAuth(endpoint: string) {
  // const token = await ;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BE_HOST}/auth/${endpoint}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token_fe")}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    return { isAuthenticated: false, userData: null };
  }

  const userData = await response.json();
  // The token is valid, and userData contains information about the authenticated user
  return { isAuthenticated: true, userData };
}
