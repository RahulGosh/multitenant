import { getPayloadClient, ApiError, createErrorResponse } from "@/lib/api";
import { registerSchema } from "@/modules/auth/schemas";
import { generateAuthCookie } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registerSchema.parse(body);
    
    const payload = await getPayloadClient();

    const existingData = await payload.find({
      collection: "users",
      limit: 1,
      where: {
        username: {
          equals: input.username
        }
      }
    });

    const existingUser = existingData.docs[0];

    if (existingUser) {
      throw new ApiError(400, "Username already taken");
    }

    const tenant = await payload.create({
      collection: "tenants",
      data: {
        name: input.username,
        slug: input.username,
        stripeAccountId: "test"
      }
    });

    await payload.create({
      collection: "users",
      data: {
        email: input.email,
        username: input.username,
        password: input.password,
        tenants: [
          {
            tenant: tenant.id
          }
        ]
      },
    });

    const data = await payload.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new ApiError(401, "Failed to register");
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
