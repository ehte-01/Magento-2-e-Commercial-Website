import { Link } from 'react-router-dom'
import { Instagram, Twitter, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-warm-900 text-warm-200">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-3">
              Stay in the Loop
            </h3>
            <p className="text-warm-200/70 text-sm mb-6 leading-relaxed">
              Be the first to know about new arrivals, exclusive offers, and behind-the-scenes stories.
            </p>
            <form
              onSubmit={e => { e.preventDefault(); alert('Thank you for subscribing!') }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-warm-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm rounded-full transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold text-white">Thrift</span>
            </Link>
            <p className="text-warm-200/60 text-sm leading-relaxed mb-5">
              Curated fashion for the modern soul. Quality pieces that stand the test of time.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-warm-200/50 hover:text-brand-400 transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-warm-200/50 hover:text-brand-400 transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-warm-200/50 hover:text-brand-400 transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop/women" className="text-warm-200/60 hover:text-brand-300 transition-colors">Women</Link></li>
              <li><Link to="/shop/men" className="text-warm-200/60 hover:text-brand-300 transition-colors">Men</Link></li>
              <li><Link to="/shop/gear" className="text-warm-200/60 hover:text-brand-300 transition-colors">Gear</Link></li>
              <li><Link to="/shop/training" className="text-warm-200/60 hover:text-brand-300 transition-colors">Training</Link></li>
              <li><Link to="/shop" className="text-warm-200/60 hover:text-brand-300 transition-colors">View All</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-warm-200/60 hover:text-brand-300 transition-colors">About Us</Link></li>
              <li><a href="#" className="text-warm-200/60 hover:text-brand-300 transition-colors">Sustainability</a></li>
              <li><a href="#" className="text-warm-200/60 hover:text-brand-300 transition-colors">Careers</a></li>
              <li><a href="#" className="text-warm-200/60 hover:text-brand-300 transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Help</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-warm-200/60 hover:text-brand-300 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-warm-200/60 hover:text-brand-300 transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-warm-200/60 hover:text-brand-300 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-warm-200/60 hover:text-brand-300 transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-warm-200/40">
          <p>&copy; {new Date().getFullYear()} Thrift Commerce Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>Bangalore, India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
