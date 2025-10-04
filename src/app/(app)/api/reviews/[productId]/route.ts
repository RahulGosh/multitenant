import { getPayloadClient, getSession, ApiError, createErrorResponse } from "@/lib/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { productId } = await params;
    const payload = await getPayloadClient();

    const product = await payload.findByID({
      collection: "products",
      id: productId,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const reviewsData = await payload.find({
      collection: "reviews",
      limit: 1,
      pagination: false,
      where: {
        and: [
          { product: { equals: productId } },
          { user: { equals: session.user.id } },
        ],
      },
    });

    return Response.json(reviewsData.docs[0] ?? null);
  } catch (error) {
    return createErrorResponse(error);
  }
}
