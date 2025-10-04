import { useCallback } from "react";
import {useShallow} from "zustand/react/shallow"
import { useCartStore } from "../store/use-cart-toast";

export const useCart = (tenantSlug: string) => {
  const addProduct = useCartStore((state) => state.addProduct)
  const removeProduct = useCartStore((state) => state.removeProduct)
  const clearCart = useCartStore((state) => state.clearCart)
  const clearAllCarts = useCartStore((state) => state.clearAllCarts)

  const productIds = useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []));

  const toggleProduct = useCallback((productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  }, [addProduct, removeProduct, productIds, tenantSlug]);

  const isProductInCart = (productId: string) => {
    return productIds.includes(productId);
  };

  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug);
  }, [tenantSlug, clearCart]);

  const handleAddProduct = useCallback((productId: string) => {
    addProduct(tenantSlug, productId)
  }, [])

  const handleRemoveProduct = useCallback((productId: string) => {
    removeProduct(tenantSlug, productId)
  }, [])

  return {
    productIds,
    addProduct: handleAddProduct,
    removeproduct: handleRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length,
  };
};
