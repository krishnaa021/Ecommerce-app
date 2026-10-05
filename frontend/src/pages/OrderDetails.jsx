import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import StatusBadge from '../components/common/StatusBadge'
import { fetchOrderById } from '../api/orderApi'
import getErrorMessage from '../utils/getErrorMessage'

const rupee = (n) => `₹${n.toLocaleString('en-IN')}`
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function OrderDetails() {
  const { id } = useParams()
 
  return <OrderDetailsContent key={id} id={id} />
}

function OrderDetailsContent({ id }) {
  const location = useLocation()
  const justPlaced = location.state?.justPlaced

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    fetchOrderById(id)
      .then((data) => {
        if (!ignore) setOrder(data)
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.status === 404 ? 'Order not found.' : getErrorMessage(err))
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return <div className="py-24 text-center text-gray-500">Loading order...</div>
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg text-gray-700">{error || 'Order not found.'}</p>
        <Link to="/orders" className="mt-4 inline-block font-semibold text-brand hover:underline">
          Back to my orders
        </Link>
      </div>
    )
  }

  const { shippingAddress: addr } = order

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {justPlaced && (
        <div className="mb-6 flex items-center gap-3 rounded-md bg-green-50 px-4 py-3 text-green-800">
          <CheckCircle size={22} />
          <div>
            <p className="font-bold">Order placed successfully!</p>
            <p className="text-sm">Thank you for shopping with us.</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      <ul className="mt-6 divide-y divide-gray-100 rounded-md border border-gray-200 bg-white">
        {order.items.map((item) => (
          <li key={`${item.product}-${item.size}`} className="flex gap-4 p-4">
            <Link to={`/products/${item.product}`} className="shrink-0">
              <img src={item.image} alt={item.name} className="h-24 w-20 rounded object-cover" />
            </Link>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-semibold text-gray-900">{item.name}</p>
              <p className="text-gray-500">Size: {item.size}</p>
              <p className="text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-bold text-gray-900">{rupee(item.price * item.quantity)}</p>
              {item.quantity > 1 && <p className="text-gray-500">{rupee(item.price)} each</p>}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-md border border-gray-200 bg-white p-4 text-sm">
          <h2 className="font-bold uppercase text-gray-700">Delivery address</h2>
          <p className="mt-2 text-gray-600">{addr.address}</p>
          <p className="text-gray-600">
            {addr.city}, {addr.postalCode}
          </p>
          <p className="text-gray-600">{addr.country}</p>
        </section>

        <section className="rounded-md border border-gray-200 bg-white p-4 text-sm">
          <h2 className="font-bold uppercase text-gray-700">Payment</h2>
          <p className="mt-2 text-gray-600">Status: {order.paymentStatus}</p>
          <p className="mt-3 flex justify-between text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{rupee(order.totalAmount)}</span>
          </p>
        </section>
      </div>

      <Link to="/orders" className="mt-6 inline-block font-semibold text-brand hover:underline">
        ← Back to my orders
      </Link>
    </div>
  )
}