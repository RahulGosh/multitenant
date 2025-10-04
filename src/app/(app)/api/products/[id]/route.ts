import { getPayloadClient, getSession, createErrorResponse } from "@/lib/api";
import { Media, Tenant } from "@/payload-types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayloadClient();
    const session = await getSession();

    const product = await payload.findByID({
      collection: "products",
      id,
      depth: 2,
    });

    let isPurchased = false;

    if (session?.user) {
      const ordersData = await payload.find({
        collection: "orders",
        pagination: false,
        limit: 1,
        where: {
          and: [
            { product: { equals: id } },
            { user: { equals: session.user.id } },
          ],
        },
      });

      isPurchased = ordersData.docs.length > 0;
    }

    const reviews = await payload.find({
      collection: "reviews",
      pagination: false,
      where: {
        product: { equals: id },
      },
    });

    const reviewCount = reviews.totalDocs;
    const reviewRating =
      reviewCount > 0
        ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) /
          reviewCount
        : 0;

    const ratingDistribution: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    if (reviewCount > 0) {
      reviews.docs.forEach((review) => {
        const rating = review.rating;
        if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating] =
            (ratingDistribution[rating] || 0) + 1;
        }
      });

      Object.keys(ratingDistribution).forEach((key) => {
        const rating = Number(key);
        const count = ratingDistribution[rating] || 0;
        ratingDistribution[rating] = Math.round(
          (count / reviewCount) * 100
        );
      });
    }

    return Response.json({
      ...product,
      isPurchased,
      image: product.image as Media | null,
      cover: product.cover as Media | null,
      tenant: product.tenant as Tenant & { image: Media | null },
      reviewRating,
      reviewCount,
      ratingDistribution,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
