import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, LogOut, Package, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { fetchMyOrders } from '../api/orderApi'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const [orderCount, setOrderCount] = useState(null)

  useEffect(() => {
    let ignore = false
    fetchMyOrders()
      .then((orders) => {
        if (!ignore) setOrderCount(orders.length)
      })
      .catch(() => {
        // The count is optional, so the card just shows a generic line
      })
    return () => {
      ignore = true
    }
  }, [])

  // Briefly null while logging out, before the redirect happens
  if (!user) return null

  const initial = user.name?.trim()?.[0]?.toUpperCase() ?? '?'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cards = [
    {
      to: '/orders',
      icon: Package,
      title: 'My Orders',
      subtitle:
        orderCount === null
          ? 'View your order history'
          : orderCount === 0
            ? 'No orders yet'
            : `${orderCount} ${orderCount === 1 ? 'order' : 'orders'} placed`,
    },
    {
      to: '/cart',
      icon: ShoppingBag,
      title: 'My Bag',
      subtitle:
        itemCount === 0
          ? 'Your bag is empty'
          : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your bag`,
    },
    {
      to: '/wishlist',
      icon: Heart,
      title: 'My Wishlist',
      subtitle: 'Items you saved for later',
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <section className="flex flex-wrap items-center gap-5 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand text-3xl font-bold text-white">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="truncate text-gray-500">{user.email}</p>
          {user.role === 'admin' && (
            <span className="mt-2 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              Admin
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600"
        >
          <LogOut size={16} />
          Logout
        </button>
      </section>

      {/* Quick links */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(({ to, icon: Icon, title, subtitle }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-lg border border-gray-200 bg-white p-5 transition hover:border-brand hover:shadow-md"
          >
            <Icon size={26} className="text-brand" />
            <h2 className="mt-3 font-bold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-brand group-hover:underline">
              View →
            </span>
          </Link>
        ))}
      </section>

      {/* Account details */}
      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase text-gray-700">Account details</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex gap-4">
            <dt className="w-32 shrink-0 text-gray-500">Full name</dt>
            <dd className="text-gray-900">{user.name}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-32 shrink-0 text-gray-500">Email</dt>
            <dd className="break-all text-gray-900">{user.email}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-32 shrink-0 text-gray-500">Account type</dt>
            <dd className="text-gray-900">{user.role === 'admin' ? 'Admin' : 'Customer'}</dd>
          </div>
          {user.createdAt && (
            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-gray-500">Member since</dt>
              <dd className="text-gray-900">{formatDate(user.createdAt)}</dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  )
}