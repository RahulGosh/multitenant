export type CategoriesGetManyOutput = Array<{
  id: string;
  name: string;
  slug: string;
  color?: string;
  subcategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}>;
