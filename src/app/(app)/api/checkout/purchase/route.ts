import { getPayloadClient, getSession, ApiError, createErrorResponse } from "@/lib/api";
import { Media, Tenant } from "@/payload-types";
import { z } from "zod";
import Stripe from "stripe";
import { ChecckoutMetadata, ProductMetadata } from "@/modules/checkout/types";
import { stripe } from "@/lib/stripe";

const purchaseSchema = z.object({
  productIds: z.array(z.string()).min(1),
  tenantSlug: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const body = await request.json();
    const input = purchaseSchema.parse(body);
    
    const payload = await getPayloadClient();

    const products = await payload.find({
      collection: "products",
      depth: 2,
      where: {
        and: [
          {
            id: {
              in: input.productIds,
            },
          },
          {
            "tenant.slug": {
              equals: input.tenantSlug,
            },
          },
        ],
      },
    });

    if (products.totalDocs !== input.productIds.length) {
      throw new ApiError(404, "Products not found");
    }

    const tenantsData = await payload.find({
      collection: "tenants",
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: input.tenantSlug,
        },
      },
    });

    const tenant = tenantsData.docs[0];

    if (!tenant) {
      throw new ApiError(404, "Tenant not found");
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      products.docs.map((product) => ({
        quantity: 1,
        price_data: {
          unit_amount: product.price * 100,
          currency: "usd",
          product_data: {
            name: product.name,
            metadata: {
              stripeAccountId: tenant.stripeAccountId,
              id: product.id,
              name: product.name,
              price: product.price,
            } as ProductMetadata,
          },
        },
      }));

    const checkout = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
      invoice_creation: {
        enabled: true,
      },
      metadata: {
        tenantId: tenant.id,
        userId: session.user.id,
        productIds: input.productIds.join(","),
      } as ChecckoutMetadata,
    });

    return Response.json({ url: checkout.url });
  } catch (error) {
    return createErrorResponse(error);
  }
}
