export type ProductsGetManyOutput = {
  docs: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: {
      url: string;
    };
    category?: string;
    tags?: string[];
    rating?: number;
    reviewCount?: number;
  }>;
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};
