import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RefreshCw, Star, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../lib/graphql'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
}

const categories = [
  { slug: 'women', name: 'Women', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80' },
  { slug: 'men', name: 'Men', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
  { slug: 'gear', name: 'Gear', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80' },
  { slug: 'training', name: 'Training', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80' },
]

export default function Home() {
  const { products: featured, loading } = useProducts({ pageSize: 8 })

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
            alt="Fashion editorial"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-900/80 via-warm-900/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-block text-brand-300 text-sm font-medium tracking-widest uppercase mb-4"
            >
              New Season — 2025 Collection
            </motion.span>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            >
              Less is <br />
              <span className="text-brand-300">More</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-warm-200/80 text-lg leading-relaxed mb-8 max-w-md"
            >
              Timeless pieces crafted for everyday elegance. Discover our thoughtfully curated collection.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-full transition-colors"
              >
                Shop the Collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
              >
                Our Story
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---------- TRUST BAR ---------- */}
      <section className="border-b border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm text-warm-600">
          {[
            { icon: Truck, label: 'Free shipping over ₹999' },
            { icon: Shield, label: '100% secure payments' },
            { icon: RefreshCw, label: '30-day easy returns' },
            { icon: Star, label: 'Premium quality' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-2">
              <Icon size={16} className="text-brand-600 shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FEATURED PRODUCTS ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-brand-600 text-sm font-medium tracking-widest uppercase">Handpicked</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-warm-900 mt-1">Featured Picks</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-500 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
          ) : (
            featured.slice(0, 8).map((product, i) => (
              <ProductCard key={product.sku} product={product} index={i} />
            ))
          )}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700">
            View all products <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ---------- CATEGORY GRID ---------- */}
      <section className="bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <span className="text-brand-600 text-sm font-medium tracking-widest uppercase">Browse</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-warm-900 mt-1">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={`/shop/${cat.slug}`}
                  className="group relative block aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <h3 className="text-white font-display text-xl font-semibold">{cat.name}</h3>
                    <span className="text-white/70 text-sm flex items-center gap-1 mt-1 group-hover:text-brand-300 transition-colors">
                      Explore <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EDITORIAL BANNER ---------- */}
      <section className="relative h-[50vh] min-h-[380px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
            alt="Store interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-warm-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4">Designed to Last</h2>
            <p className="text-warm-200/80 max-w-md mx-auto mb-8">
              Every piece is crafted with intention—quality fabrics, mindful production, and styles that transcend seasons.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/40 text-white font-medium rounded-full hover:bg-white hover:text-warm-900 transition-colors"
            >
              Learn More <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <span className="text-brand-600 text-sm font-medium tracking-widest uppercase">Loved by Many</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-warm-900 mt-1">What Customers Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Aditi R.', text: 'The quality is unreal for the price. My linen dress from Thrift is now my go-to for every brunch. Will keep coming back!', rating: 5 },
            { name: 'Vikram S.', text: 'Finally, a brand that gets minimalist menswear right. The fit on the Oxford shirt is perfect—no alterations needed.', rating: 5 },
            { name: 'Priya M.', text: 'Ordered the leather tote and it exceeded my expectations. Beautiful craftsmanship and the shipping was super fast.', rating: 5 },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-warm-50 rounded-2xl p-8"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-warm-700 leading-relaxed mb-5 text-sm">&ldquo;{t.text}&rdquo;</p>
              <p className="text-warm-900 font-semibold text-sm">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
