import { getPayloadClient, getSession, createErrorResponse } from "@/lib/api";
import { Media, Tenant } from "@/payload-types";
import { DEFAULT_LIMIT } from "@/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = parseInt(searchParams.get("cursor") || "1");
    const limit = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT));
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
    const sort = searchParams.get("sort") || "-createdAt";
    const tenantSlug = searchParams.get("tenantSlug") || "";

    const payload = await getPayloadClient();
    const session = await getSession();

    const where: any = {
      and: [
        minPrice > 0
          ? {
              price: {
                greater_than_equal: minPrice,
              },
            }
          : {},
        maxPrice < 999999
          ? {
              price: {
                less_than_equal: maxPrice,
              },
            }
          : {},
        search
          ? {
              name: {
                contains: search,
              },
            }
          : {},
        category
          ? {
              "category.slug": {
                equals: category,
              },
            }
          : {},
        subcategory
          ? {
              "subcategory.slug": {
                equals: subcategory,
              },
            }
          : {},
        tags.length > 0
          ? {
              tags: {
                in: tags,
              },
            }
          : {},
        tenantSlug
          ? {
              "tenant.slug": {
                equals: tenantSlug,
              },
            }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0),
    };

    const data = await payload.find({
      collection: "products",
      where,
      page: cursor,
      limit,
      depth: 2,
      sort,
    });

    const productIds = data.docs.map((doc) => doc.id);

    let purchasedProductIds: string[] = [];

    if (session?.user) {
      const ordersData = await payload.find({
        collection: "orders",
        pagination: false,
        where: {
          and: [
            {
              product: {
                in: productIds,
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

      purchasedProductIds = ordersData.docs.map((order) => order.product as string);
    }

    const dataWithSummarizedReviews = await Promise.all(
      data.docs.map(async (doc) => {
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
          isPurchased: purchasedProductIds.includes(doc.id),
          reviewRating,
          reviewCount,
        };
      })
    );

    return Response.json({
      ...data,
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
