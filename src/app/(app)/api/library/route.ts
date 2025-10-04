import { getPayloadClient, getSession, ApiError, createErrorResponse } from "@/lib/api";
import { Media, Order, Product, Tenant } from "@/payload-types";
import { DEFAULT_LIMIT } from "@/constants";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { searchParams } = new URL(request.url);
    const cursor = parseInt(searchParams.get("cursor") || "1");
    const limit = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT));

    const payload = await getPayloadClient();

    const ordersData = await payload.find({
      collection: "orders",
      depth: 0,
      page: cursor,
      limit,
      where: {
        user: {
          equals: session.user.id,
        },
      },
    });

    const productIds = ordersData.docs.map((order: Order) => order.product);

    const productsData = await payload.find({
      collection: "products",
      pagination: false,
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const dataWithSummarizedReviews = await Promise.all(
      productsData.docs.map(async (doc: Product) => {
        const reviewsData = await payload.find({
          collection: "reviews",
          pagination: false,
          where: { product: { equals: doc.id } },
        });

        const reviewCount = reviewsData.totalDocs;
        const reviewRating =
          reviewCount > 0
            ? reviewsData.docs.reduce(
                (acc, review) => acc + review.rating,
                0
              ) / reviewCount
            : 0;

        return {
          ...doc,
          reviewRating,
          reviewCount,
        };
      })
    );

    return Response.json({
      ...ordersData,
      docs: dataWithSummarizedReviews.map((doc) => ({
        ...doc,
        image: doc.image as Media | null,
        tenant: doc.tenant as Tenant & { image: Media | null },
      })),
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
