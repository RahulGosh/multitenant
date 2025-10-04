import { getPayloadClient, ApiError, createErrorResponse } from "@/lib/api";
import { generateAuthCookie } from "@/lib/utils";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = loginSchema.parse(body);
    
    const payload = await getPayloadClient();

    const data = await payload.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new ApiError(401, "Failed to login");
    }

    await generateAuthCookie({
      prefix: payload.config.cookiePrefix,
      value: data.token
    });

    return Response.json(data);
  } catch (error) {
    return createErrorResponse(error);
  }
}
