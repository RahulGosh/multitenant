import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { dehydrate } from "@tanstack/react-query";
import ProductView, { ProductViewSkeleton } from "@/modules/products/ui/views/product-view";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

export const dynamic = "force-dynamic";

const ProductIdPage = async ({ params }: Props) => {
  const { productId, slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductIdPage;
