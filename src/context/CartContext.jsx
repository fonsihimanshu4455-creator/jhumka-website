import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'jhumka_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product._id)
      if (existing) {
        return prev.map((i) =>
          i.id === product._id ? { ...i, qty: i.qty + qty } : i,
        )
      }
      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          image: product.images?.[0] || '',
          qty,
        },
      ]
    })
    setIsOpen(true)
  }

  const removeFromCart = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const clearCart = () => setItems([])

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items],
  )

  const value = {
    items,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    count,
    total,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
