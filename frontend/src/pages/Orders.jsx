import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/common/StatusBadge'
import { fetchMyOrders } from '../api/orderApi'
import getErrorMessage from '../utils/getErrorMessage'

const rupee = (n) => `₹${n.toLocaleString('en-IN')}`
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    fetchMyOrders()
      .then((data) => {
        if (!ignore) setOrders(data)
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  if (loading) {
    return <div className="py-24 text-center text-gray-500">Loading your orders...</div>
  }

  if (error) {
    return <p className="py-24 text-center text-red-600">{error}</p>
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-gray-800">No orders yet</h1>
        <p className="mt-2 text-gray-500">When you place an order, it will show up here.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-brand px-6 py-3 font-bold uppercase text-white hover:bg-brand-dark"
        >
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800">My Orders</h1>

      <ul className="mt-6 space-y-4">
        {orders.map((order) => (
          <li key={order._id}>
            <Link
              to={`/orders/${order._id}`}
              className="block rounded-md border border-gray-200 bg-white p-4 transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <StatusBadge status={order.orderStatus} />
              </div>

              <div className="mt-3 flex items-center gap-2">
                {order.items.slice(0, 4).map((item) => (
                  <img
                    key={`${item.product}-${item.size}`}
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-12 rounded object-cover"
                  />
                ))}
                {order.items.length > 4 && (
                  <span className="text-sm text-gray-500">+{order.items.length - 4} more</span>
                )}
                <p className="ml-auto text-right font-bold text-gray-900">
                  {rupee(order.totalAmount)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}