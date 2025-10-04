import type { SearchParams } from "nuqs/server";
import React from "react";
import ProductListView from "@/modules/products/ui/views/product-list-view";

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;

  return <ProductListView category={category} />;
};

export default CategoryPage;
