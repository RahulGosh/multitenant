import { getPayloadClient, createErrorResponse } from "@/lib/api";
import { DEFAULT_LIMIT } from "@/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = parseInt(searchParams.get("cursor") || "1");
    const limit = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT));

    const payload = await getPayloadClient();
    
    const data = await payload.find({
      collection: "tags",
      page: cursor,
      limit,
    });

    return Response.json(data);
  } catch (error) {
    return createErrorResponse(error);
  }
}
