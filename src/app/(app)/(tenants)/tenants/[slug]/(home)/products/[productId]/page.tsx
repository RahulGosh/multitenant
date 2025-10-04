import React from "react";
import ProductView from "@/modules/products/ui/views/product-view";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

const ProductIdPage = async ({ params }: Props) => {
  const { productId, slug } = await params;
  
  return <ProductView productId={productId} tenantSlug={slug} />;
};

export default ProductIdPage;
