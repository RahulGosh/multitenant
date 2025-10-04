import { cookies as getCookies } from "next/headers";
import { createErrorResponse } from "@/lib/api";
import { AUTH_COOKIE } from "@/modules/auth/constants";

export async function POST() {
  try {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
    return Response.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
