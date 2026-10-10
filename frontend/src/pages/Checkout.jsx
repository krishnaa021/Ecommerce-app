import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/common/Input'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../api/orderApi'
import getErrorMessage from '../utils/getErrorMessage'

const rupee = (n) => `₹${n.toLocaleString('en-IN')}`

export default function Checkout() {
  const navigate = useNavigate()
  const { items, itemCount, subtotal, mrpTotal, discount, clearLocalCart } = useCart()

  const [form, setForm] = useState({ address: '', city: '', postalCode: '', country: 'India' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const orderPlaced = useRef(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const next = {}
    if (form.address.trim().length < 5) next.address = 'Please enter your full address'
    if (!form.city.trim()) next.city = 'Please enter your city'
    if (!/^[A-Za-z0-9 -]{4,10}$/.test(form.postalCode.trim())) {
      next.postalCode = 'Please enter a valid postal code'
    }
    if (!form.country.trim()) next.country = 'Please enter your country'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      const order = await placeOrder({
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
      })
      orderPlaced.current = true
      clearLocalCart() // the backend already emptied the cart
      navigate(`/orders`, { replace: true, state: { justPlaced: true } })
    } catch (err) {
      setServerError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !orderPlaced.current) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-lg text-gray-700">Your bag is empty.</p>
        <Link to="/products" className="mt-4 inline-block font-semibold text-brand hover:underline">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Address form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-md border border-gray-200 bg-white p-5 lg:col-span-2"
        >
          <h2 className="text-sm font-bold uppercase text-gray-700">Delivery address</h2>

          <Input id="address" name="address" label="Address" autoComplete="street-address"
            value={form.address} onChange={handleChange} error={errors.address} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="city" name="city" label="City" autoComplete="address-level2"
              value={form.city} onChange={handleChange} error={errors.city} />
            <Input id="postalCode" name="postalCode" label="Postal code" autoComplete="postal-code"
              value={form.postalCode} onChange={handleChange} error={errors.postalCode} />
          </div>

          <Input id="country" name="country" label="Country" autoComplete="country-name"
            value={form.country} onChange={handleChange} error={errors.country} />

          <div className="rounded bg-gray-50 px-3 py-2 text-sm text-gray-600">
            Payment: <span className="font-semibold">Pay on delivery</span>
          </div>

          {serverError && (
            <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}{' '}
              <Link to="/cart" className="font-semibold underline">
                Review your bag
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-brand py-3 font-bold uppercase text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Placing order...' : `Place order • ${rupee(subtotal)}`}
          </button>
        </form>

        {/* Order summary */}
        <aside className="h-fit rounded-md border border-gray-200 bg-white p-4 lg:sticky lg:top-20">
          <h2 className="text-sm font-bold uppercase text-gray-700">
            Order summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h2>

          <ul className="mt-4 divide-y divide-gray-100">
            {items.map(({ product, size, quantity }) => (
              <li key={`${product._id}-${size}`} className="flex gap-3 py-3">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="h-16 w-12 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-semibold text-gray-900">{product.brand}</p>
                  <p className="truncate text-gray-500">{product.name}</p>
                  <p className="text-gray-500">Size {size} • Qty {quantity}</p>
                </div>
                <p className="text-sm font-semibold">{rupee(product.price * quantity)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-2 space-y-2 border-t border-gray-200 pt-3 text-sm">
            {discount > 0 && (
              <>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Total MRP</dt>
                  <dd>{rupee(mrpTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Discount</dt>
                  <dd className="text-green-700">-{rupee(discount)}</dd>
                </div>
              </>
            )}
            <div className="flex justify-between text-base font-bold">
              <dt>Total</dt>
              <dd>{rupee(subtotal)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}