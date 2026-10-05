import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid'
import { fetchProducts } from '../api/productApi'

const categoryTiles = [
  { label: 'Men', value: 'men', style: 'from-sky-100 to-blue-300' },
  { label: 'Women', value: 'women', style: 'from-rose-100 to-pink-300' },
  { label: 'Kids', value: 'kids', style: 'from-amber-100 to-orange-300' },
]

function Section({ title, linkTo, children }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="text-sm font-semibold text-brand hover:underline">
            View all
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] animate-pulse rounded-md bg-gray-200" />
      ))}
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let ignore = false
    fetchProducts({ limit: 50 })
      .then((res) => {
        if (!ignore) setProducts(res.data)
      })
      .catch(() => {
        if (!ignore) setError(true)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  const trending = products.filter((p) => p.tags?.includes('trending')).slice(0, 8)
  const newArrivals = products.slice(0, 8)

  return (
    <div className="pb-4">
      {/* Hero */}
      <section className="bg-linear-to-r from-brand to-brand-dark">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
            New season
          </p>
          <h1 className="max-w-xl text-4xl font-extrabold text-white sm:text-5xl">
            Style that fits every day
          </h1>
          <p className="max-w-md text-white/90">
            Discover clothing, footwear and more for men, women and kids.
          </p>
          <Link
            to="/products"
            className="mt-2 rounded-md bg-white px-6 py-3 font-bold uppercase text-brand shadow hover:bg-gray-100"
          >
            Shop now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <Section title="Shop by category">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categoryTiles.map((c) => (
            <Link
              key={c.value}
              to={`/products?category=${c.value}`}
              className={`group flex h-40 items-end overflow-hidden rounded-lg bg-linear-to-br p-5 transition hover:shadow-lg sm:h-56 ${c.style}`}
            >
              <span className="text-2xl font-extrabold text-gray-900">{c.label}</span>
              <span className="ml-auto text-sm font-semibold text-gray-800 transition group-hover:translate-x-1">
                Shop now →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Product rows */}
      {loading && (
        <Section title="Trending now">
          <GridSkeleton />
        </Section>
      )}

      {error && (
        <p className="px-4 pt-12 text-center text-gray-500">
          We couldn&apos;t load products right now. Please try again in a moment.
        </p>
      )}

      {!loading && !error && trending.length > 0 && (
        <Section title="Trending now" linkTo="/products">
          <ProductGrid products={trending} />
        </Section>
      )}

      {!loading && !error && newArrivals.length > 0 && (
        <Section title="New arrivals" linkTo="/products">
          <ProductGrid products={newArrivals} />
        </Section>
      )}
    </div>
  )
}