import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../../api/productApi'
import CategoryTiles from './CategoryTiles'
import ProductGrid from '../products/ProductGrid'

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
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="aspect-[3/4] animate-pulse rounded-md bg-gray-200" />
      ))}
    </div>
  )
}

export default function ProductDiscovery() {
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

  const trending = products.filter((product) => product.tags?.includes('trending')).slice(0, 8)
  const newArrivals = products.slice(0, 8)

  return (
    <>
      <Section title="Shop by category">
        <CategoryTiles products={products} />
      </Section>

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
    </>
  )
}
