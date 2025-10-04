import React from "react";
import ProductView from "@/modules/library/ui/views/product-view";

interface Props {
  params: { productId: string };
}

const ProductIdPage = async ({ params }: Props) => {
  const { productId } = params;
  
  return <ProductView productId={productId} />;
};

export default ProductIdPage;
