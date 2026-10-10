import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid'
import { fetchProducts } from '../api/productApi'
import CategoryTiles from '../components/home/CategoryTiles'

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
      {/* Updated Hero Section */}
      <section className="relative overflow-hidden bg-[#fdfaf5] py-16 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col lg:flex-row items-center gap-12 px-4">
          
          {/* Left Content */}
          <div className="flex flex-col items-start gap-6 lg:w-1/2 relative z-10">
            <p className="text-s font-bold  tracking-widest text-brand">
              ShopEase Collection
            </p>
            <h1 className="max-w-xl font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-pink leading-tight">
              Looking for <br /> Your next <br /> Fashion Statement?
            </h1>
            <p className="max-w-md text-lg text-gray-600">
              We got you covered! Explore our latest collection of fashion, home, and beauty products. Quality guaranteed.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="flex items-center justify-center rounded-sm bg-[#1a1a1a] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-pink"
              >
                Shop now &rarr;
              </Link>
              <Link
                to="/products"
                className="flex items-center justify-center rounded-sm border border-gray-300 bg-white px-8 py-3 text-sm font-bold uppercase tracking-wider text-[#4a3b32] shadow-sm transition-colors hover:bg-gray-50"
              >
                View collection
              </Link>
            </div>
          </div>

          {/* Right Visuals */}
          <div className="relative flex h-[400px] w-full items-center justify-center lg:h-[500px] lg:w-1/2">
            
            {/* Abstract 3D shape approximations */}
            <div className="absolute top-8 z-10 h-48 w-48 md:h-64 md:w-64 rotate-12 transform rounded-3xl bg-gradient-to-br from-[#f2e7db] to-[#e6cfb8] shadow-2xl transition-transform hover:rotate-6"></div>
            <div className="absolute bottom-8 z-0 h-48 w-48 md:h-64 md:w-64 -rotate-6 transform rounded-3xl bg-gradient-to-tr from-[#f3aba3] to-[#faccc6] shadow-xl transition-transform hover:-rotate-12 translate-y-12 -translate-x-8"></div>

            {/* Floating Image Badges */}
            <div className="absolute top-10 left-4 md:left-10 z-20 h-16 w-16 md:h-20 md:w-20 -rotate-12 transform overflow-hidden rounded-xl border-4 border-white bg-gray-200 shadow-lg">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&q=80" alt="Fashion model" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-12 right-12 md:right-24 z-20 h-16 w-16 md:h-20 md:w-20 rotate-12 transform overflow-hidden rounded-xl border-4 border-white bg-gray-200 shadow-lg">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80" alt="Red shoe" className="h-full w-full object-cover" />
            </div>
            <div className="absolute right-0 top-1/2 z-20 h-14 w-14 md:h-16 md:w-16 rotate-6 transform overflow-hidden rounded-xl border-4 border-white bg-gray-200 shadow-lg">
              <img src="https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=150&q=80" alt="Accessories" className="h-full w-full object-cover" />
            </div>

            {/* Decorative background elements */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none text-orange-300 opacity-60" fill="none" viewBox="0 0 400 400">
              <path d="M 50 350 Q 200 450 350 250" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="80" cy="120" r="4" fill="#718096" />
              <path d="M 340 100 L 350 110 L 340 120 L 330 110 Z" fill="#718096" />
            </svg>
          </div>
        </div>
      </section>

      {/* Categories */}
      <Section title="Shop by category">
        <CategoryTiles products={products} />
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