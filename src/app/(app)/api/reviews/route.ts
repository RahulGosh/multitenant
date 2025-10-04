import { getPayloadClient, getSession, ApiError, createErrorResponse } from "@/lib/api";
import { z } from "zod";

const createReviewSchema = z.object({
  productId: z.string(),
  rating: z
    .number()
    .min(1, { message: "Rating is required" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  description: z.string().min(1, { message: "Description is required" }),
});

const updateReviewSchema = z.object({
  reviewId: z.string(),
  rating: z
    .number()
    .min(1, { message: "Rating is required" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const body = await request.json();
    const input = createReviewSchema.parse(body);
    
    const payload = await getPayloadClient();

    const product = await payload.findByID({
      collection: "products",
      id: input.productId,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const existingReviewsData = await payload.find({
      collection: "reviews",
      limit: 1,
      pagination: false,
      where: {
        and: [
          { product: { equals: input.productId } },
          { user: { equals: session.user.id } },
        ],
      },
    });

    if (existingReviewsData.totalDocs > 0) {
      throw new ApiError(409, "You have already reviewed this product");
    }

    const review = await payload.create({
      collection: "reviews",
      data: {
        user: session.user.id,
        product: product.id,
        rating: input.rating,
        description: input.description,
      },
    });

    return Response.json(review);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const body = await request.json();
    const input = updateReviewSchema.parse(body);
    
    const payload = await getPayloadClient();

    const existingReview = await payload.findByID({
      collection: "reviews",
      id: input.reviewId,
    });

    if (!existingReview) {
      throw new ApiError(404, "Review not found");
    }

    if (existingReview.user !== session.user.id) {
      throw new ApiError(403, "You are not the owner of this review");
    }

    const review = await payload.update({
      collection: "reviews",
      id: input.reviewId,
      data: {
        rating: input.rating,
        description: input.description,
      },
    });

    return Response.json(review);
  } catch (error) {
    return createErrorResponse(error);
  }
}
