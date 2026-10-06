import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../../api/productApi'

const FALLBACK = [
  { id: 'fallback-1', text: 'New arrivals are here', to: '/products' },
  { id: 'fallback-2', text: 'Fresh styles for men, women and kids', to: '/products' },
]

const css = `
@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-scroll var(--ticker-duration, 40s) linear infinite;
}
.ticker:hover .ticker-track,
.ticker:focus-within .ticker-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none; }
}
`

export default function Ticker() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let ignore = false
    fetchProducts({ limit: 5 })
      .then((res) => {
        if (!ignore) setProducts(res.data)
      })
      .catch(() => {
      })
    return () => {
      ignore = true
    }
  }, [])

  const items =
    products.length > 0
      ? products.map((p) => ({
          id: p._id,
          text: `${p.brand} ${p.name} · ₹${p.price.toLocaleString('en-IN')}`,
          to: `/products/${p._id}`,
        }))
      : FALLBACK

  const repeat = Math.ceil(8 / items.length)
  const half = Array.from({ length: repeat }, () => items).flat()
  const duration = half.length * 5 // seconds, keeps the speed about the same for any list length

  return (
    <div className="ticker overflow-hidden bg-gray-900 text-white" aria-label="New arrivals">
      <div
        className="ticker-track h-9 items-center text-xs sm:text-sm"
        style={{ '--ticker-duration': `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {half.map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                to={item.to}
                tabIndex={copy === 1 ? -1 : 0}
                className="flex items-center gap-2 whitespace-nowrap px-8 hover:underline"
              >
                <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                  New
                </span>
                <span>{item.text}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <style>{css}</style>
    </div>
  )
}