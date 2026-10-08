import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductGrid from '../components/products/ProductGrid'
import Pagination from '../components/common/Pagination'
import FilterSidebar from '../components/products/FilterSidebar'
import { fetchProducts } from '../api/productApi'
import {
  PRICE_RANGES,
  SORT_OPTIONS,
  applyFilters,
  countBy,
  sortProducts,
} from '../utils/productFilters'

const FETCH_LIMIT = 100 
const PAGE_SIZE = 10 

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [result, setResult] = useState({ key: null, products: [], error: '' })
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = searchParams.get('category') ?? ''
  const search = searchParams.get('search') ?? ''
  const sort = searchParams.get('sort') ?? ''
  const page = Number(searchParams.get('page')) || 1
  const subCategories = searchParams.getAll('subCategory')
  const brands = searchParams.getAll('brand')
  const price = searchParams.get('price') ?? ''
  const rating = Number(searchParams.get('rating')) || 0

  const requestKey = `${category}|${search}`

  useEffect(() => {
    let ignore = false

    fetchProducts({ category, search, limit: FETCH_LIMIT })
      .then((res) => {
        if (!ignore) setResult({ key: requestKey, products: res.data, error: '' })
      })
      .catch((err) => {
        if (ignore) return
        const status = err.response?.status
        setResult({
          key: requestKey,
          products: [],
          error:
            status && status < 500
              ? err.response.data?.message
              : 'Something went wrong on our side. Please try again in a moment.',
        })
      })

    return () => {
      ignore = true
    }
  }, [category, search, requestKey])

  const loading = result.key !== requestKey
  const error = loading ? '' : result.error
  const allProducts = loading ? [] : result.products

  const selected = {
    subCategories: subCategories.map((s) => s.toLowerCase()),
    brands,
    price,
    rating,
  }
  const filtered = applyFilters(allProducts, selected)
  const sorted = sortProducts(filtered, sort)

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const subCategoryFacets = countBy(allProducts, 'subCategory')
  const brandFacets = countBy(allProducts, 'brand')

  const update = (mutate) => {
    const next = new URLSearchParams(searchParams)
    mutate(next)
    next.delete('page')
    setSearchParams(next)
  }

  const setParam = (key, value) =>
    update((n) => {
      if (value) n.set(key, value)
      else n.delete(key)
    })

  const toggleParam = (key, value) =>
    update((n) => {
      const current = n.getAll(key)
      n.delete(key)
      const nextValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      nextValues.forEach((v) => n.append(key, v))
    })

  const clearFilters = () =>
    update((n) => {
      ;['subCategory', 'brand', 'price', 'rating'].forEach((k) => n.delete(k))
    })

  const changePage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const chips = [
    ...subCategories.map((v) => ({ key: 'subCategory', value: v, label: v, multi: true })),
    ...brands.map((v) => ({ key: 'brand', value: v, label: v, multi: true })),
    ...(price
      ? [{ key: 'price', value: price, label: PRICE_RANGES.find((r) => r.value === price)?.label ?? price }]
      : []),
    ...(rating ? [{ key: 'rating', value: String(rating), label: `${rating}★ & above` }] : []),
  ]
  const removeChip = (chip) =>
    chip.multi ? toggleParam(chip.key, chip.value) : setParam(chip.key, '')

  const sidebar = (
    <FilterSidebar
      subCategoryFacets={subCategoryFacets}
      brandFacets={brandFacets}
      selected={selected}
      onToggle={toggleParam}
      onSet={setParam}
      onClear={clearFilters}
      hasActive={chips.length > 0}
    />
  )

  const heading = search ? `Results for "${search}"` : category || 'All products'

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Title row */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold capitalize text-gray-800">{heading}</h1>
          {!loading && !error && (
            <p className="text-sm text-gray-500">{sorted.length} items</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters{chips.length > 0 && ` (${chips.length})`}
          </button>

          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Sort by: {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={`${chip.key}-${chip.value}`}
              type="button"
              onClick={() => removeChip(chip)}
              className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:border-brand hover:text-brand"
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold uppercase text-brand hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-6 flex gap-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 lg:block">{sidebar}</aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          {loading && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-md bg-gray-200" />
              ))}
            </div>
          )}

          {error && <p className="py-16 text-center text-red-600">{error}</p>}

          {!loading && !error && sorted.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-600">No products match your filters.</p>
              {chips.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 font-semibold text-brand hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {!loading && !error && sorted.length > 0 && <ProductGrid products={pageItems} />}

          {!loading && !error && (
            <Pagination page={currentPage} totalPages={totalPages} onChange={changePage} />
          )}
        </div>
      </div>

      {/* Filter drawer (mobile) */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="font-bold text-gray-800">Filters</h2>
            <button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4">{sidebar}</div>
          <div className="border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="w-full rounded-md bg-brand py-3 font-bold uppercase text-white hover:bg-brand-dark"
            >
              Show {sorted.length} items
            </button>
          </div>
        </div>
      )}
    </div>
  )
}