import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const categories = [
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids', value: 'kids' },
  { label: 'Home', value: 'home' }, 
  { label: 'Beauty', value: 'beauty' }, 
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { itemCount: cartCount } = useCart()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/products?search=${encodeURIComponent(q)}`)
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        {/* Mobile menu button */}
        <button
          className="lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-brand">
          ShopEase
        </Link>

        {/* Category links (desktop) */}
        <nav className="ml-6 hidden items-center gap-6 lg:flex">
          {categories.map((c) => (
            <Link
              key={c.value}
              to={`/products?category=${c.value}`}
              className="border-b-4 border-transparent py-5 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:border-brand hover:text-brand"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="ml-auto flex flex-1 items-center rounded-md bg-gray-100 px-3 py-2 lg:ml-6 lg:max-w-md"
        >
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-gray-500"
          />
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Profile */}
          <div className="group relative hidden sm:block">
            <Link
              to={user ? '/profile' : '/login'}
              className="flex flex-col items-center text-gray-700 hover:text-brand"
            >
              <User size={20} />
              <span className="text-xs font-semibold">
                {user ? user.name.split(' ')[0] : 'Profile'}
              </span>
            </Link>

            {user && (
              <div className="invisible absolute right-0 top-full z-50 w-48 rounded-md border border-gray-200 bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                <p className="truncate px-4 pb-2 text-xs text-gray-500">Hello, {user.name}</p>
                <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  My Profile
                </Link>
                <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  My Orders
                </Link>
                <Link to="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Wishlist
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full border-t border-gray-100 px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden flex-col items-center text-gray-700 hover:text-brand sm:flex"
          >
            <Heart size={20} />
            <span className="text-xs font-semibold">Wishlist</span>
          </Link>

          {/* Bag */}
          <Link
            to="/cart"
            className="relative flex flex-col items-center text-gray-700 hover:text-brand"
          >
            <ShoppingBag size={20} />
            <span className="hidden text-xs font-semibold sm:block">Bag</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-gray-200 bg-white px-4 py-3 lg:hidden">
          {categories.map((c) => (
            <Link
              key={c.value}
              to={`/products?category=${c.value}`}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-semibold uppercase text-gray-700 hover:text-brand"
            >
              {c.label}
            </Link>
          ))}
          <hr className="my-2 border-gray-200" />

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-gray-700 hover:text-brand"
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-gray-700 hover:text-brand"
              >
                My Orders
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-gray-700 hover:text-brand"
            >
              Login / Register
            </Link>
          )}

          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-700 hover:text-brand"
          >
            Wishlist
          </Link>

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full py-2 text-left text-sm font-semibold text-gray-700 hover:text-brand"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  )
}