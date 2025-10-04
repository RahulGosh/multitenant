import { getPayloadClient, ApiError, createErrorResponse } from "@/lib/api";
import { Media, Tenant } from "@/payload-types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const payload = await getPayloadClient();

    const tenantsData = await payload.find({
      collection: "tenants",
      depth: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      pagination: false
    });

    const tenant = tenantsData.docs[0];

    if (!tenant) {
      throw new ApiError(404, "Tenant not found");
    }

    return Response.json(tenant as Tenant & { image: Media | null });
  } catch (error) {
    return createErrorResponse(error);
  }
}
