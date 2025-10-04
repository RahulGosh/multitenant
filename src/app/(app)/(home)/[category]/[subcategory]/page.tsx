import ProductListView from "@/modules/products/ui/views/product-list-view";
import { SearchParams } from "nuqs/server";
import React from "react";

interface Props {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const SubcategoryPage = async ({ params }: Props) => {
  const { subcategory } = await params;

  return <ProductListView category={subcategory} />;
};

export default SubcategoryPage;
