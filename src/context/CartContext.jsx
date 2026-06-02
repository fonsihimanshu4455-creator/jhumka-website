import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'

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
  const [coupon, setCoupon] = useState(null) // { code, discount, ... }
  const [couponError, setCouponError] = useState('')

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

  const clearCart = () => {
    setItems([])
    setCoupon(null)
    setCouponError('')
  }

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items],
  )

  // Recompute the coupon discount whenever the cart changes; drop it if it no
  // longer qualifies (e.g. cart fell below the minimum order).
  const discount = useMemo(() => {
    if (!coupon) return 0
    if (coupon.type === 'percent') {
      let d = (subtotal * coupon.value) / 100
      if (coupon.maxDiscount) d = Math.min(d, coupon.maxDiscount)
      return Math.min(Math.round(d), subtotal)
    }
    return Math.min(coupon.value, subtotal)
  }, [coupon, subtotal])

  const total = Math.max(0, subtotal - discount)

  // Validate a coupon code against the backend (falls back gracefully offline).
  const applyCoupon = async (code) => {
    setCouponError('')
    if (!code?.trim()) {
      setCouponError('Enter a coupon code.')
      return false
    }
    try {
      const { data } = await api.post('/coupons/apply', {
        code: code.trim(),
        subtotal,
      })
      setCoupon({
        code: data.code,
        type: data.type,
        value: data.value,
        maxDiscount: data.maxDiscount || 0,
      })
      return true
    } catch (err) {
      setCoupon(null)
      setCouponError(
        err?.response?.data?.message ||
          'Could not validate coupon (is the store online?).',
      )
      return false
    }
  }

  const removeCoupon = () => {
    setCoupon(null)
    setCouponError('')
  }

  const value = {
    items,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    count,
    subtotal,
    discount,
    total,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
