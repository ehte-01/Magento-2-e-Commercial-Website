import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice, getProductPrice, getProductImage } from '../lib/graphql'
import { motion } from 'framer-motion'

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const { regular, final, hasDiscount } = getProductPrice(product)
  const image = getProductImage(product)

  const handleAdd = () => {
    addItem({
      id: product.sku,
      name: product.name,
      price: final?.value || 0,
      image,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-warm-100 aspect-[3/4] mb-4">
        <Link to={`/product/${product.url_key}`}>
          <img
            src={image}
            alt={product.small_image?.label || product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {hasDiscount && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-brand-600 text-white text-[11px] font-semibold rounded-full uppercase tracking-wider">
            Sale
          </span>
        )}

        <div className="absolute bottom-0 inset-x-0 p-3 flex items-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/95 backdrop-blur text-warm-900 text-sm font-medium rounded-xl hover:bg-brand-600 hover:text-white transition-colors cursor-pointer"
          >
            <ShoppingBag size={15} />
            Add to Bag
          </button>
          <button className="p-2.5 bg-white/95 backdrop-blur rounded-xl text-warm-600 hover:text-red-500 transition-colors cursor-pointer">
            <Heart size={15} />
          </button>
        </div>
      </div>

      <Link to={`/product/${product.url_key}`} className="block">
        <h3 className="font-medium text-warm-900 text-sm leading-snug mb-1 group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-warm-900">{formatPrice(final)}</span>
          {hasDiscount && (
            <span className="text-sm text-warm-400 line-through">{formatPrice(regular)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
