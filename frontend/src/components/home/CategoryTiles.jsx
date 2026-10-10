import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../../api/productApi'


const TILES = [
  { label: 'Men', value: 'men', image: '/categories/man.png', fallback: 'from-sky-500 to-blue-700' },
  { label: 'Women', value: 'women', image: '/categories/women.png', fallback: 'from-pink-400 to-rose-600' },
  { label: 'Kids', value: 'kids', image: '/categories/kids.png', fallback: 'from-amber-400 to-orange-600' },
]

function pickImage(products, category) {
  const inCategory = products.filter((p) => p.category === category && p.images?.[0])
  const best = inCategory.find((p) => p.tags?.includes('trending')) ?? inCategory[0]
  return best?.images[0] ?? null
}

export default function CategoryTiles({ products: provided }) {
  const [fetched, setFetched] = useState([])

  useEffect(() => {
    if (provided) return
    let ignore = false

    fetchProducts({ limit: 50 })
      .then((res) => {
        if (!ignore) setFetched(res.data)
      })
      .catch(() => {
      })

    return () => {
      ignore = true
    }
  }, [provided])

  const products = provided ?? fetched

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {TILES.map((tile) => {
        const src = tile.image ?? pickImage(products, tile.value)

        return (
          <Link
            key={tile.value}
            to={`/products?category=${tile.value}`}
            className={`group relative block h-64 overflow-hidden rounded-lg bg-linear-to-br sm:h-80 ${tile.fallback}`}
          >
            {src && (
              <img
                src={src}
                alt=""
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
                className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
            )}

            {/* Dark fade so the text is readable on any photo */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
              <span className="text-3xl font-extrabold text-white">{tile.label}</span>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase text-gray-900 transition group-hover:bg-brand group-hover:text-white">
                Shop now →
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}