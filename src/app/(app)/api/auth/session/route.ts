import { getSession, createErrorResponse } from "@/lib/api";

export async function GET() {
  try {
    const session = await getSession();
    return Response.json(session);
  } catch (error) {
    return createErrorResponse(error);
  }
}
