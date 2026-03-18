import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { formatPriceValue } from '../lib/graphql'

export default function Cart() {
  const { items: cart, totalItems, totalPrice, updateQty, removeItem, clearCart } = useCart()

  const handleCheckout = () => {
    const cartId = localStorage.getItem('mage_cart_id')
    if (cartId) {
      window.location.href = `https://thriftfashion.me/checkout?guest_cart_id=${cartId}`
    } else {
      window.location.href = 'https://thriftfashion.me/checkout'
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-warm-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-warm-900 mb-2">Your bag is empty</h2>
          <p className="text-warm-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm rounded-full transition-colors"
          >
            Start Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold text-warm-900">
            Shopping Bag <span className="text-warm-400 font-normal text-xl">({totalItems})</span>
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-warm-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          <div className="lg:col-span-2 space-y-1">
            <AnimatePresence mode="popLayout">
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-5 py-6 border-b border-warm-200"
                >
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-warm-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-medium text-warm-900 text-sm sm:text-base hover:text-brand-700 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-warm-500 mt-0.5 capitalize">{item.category}</p>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-xs text-warm-400 mt-1">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && ' · '}
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold text-warm-900 text-sm whitespace-nowrap">
                        {formatPriceValue(item.price * item.qty)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-warm-300 rounded-full">
                        <button
                          onClick={() => updateQty(item.id, item.selectedSize, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-warm-600 hover:text-warm-900 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-warm-900">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.selectedSize, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-warm-600 hover:text-warm-900 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id, item.selectedSize)}
                        className="text-warm-400 hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div>
            <div className="bg-warm-50 rounded-2xl p-6 lg:p-8 sticky top-28">
              <h2 className="font-semibold text-warm-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm border-b border-warm-200 pb-5 mb-5">
                <div className="flex justify-between text-warm-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPriceValue(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-warm-600">
                  <span>Shipping</span>
                  <span className={totalPrice >= 999 ? 'text-green-600 font-medium' : ''}>
                    {totalPrice >= 999 ? 'Free' : formatPriceValue(99)}
                  </span>
                </div>
                {totalPrice < 999 && (
                  <p className="text-xs text-brand-600">
                    Add {formatPriceValue(999 - totalPrice)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="flex justify-between font-semibold text-warm-900 text-lg mb-6">
                <span>Total</span>
                <span>{formatPriceValue(totalPrice + (totalPrice >= 999 ? 0 : 99))}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-full transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/shop"
                className="block text-center mt-4 text-sm text-warm-500 hover:text-brand-600 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}