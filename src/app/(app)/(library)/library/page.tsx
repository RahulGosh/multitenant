import { DEFAULT_LIMIT } from "@/constants";
import LibraryView from "@/modules/library/ui/views/library-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = "force-dynamic"

interface Props {
  params: { productId?: string }; // ✅ make optional
}

const LibraryPage = async ({ params }: Props) => {
  const { productId } = params;
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  if (productId) {
    void queryClient.prefetchQuery(
      trpc.reviews.getOne.queryOptions({ productId })
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView productId={productId} />
    </HydrationBoundary>
  );
};

export default LibraryPage;
