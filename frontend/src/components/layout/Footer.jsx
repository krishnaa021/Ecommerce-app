import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const shopLinks = [
  { label: 'Men', to: '/products?category=men' },
  { label: 'Women', to: '/products?category=women' },
  { label: 'Kids', to: '/products?category=kids' },
  { label: 'Home', to: '/products?category=home' },
  { label: 'Beauty', to: '/products?category=beauty' },
]

const accountLinks = [
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
  { label: 'My Orders', to: '/orders' },
  { label: 'Bag', to: '/cart' },
]

const helpLinks = ['FAQ', 'Shipping & Delivery', 'Returns & Exchanges', 'Contact Us']

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-brand">
            ShopEase
          </Link>
          <p className="mt-3 text-sm text-gray-600">
            Your one-stop destination for fashion, home and beauty. Quality products,
            delivered to your door.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800">Shop</h3>
          <ul className="mt-4 space-y-2">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-gray-600 hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800">Account</h3>
          <ul className="mt-4 space-y-2">
            {accountLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-gray-600 hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help + contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800">Help</h3>
          <ul className="mt-4 space-y-2">
            {helpLinks.map((label) => (
              <li key={label} className="text-sm text-gray-600">
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Mail size={16} /> support@shopease.com
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} /> Delhi, India
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  )
}