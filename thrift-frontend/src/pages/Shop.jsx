import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { useProducts, useProductsByCategory, CATEGORY_MAP } from '../lib/graphql'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
]

const categoryTabs = [
  { slug: 'all', name: 'All' },
  { slug: 'women', name: 'Women' },
  { slug: 'men', name: 'Men' },
  { slug: 'gear', name: 'Gear' },
  { slug: 'training', name: 'Training' },
]

export default function Shop() {
  const { category } = useParams()
  const [sort, setSort] = useState('featured')
  const [mobileFilters, setMobileFilters] = useState(false)

  const activeCategory = category || 'all'
  const categoryId = CATEGORY_MAP[activeCategory]

  // Build GraphQL sort variable
  const gqlSort = useMemo(() => {
    switch (sort) {
      case 'price-asc': return { price: 'ASC' }
      case 'price-desc': return { price: 'DESC' }
      case 'newest': return { position: 'DESC' }
      default: return undefined
    }
  }, [sort])

  // Fetch all products or by category
  const allProducts = useProducts({ pageSize: 50, sort: gqlSort })
  const catProducts = useProductsByCategory(categoryId, { pageSize: 50, sort: gqlSort })

  const { products, totalCount, loading } = categoryId ? catProducts : allProducts

  const pageTitle = activeCategory === 'all'
    ? 'All Products'
    : categoryTabs.find(c => c.slug === activeCategory)?.name || 'Shop'

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-warm-50 border-b border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-warm-900">
            {pageTitle}
          </h1>
          <p className="text-warm-500 mt-2 text-sm">
            {totalCount} {totalCount === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          {/* Desktop category tabs */}
          <div className="hidden md:flex items-center gap-1 flex-wrap">
            {categoryTabs.map(t => (
              <Link
                key={t.slug}
                to={t.slug === 'all' ? '/shop' : `/shop/${t.slug}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === t.slug
                    ? 'bg-brand-600 text-white'
                    : 'text-warm-600 hover:bg-warm-100'
                }`}
              >
                {t.name}
              </Link>
            ))}
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setMobileFilters(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-warm-300 rounded-full text-sm text-warm-700"
          >
            <SlidersHorizontal size={14} /> Filter
          </button>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-4 py-2 border border-warm-300 rounded-full text-sm text-warm-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-600" size={36} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((product, i) => (
              <ProductCard key={product.sku} product={product} index={i} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-warm-500 text-lg">No products found in this category.</p>
            <Link to="/shop" className="text-brand-600 font-medium text-sm mt-2 inline-block">View all products</Link>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-warm-900">Categories</h3>
                <button onClick={() => setMobileFilters(false)} className="text-warm-500">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-1">
                {categoryTabs.map(t => (
                  <Link
                    key={t.slug}
                    to={t.slug === 'all' ? '/shop' : `/shop/${t.slug}`}
                    onClick={() => setMobileFilters(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeCategory === t.slug
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-warm-600 hover:bg-warm-50'
                    }`}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
