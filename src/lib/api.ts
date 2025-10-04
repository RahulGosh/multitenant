import { getPayload } from "payload";
import config from "@payload-config";
import { headers as getHeaders } from "next/headers";
import { cache } from "react";

export const getPayloadClient = cache(async () => {
  return await getPayload({ config });
});

export const getSession = cache(async () => {
  const payload = await getPayloadClient();
  const headers = await getHeaders();
  const session = await payload.auth({ headers });
  return session;
});

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  console.error("Unexpected error:", error);
  return Response.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
