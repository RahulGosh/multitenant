"use client";

import React, { useEffect } from "react";
import { useCart } from "../../hooks/use-cart";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateTenantUrl } from "@/lib/utils";
import CheckoutItem from "../components/checkout-item";
import CheckoutSidebar from "../components/checkout-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";

interface CheckoutViewProps {
  tenantSlug: string;
}

const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const router = useRouter()
  const [states, setStates] = useCheckoutStates()
  const { productIds, clearAllCarts, removeproduct, clearCart } = useCart(tenantSlug);

  const trpc = useTRPC();
  const queryClient = useQueryClient()
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  const purchase = useMutation(trpc.checkout.purchase.mutationOptions({
    onMutate: () => {
      setStates({success: false, cancel: false})
    },
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: (error) => {
      if(error.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in")
      }
      toast.error(error.message)
    },
  }));

  useEffect(() => {
    if(states.success) {
      setStates({success: false, cancel: false})
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter())
      router.push("/library")
    }
  }, [states.success, clearCart, router, setStates, queryClient, trpc.library.getMany])
  

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning("Invalid products found, cart cleared");
    }
  }, [error, clearAllCarts]);

  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

 if (data?.totalDocs === 0) {
  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon className="w-8 h-8 text-muted-foreground" />
        <p className="text-base font-medium">No products found</p>
      </div>
    </div>
  );
}

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantUrl(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantUrl(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeproduct(product.id)}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCanceled={states.cancel}
            disabled={purchase.isPending}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
