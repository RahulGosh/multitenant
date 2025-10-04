import { useQueryStates, parseAsString, parseAsArrayOf, parseAsStringLiteral } from "nuqs";

export const sortValues = [
  "curated",
  "trending",
  "hot_and_new",
  "price_asc",
  "price_desc",
] as const;

export type SortType = typeof sortValues[number];

const params = {
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),
    minPrice: parseAsString.withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
    maxPrice: parseAsString.withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
    tags: parseAsArrayOf(parseAsString)
    .withOptions({
      clearOnDefault: true
    })
    .withDefault([])
}

export const useProductFilters = () => {
  return useQueryStates(params);
};