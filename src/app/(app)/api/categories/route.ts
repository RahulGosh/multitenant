import { getPayloadClient, createErrorResponse } from "@/lib/api";
import { CustomCategory } from "@/app/(app)/(home)/types";
import { Category } from "@/payload-types";

export async function GET() {
  try {
    const payload = await getPayloadClient();
    
    const data = await payload.find({
      collection: "categories",
      depth: 1,
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formattedData: CustomCategory[] = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category),
      })),
    }));
    
    return Response.json(formattedData);
  } catch (error) {
    return createErrorResponse(error);
  }
}
