import { useGetCart } from "@/features/cart/components/hooks/useCart";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useEffect } from "react";

export default function FetchCartFromDb() {
  const { data: cartFromDb } = useGetCart();
  const addCartFromDb = useCartStore((s) => s.addCartFromDb);

  useEffect(() => {
    addCartFromDb(cartFromDb ?? []);
  }, [addCartFromDb, cartFromDb]);

  return null;
}
