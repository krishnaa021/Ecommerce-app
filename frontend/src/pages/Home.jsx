import { ArrowRight, Package, ShoppingBag, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductDiscovery from '../components/home/ProductDiscovery'
import { useAuth } from '../context/AuthContext'

const shortcuts = [
  { label: 'Browse products', to: '/products', icon: ShoppingBag },
  { label: 'Your orders', to: '/orders', icon: Package },
  { label: 'Your profile', to: '/profile', icon: UserRound },
]

export default function Home() {
  const { user } = useAuth()
  const firstName = user.name?.trim().split(/\s+/)[0] || 'there'

  return (
    <div className="pb-4">
      <section className="bg-[#fdfaf5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
              Your ShopEase home
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-600">
              Find something you love today. Explore the latest styles and picks from across the
              store.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gray-900 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand"
            >
              Start exploring <ArrowRight size={16} />
            </Link>
          </div>

          <nav aria-label="Your account shortcuts" className="grid gap-3 sm:grid-cols-3 lg:min-w-[440px]">
            {shortcuts.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-brand hover:text-brand"
              >
                <Icon size={19} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <ProductDiscovery />
    </div>
  )
}
