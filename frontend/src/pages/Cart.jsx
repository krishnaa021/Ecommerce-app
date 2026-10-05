import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import getErrorMessage from '../utils/getErrorMessage'

const rupee = (n) => `₹${n.toLocaleString('en-IN')}`

export default function Cart() {
  const navigate = useNavigate()
  const { items, loading, itemCount, subtotal, mrpTotal, discount, updateQuantity, removeItem } =
    useCart()
  const [busyKey, setBusyKey] = useState('')
  const [error, setError] = useState('')

  // Runs a cart action and tracks which line is busy
  const run = async (key, action) => {
    setBusyKey(key)
    setError('')
    try {
      await action()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusyKey('')
    }
  }

  if (loading && items.length === 0) {
    return <div className="py-24 text-center text-gray-500">Loading your bag...</div>
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-gray-800">Your bag is empty</h1>
        <p className="mt-2 text-gray-500">Add some items to get started.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-brand px-6 py-3 font-bold uppercase text-white hover:bg-brand-dark"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  const hasStockProblem = items.some((i) => i.stock < i.quantity)
  const itemWord = itemCount === 1 ? 'item' : 'items'

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800">
        My Bag{' '}
        <span className="text-base font-normal text-gray-500">
          ({itemCount} {itemWord})
        </span>
      </h1>

      {error && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <ul className="space-y-4 lg:col-span-2">
          {items.map(({ product, size, quantity, stock }) => {
            const key = `${product._id}-${size}`
            const busy = busyKey === key

            return (
              <li
                key={key}
                className={`flex gap-4 rounded-md border border-gray-200 bg-white p-3 ${
                  busy ? 'opacity-60' : ''
                }`}
              >
                <Link
                  to={`/products/${product._id}`}
                  className="h-32 w-24 shrink-0 overflow-hidden rounded bg-gray-100"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-900">{product.brand}</p>
                      <p className="truncate text-sm text-gray-500">{product.name}</p>
                      <p className="mt-1 text-sm text-gray-700">
                        Size: <span className="font-semibold">{size}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      disabled={busy}
                      onClick={() => run(key, () => removeItem(product._id, size))}
                      className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {stock < quantity && (
                    <p className="mt-2 text-xs font-semibold text-red-600">
                      {stock === 0
                        ? 'Out of stock. Remove this item to continue.'
                        : `Only ${stock} left in this size. Reduce the quantity to continue.`}
                    </p>
                  )}

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center rounded border border-gray-300">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={busy || quantity <= 1}
                        onClick={() => run(key, () => updateQuantity(product._id, size, quantity - 1))}
                        className="p-2 hover:text-brand disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={busy || quantity >= stock}
                        onClick={() => run(key, () => updateQuantity(product._id, size, quantity + 1))}
                        className="p-2 hover:text-brand disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">{rupee(product.price * quantity)}</p>
                      {quantity > 1 && (
                        <p className="text-xs text-gray-500">{rupee(product.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Price summary */}
        <aside className="h-fit rounded-md border border-gray-200 bg-white p-4 lg:sticky lg:top-20">
          <h2 className="text-sm font-bold uppercase text-gray-700">
            Price details ({itemCount} {itemWord})
          </h2>

          <dl className="mt-4 space-y-3 text-sm">
            {discount > 0 && (
              <>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Total MRP</dt>
                  <dd>{rupee(mrpTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Discount on MRP</dt>
                  <dd className="text-green-700">-{rupee(discount)}</dd>
                </div>
              </>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold">
              <dt>Total amount</dt>
              <dd>{rupee(subtotal)}</dd>
            </div>
          </dl>

          {hasStockProblem && (
            <p className="mt-3 text-xs text-red-600">
              Some items in your bag are not available in the requested quantity.
            </p>
          )}

          <button
            type="button"
            disabled={hasStockProblem}
            onClick={() => navigate('/checkout')}
            className="mt-4 w-full rounded-md bg-brand py-3 font-bold uppercase text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Place order
          </button>
        </aside>
      </div>
    </div>
  )
}