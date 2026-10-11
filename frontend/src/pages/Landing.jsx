import { ArrowRight, Check, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductDiscovery from '../components/home/ProductDiscovery'

export default function Landing() {
  return (
    <div className="pb-4">
      <section className="relative overflow-hidden bg-[#fdfaf5]">
        <div className="mx-auto grid m  ax-w-7xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2 lg:gap-8">
          <div className="mx-auto relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
              Welcome to ShopEase
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-5xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-6xl">
              Find your next
              <span className="block text-pink">favorite thing.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-7 text-gray-600">
              Discover fresh styles, everyday essentials, and little things that make life better —
              all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-sm bg-gray-900 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand"
              >
                Shop now <ArrowRight size={16} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-sm border border-gray-300 bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-gray-800 transition-colors hover:border-brand hover:text-brand"
              >
                Create an account
              </Link>
            </div>
            <p className="mt-5 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand hover:underline">
                Sign in
              </Link>
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-700">
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-brand" /> Handpicked collections
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck size={17} className="text-brand" /> Delivered to your door
              </span>
            </div>
          </div>

          <div className="relative mx-auto flex h-[360px] w-full max-w-lg items-center justify-center sm:h-[460px]">
            <div className="absolute left-[12%] top-[7%] h-[72%] w-[62%] rotate-6 overflow-hidden rounded-3xl bg-[#e6cfb8] shadow-2xl">
              <img
                src="https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?q=80&w=687&auto=format&fit=crop"
                alt="A model wearing a contemporary outfit"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-[2%] right-[8%] h-[56%] w-[48%] -rotate-6 overflow-hidden rounded-3xl border-8 border-[#fdfaf5] bg-[#f3aba3] shadow-xl">
              <img
                src="https://plus.unsplash.com/premium_photo-1727942419945-1908baae3c8e?q=80&w=735&auto=format&fit=crop"
                alt="A curated fashion look"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-[12%] left-[1%] rounded-full bg-white px-4 py-3 text-sm font-bold text-gray-900 shadow-lg">
              New finds, every day
            </div>
          </div>
        </div>
      </section>

      <ProductDiscovery />
    </div>
  )
}
