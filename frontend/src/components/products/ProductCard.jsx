// src/components/product/ProductCard.jsx

export default function ProductCard({ product }) {
  return (
    <>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
        <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full rounded-lg object-cover"
        />
        <h3 className="mt-3 text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-brand font-bold">₹{product.price}</p>
        <button className="mt-3 w-full rounded-lg bg-brand py-2 text-white hover:bg-brand-dark">
            Add to cart
        </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
    </>
    
    
  )
}