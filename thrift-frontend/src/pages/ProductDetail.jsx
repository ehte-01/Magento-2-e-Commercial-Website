import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, ChevronLeft, Star, Truck, RefreshCw, Shield, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProduct, useProducts, formatPrice, getProductPrice, getProductImage } from '../lib/graphql'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id: urlKey } = useParams()
  const navigate = useNavigate()
  const { product, loading } = useProduct(urlKey)
  const { products: allProducts } = useProducts({ pageSize: 20 })
  const { addItem } = useCart()

  const [added, setAdded] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-600" size={36} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-warm-900 mb-2">Product not found</h2>
          <Link to="/shop" className="text-brand-600 font-medium text-sm">Back to shop</Link>
        </div>
      </div>
    )
  }

  const { regular, final: finalPrice, hasDiscount } = getProductPrice(product)
  const image = getProductImage(product, 'image')
  const related = allProducts.filter(p => p.sku !== product.sku).slice(0, 4)

  const handleAddToCart = () => {
    addItem({
      id: product.sku,
      name: product.name,
      price: finalPrice?.value || 0,
      image: getProductImage(product),
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-800 transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>
      </div>

      {/* Product section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-warm-100"
          >
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                Sale
              </span>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="text-brand-600 text-sm font-medium tracking-widest uppercase mb-2">
              {product.sku}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-warm-900 mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-bold text-warm-900">{formatPrice(finalPrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-warm-400 line-through">{formatPrice(regular)}</span>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {Math.round(getProductPrice(product).discount?.percent_off || 0)}% off
                  </span>
                </>
              )}
            </div>

            {product.short_description?.html && (
              <div
                className="text-warm-600 text-sm leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: product.short_description.html }}
              />
            )}

            {product.description?.html && !product.short_description?.html && (
              <div
                className="text-warm-600 text-sm leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: product.description.html }}
              />
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-medium transition-all cursor-pointer ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-brand-600 hover:bg-brand-500 text-white'
                }`}
              >
                <ShoppingBag size={16} />
                {added ? 'Added to Bag!' : 'Add to Bag'}
              </button>
              <button className="p-3.5 border border-warm-300 rounded-full text-warm-600 hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer">
                <Heart size={18} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="border-t border-warm-200 pt-6 space-y-3">
              {[
                { icon: Truck, text: 'Free shipping on orders over ₹999' },
                { icon: RefreshCw, text: '30-day hassle-free returns' },
                { icon: Shield, text: 'Secure checkout with 256-bit encryption' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-warm-500">
                  <Icon size={15} className="text-warm-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-warm-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <h2 className="font-display text-2xl font-semibold text-warm-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
              {related.map((p, i) => (
                <ProductCard key={p.sku} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
