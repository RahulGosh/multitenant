import LibraryView from "@/modules/library/ui/views/library-view";

interface Props {
  params: { productId?: string };
}

const LibraryPage = async ({ params }: Props) => {
  const { productId } = params;

  return <LibraryView productId={productId} />;
};

export default LibraryPage;
