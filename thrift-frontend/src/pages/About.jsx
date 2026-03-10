import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Leaf, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
}

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
            alt="Thrift studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-warm-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial="hidden" animate="visible" className="max-w-lg">
            <motion.span variants={fadeUp} custom={0} className="text-brand-300 text-sm font-medium tracking-widest uppercase">
              Our Story
            </motion.span>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl font-bold text-white mt-2 leading-tight">
              Fashion with <br />Purpose
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-brand-600 text-sm font-medium tracking-widest uppercase">Who We Are</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-warm-900 mt-2 mb-6">
              Built on the Belief that Less is More
            </h2>
            <div className="space-y-4 text-warm-600 leading-relaxed">
              <p>
                Thrift was born out of a simple frustration: fast fashion that doesn't last
                and luxury that's out of reach. We set out to create something in between—
                beautifully made pieces at honest prices.
              </p>
              <p>
                Based in Bangalore, we work directly with skilled artisans and ethical
                manufacturers across India. Every piece in our collection is designed to
                be worn for years, not weeks.
              </p>
              <p>
                Our small but passionate team obsesses over fabric quality, fit, and
                the tiny details that turn a good garment into a great one.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl overflow-hidden aspect-[4/5]"
          >
            <img
              src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"
              alt="Thrift team"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-medium tracking-widest uppercase">Our Values</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-warm-900 mt-2">What We Stand For</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Mindful Design',
                text: 'Every piece starts with intention. We design for real life—versatile styles that move effortlessly from day to night.'
              },
              {
                icon: Leaf,
                title: 'Sustainable Practice',
                text: 'From organic fabrics to minimal packaging, we make choices that respect the planet at every step of our supply chain.'
              },
              {
                icon: Globe,
                title: 'Fair for Everyone',
                text: 'Our artisans earn fair wages and work in safe conditions. Great fashion should not come at a human cost.'
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5">
                  <Icon size={22} className="text-brand-600" />
                </div>
                <h3 className="font-semibold text-warm-900 mb-2">{title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { number: '50+', label: 'Curated styles' },
            { number: '10K+', label: 'Happy customers' },
            { number: '100%', label: 'Ethically sourced' },
            { number: '30-day', label: 'Return policy' },
          ].map(({ number, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="font-display text-3xl sm:text-4xl font-bold text-brand-600">{number}</div>
              <p className="text-warm-500 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Shop Thoughtfully?</h2>
          <p className="text-brand-100 max-w-md mx-auto mb-8">
            Explore our collection and find pieces that feel as good as they look.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 font-medium rounded-full hover:bg-brand-50 transition-colors"
          >
            Explore Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
