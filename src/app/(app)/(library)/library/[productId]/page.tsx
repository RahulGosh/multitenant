import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { dehydrate } from "@tanstack/react-query";
import ProductView, {
  ProductViewSkeleton,
} from "@/modules/library/ui/views/product-view";

interface Props {
  params: { productId: string }; // ✅ correct
}

const ProductIdPage = async ({ params }: Props) => {
  const { productId } = params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductIdPage;
