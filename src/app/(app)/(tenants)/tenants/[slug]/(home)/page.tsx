import ProductListView from "@/modules/products/ui/views/product-list-view";
import { SearchParams } from "nuqs/server";
import React from "react";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  return <ProductListView tenantSlug={slug} narrowView />;
};

export default Page;
