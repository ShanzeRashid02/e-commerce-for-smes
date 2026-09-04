import { create } from 'zustand'

type CartItem = {
  id: number
  name: string
  price: number
  image: string
  size: string
  quantity: number
  stock: number
}

type CartStore = {
  items: CartItem[]

  addToCart: (item: CartItem) => void
  removeFromCart: (id: number, size: string) => void
  increaseQuantity: (id: number, size: string) => void
  decreaseQuantity: (id: number, size: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addToCart: (item) =>
    set((state) => {
      const totalProductQuantity = state.items
        .filter((cartItem) => cartItem.id === item.id)
        .reduce(
          (total, cartItem) =>
            total + cartItem.quantity,
          0
        )

      if (totalProductQuantity >= item.stock) {
        return state
      }

      const existingItem = state.items.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size
      )

      if (existingItem) {
        return {
          items: state.items.map((cartItem) =>
            cartItem.id === item.id &&
            cartItem.size === item.size
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + 1,
                  stock: item.stock,
                }
              : cartItem
          ),
        }
      }

      return {
        items: [
          ...state.items,
          item,
        ],
      }
    }),

  removeFromCart: (id, size) =>
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size
          )
      ),
    })),

  increaseQuantity: (id, size) =>
    set((state) => {
      const itemToIncrease = state.items.find(
        (item) =>
          item.id === id &&
          item.size === size
      )

      if (!itemToIncrease) {
        return state
      }

      const totalProductQuantity = state.items
        .filter((item) => item.id === id)
        .reduce(
          (total, item) =>
            total + item.quantity,
          0
        )

      if (
        totalProductQuantity >=
        itemToIncrease.stock
      ) {
        return state
      }

      return {
        items: state.items.map((item) =>
          item.id === id &&
          item.size === size
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        ),
      }
    }),

  decreaseQuantity: (id, size) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id &&
        item.size === size &&
        item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      ),
    })),

  clearCart: () =>
    set({
      items: [],
    }),
}))
