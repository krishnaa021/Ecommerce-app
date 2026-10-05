import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid'
import Pagination from '../components/common/Pagination'
import { fetchProducts } from '../api/productAPI'

const LIMIT = 12

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const category = searchParams.get('category') ?? ''
  const search = searchParams.get('search') ?? ''
  const sort = searchParams.get('sort') ?? ''
  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')

    fetchProducts({ category, search, sort, page, limit: LIMIT })
      .then((res) => {
        if (ignore) return
        setProducts(res.data)
        setTotalPages(res.totalPages)
        setTotalCount(res.totalCount)
      })
      .catch((err) => {
        if (ignore) return
        const status = err.response?.status
        setError(
          status && status < 500
            ? err.response.data?.message
            : 'Something went wrong on our side. Please try again in a moment.'
        )
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [category, search, sort, page])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    if (key !== 'page') next.delete('page') // For resetting page to 1 when something changes
    setSearchParams(next)
  }

  const changePage = (p) => {
    updateParam('page', String(p))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const heading = search ? `Results for "${search}"` : category || 'All products'

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold capitalize text-gray-800">{heading}</h1>
          {!loading && !error && (
            <p className="text-sm text-gray-500">{totalCount} items</p>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Sort by: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
        )}

        {error && <p className="py-16 text-center text-red-600">{error}</p>}

        {!loading && !error && <ProductGrid products={products} />}
      </div>

      {!loading && !error && (
        <Pagination page={page} totalPages={totalPages} onChange={changePage} />
      )}
    </div>
  )
}