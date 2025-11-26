import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import { dehydrate } from "@tanstack/react-query";
import ProductView from "@/modules/library/ui/views/product-view";

interface Props {
  params: { productId: string }; // ✅ correct
}

const ProductIdPage = async ({ params }: Props) => {
  const { productId } = params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
        productId
    })
  );
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} />
    </HydrationBoundary>
  );
};

export default ProductIdPage;
