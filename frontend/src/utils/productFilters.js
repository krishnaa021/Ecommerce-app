export const PRICE_RANGES = [
  { value: '0-1000', label: 'Under ₹1,000' },
  { value: '1000-2000', label: '₹1,000 to ₹1,999' },
  { value: '2000-3000', label: '₹2,000 to ₹2,999' },
  { value: '3000-', label: '₹3,000 and above' },
]

export const RATING_OPTIONS = [4, 3, 2]

export const SORT_OPTIONS = [
  { value: '', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer rating' },
  { value: 'discount', label: 'Better discount' },
]

export const discountOf = (p) =>
  p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0

const inPriceRange = (price, range) => {
  if (!range) return true
  const [min, max] = range.split('-')
  return price >= Number(min) && (max === '' || price < Number(max))
}

export function applyFilters(products, { subCategories, brands, price, rating }) {
  return products.filter(
    (p) =>
      (subCategories.length === 0 || subCategories.includes(p.subCategory.toLowerCase())) &&
      (brands.length === 0 || brands.includes(p.brand)) &&
      inPriceRange(p.price, price) &&
      (!rating || p.rating >= rating)
  )
}

const sorters = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  discount: (a, b) => discountOf(b) - discountOf(a),
}

export const sortProducts = (products, sort) =>
  sorters[sort] ? [...products].sort(sorters[sort]) : products

export function countBy(products, key) {
  const counts = {}
  for (const p of products) counts[p[key]] = (counts[p[key]] ?? 0) + 1
  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value))
}