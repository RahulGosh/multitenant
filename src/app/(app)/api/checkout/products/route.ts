import { getPayloadClient, getSession, ApiError, createErrorResponse } from "@/lib/api";
import { Media, Tenant } from "@/payload-types";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { searchParams } = new URL(request.url);
    const productIds = searchParams.get("productIds")?.split(",") || [];

    if (productIds.length === 0) {
      return Response.json([]);
    }

    const payload = await getPayloadClient();

    const products = await payload.find({
      collection: "products",
      depth: 2,
      where: {
        id: {
          in: productIds,
        },
      },
      pagination: false,
    });

    return Response.json(
      products.docs.map((product) => ({
        ...product,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
      }))
    );
  } catch (error) {
    return createErrorResponse(error);
  }
}
