"use client";

import React from "react";
import { useProductFilters } from "../../hooks/use-product-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sortValues } from "../../search-params";

type SortType = typeof sortValues[number]; // union of all sort values

const ProductSort = () => {
  const [filters, setFilters] = useProductFilters();

  const handleSortChange = (value: SortType) => {
    console.log(">>> ProductSort clicked:", value);
    setFilters({ ...filters, sort: value });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "curated" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => handleSortChange("curated")}
      >
        Curated
      </Button>

      <Button
        size="sm"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "trending" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => handleSortChange("trending")}
      >
        Trending
      </Button>

      <Button
        size="sm"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "hot_and_new" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => handleSortChange("hot_and_new")}
      >
        Hot & New
      </Button>

      {/* Example extra sort buttons */}
      <Button
        size="sm"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "price_asc" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => handleSortChange("price_asc")}
      >
        Price ↑
      </Button>

      <Button
        size="sm"
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "price_desc" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => handleSortChange("price_desc")}
      >
        Price ↓
      </Button>
    </div>
  );
};

export default ProductSort;
