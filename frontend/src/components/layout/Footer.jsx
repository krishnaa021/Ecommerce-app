import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react'

const shopLinks = [
  { label: 'Men', to: '/products?category=men' },
  { label: 'Women', to: '/products?category=women' },
  { label: 'Kids', to: '/products?category=kids' },
  { label: 'Home', to: '/products?category=home' },
  { label: 'Beauty', to: '/products?category=beauty' },
]

const accountLinks = [
  { label: 'My Orders', to: '/orders' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Bag', to: '/cart' },
]

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm text-white">
                S
              </span>
              <span>ShopEase</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-gray-400">
              A little something for every day. Discover fashion, home and beauty picks you&apos;ll
              love.
            </p>
            <Link
              to="/products"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white transition-colors hover:text-pink"
            >
              Explore the store <ArrowUpRight size={16} />
            </Link>
          </div>

          <nav aria-label="Shop links">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Shop</h3>
            <ul className="mt-5 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account links">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Account</h3>
            <ul className="mt-5 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Get in touch</h3>
            <p className="mt-5 text-sm leading-6 text-gray-400">
              Need a hand? We&apos;re here to help with your shopping experience.
            </p>
            <div className="mt-4 space-y-3 text-sm text-gray-200">
              <a
                href="mailto:support@shopease.com"
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Mail size={16} className="text-pink" />
                support@shopease.com
              </a>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-pink" />
                +91 98xxx xxx10
              </p>
              <p className="flex items-center gap-3 text-gray-400">
                <MapPin size={16} className="text-pink" />
                Delhi, India
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ShopEase. All rights reserved.</span>
          <span>Made for the things you love.</span>
        </div>
      </div>
    </footer>
  )
}
