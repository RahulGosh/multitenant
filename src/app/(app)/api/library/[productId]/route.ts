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

    const ordersData = await payload.find({
      collection: "orders",
      limit: 1,
      pagination: false,
      where: {
        and: [
          {
            product: {
              equals: productId,
            },
          },
          {
            user: {
              equals: session.user.id,
            },
          },
        ],
      },
    });

    const order = ordersData.docs[0];

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    const product = await payload.findByID({
      collection: "products",
      id: productId,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return Response.json(product);
  } catch (error) {
    return createErrorResponse(error);
  }
}
