import { create } from "zustand";
import { CartItem } from "../types";

interface CartState {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  swapItem: (id: string, newItem: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, updateQuantity: number) => void;
  clearCart: () => void;
  addCartFromDb: (cartFromDb: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  addItem: (item) => set((state) => ({ cart: [item, ...state.cart] })),

  swapItem: (id, newItem) =>
    set((state) => ({
      cart: state.cart.map((item) => (item.id === id ? { ...item, ...newItem } : item)),
    })),

  removeItem: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),

  updateItemQuantity: (id, updatedQuantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: updatedQuantity,
            }
          : item,
      ),
    })),

  clearCart: () => set((state) => ({ cart: [] })),
  addCartFromDb: (cartFromDb) => set((state) => ({ cart: cartFromDb })),
}));
