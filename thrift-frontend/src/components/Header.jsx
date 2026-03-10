import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { totalItems } = useCart()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const navLinks = [
    { to: '/shop', label: 'Shop All' },
    { to: '/shop/women', label: 'Women' },
    { to: '/shop/men', label: 'Men' },
    { to: '/shop/gear', label: 'Gear' },
    { to: '/about', label: 'About' },
  ]

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-brand-900 text-white text-center text-xs sm:text-sm py-2 px-4 tracking-wide font-medium">
        Free shipping on orders above ₹2,000 &nbsp;·&nbsp; Easy 30-day returns
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : isHome
            ? 'bg-transparent'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 -ml-2 text-warm-800 hover:text-brand-600 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-warm-900 group-hover:text-brand-700 transition-colors">
                Thrift
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-brand-600 ${
                    location.pathname === link.to
                      ? 'text-brand-700'
                      : 'text-warm-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-warm-800 hover:text-brand-600 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link
                to="/about"
                className="hidden sm:block p-2 text-warm-800 hover:text-brand-600 transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
              <Link to="/cart" className="relative p-2 text-warm-800 hover:text-brand-600 transition-colors">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-full bg-white shadow-lg border-t border-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                onKeyDown={e => {
                  if (e.key === 'Escape') setSearchOpen(false)
                }}
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-warm-800 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
