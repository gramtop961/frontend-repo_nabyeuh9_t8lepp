import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { ShoppingCart, Star, ShieldCheck, Menu, Search, Heart, Package, BadgeCheck, Moon, Sun } from 'lucide-react'
import { apiGet, apiPost, apiPut } from './lib/api'
import './index.css'

function useDarkMode() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('delicassy_dark') === '1')
  useEffect(() => {
    const root = document.documentElement
    if (enabled) {
      root.classList.add('dark')
      localStorage.setItem('delicassy_dark', '1')
    } else {
      root.classList.remove('dark')
      localStorage.removeItem('delicassy_dark')
    }
  }, [enabled])
  return [enabled, setEnabled]
}

function Shell({ children, onSearch }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [dark, setDark] = useDarkMode()
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => setOpen(v => !v)}>
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="font-semibold text-xl tracking-tight">Delicassy</Link>
            <span className="hidden md:inline text-xs text-zinc-500 dark:text-zinc-400 ml-2">25 years of elegant craftsmanship</span>
          </div>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { onSearch?.(query); nav('/'); } }} placeholder="Search fragile treasures..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Toggle theme">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/cart" className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 relative">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-zinc-200/60 dark:border-zinc-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="font-semibold mb-2">Delicassy</div>
            <p className="text-zinc-600 dark:text-zinc-400">Refined, handcrafted pieces. Packed with care. Delivered with confidence.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Company</div>
            <div className="space-y-2">
              <Link className="block hover:underline" to="/about">About Us</Link>
              <Link className="block hover:underline" to="/packaging">Safety & Packaging</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Collections</div>
            <div id="collections" className="space-y-2" />
          </div>
          <div>
            <div className="font-semibold mb-2">Stay Updated</div>
            <p className="text-zinc-600 dark:text-zinc-400">Get restock alerts and new collection announcements.</p>
          </div>
        </div>
        <div className="text-center text-xs text-zinc-500 py-4">© {new Date().getFullYear()} Delicassy</div>
      </footer>
    </div>
  )
}

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
      <ShieldCheck className="w-4 h-4" />
      <span>Seller Assurance • 25 Years</span>
    </div>
  )
}

function Catalog() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    apiGet('/api/categories').then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const q = query ? `?q=${encodeURIComponent(query)}` : ''
    apiGet(`/api/products${q}`).then(setProducts).catch(() => setProducts([]))
  }, [query])

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured Collections</h2>
          <Badge />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(c => (
            <Link key={c.slug} to={`/?category=${c.slug}`} className="group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-sm">
              <div className="aspect-[4/3] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800" />
              <div className="p-3 flex items-center justify-between">
                <div className="font-medium">{c.name}</div>
                <Package className="w-4 h-4 text-zinc-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Catalog</h3>
          <div className="text-xs text-zinc-500">High-res imagery • Fragility-aware shipping</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p => (
            <Link key={p.slug} to={`/product/${p.slug}`} className="group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-sm">
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 relative">
                <div className="absolute top-2 left-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded-full px-2 py-1 text-xs">Fragility {p.fragility_rating}/5</div>
              </div>
              <div className="p-3">
                <div className="font-medium truncate">{p.title}</div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-zinc-600 dark:text-zinc-400">${p.price.toFixed(2)}</div>
                  <button className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><Heart className="w-4 h-4" /></button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const nav = useNavigate()

  useEffect(() => {
    apiGet(`/api/products/${slug}`).then(setProduct)
  }, [slug])

  const addToCart = async () => {
    const existing = localStorage.getItem('cart_id')
    let cartId = existing
    if (!cartId) {
      const created = await apiPost('/api/cart/init', { items: [] })
      cartId = created.id
      localStorage.setItem('cart_id', cartId)
    }
    const cart = await apiGet(`/api/cart/${cartId}`)
    const items = [...(cart.items || [])]
    const idx = items.findIndex(i => i.product_id === product._id)
    if (idx >= 0) items[idx].quantity += qty
    else items.push({ product_id: product._id, quantity: qty })
    await apiPut(`/api/cart/${cartId}`, { items })
    nav('/cart')
  }

  if (!product) return <div className="max-w-4xl mx-auto p-6">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-square bg-zinc-100 dark:bg-zinc-900" />
      <div>
        <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
        <Badge />
        <div className="mt-4 text-3xl font-semibold">${product.price?.toFixed(2)}</div>
        <div className="mt-2 text-zinc-600 dark:text-zinc-400">Fragility {product.fragility_rating}/5</div>
        <p className="mt-4 leading-7 text-zinc-700 dark:text-zinc-300">{product.description}</p>
        {product.handling_instructions && (
          <div className="mt-4 text-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded">
            <strong>Handling:</strong> {product.handling_instructions}
          </div>
        )}

        <div className="mt-6 flex items-center gap-2">
          <input type="number" min={1} value={qty} onChange={e => setQty(parseInt(e.target.value)||1)} className="w-20 px-3 py-2 rounded border border-zinc-200 dark:border-zinc-800 bg-transparent" />
          <button onClick={addToCart} className="px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Add to cart</button>
        </div>

        <div className="mt-8">
          <div className="font-semibold mb-2">Customer Reviews</div>
          <div className="space-y-3">
            {(product.reviews || []).map((r, i) => (
              <div key={i} className="p-3 rounded border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-amber-500">{Array.from({ length: r.rating }).map((_,i)=>(<Star key={i} className="w-4 h-4 fill-current" />))}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{r.comment}</div>
                <div className="text-xs text-zinc-500 mt-1">— {r.user_name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CartPage() {
  const [cart, setCart] = useState(null)
  const [summary, setSummary] = useState(null)

  const refresh = async () => {
    const cartId = localStorage.getItem('cart_id')
    if (!cartId) return setCart({ items: [] })
    const c = await apiGet(`/api/cart/${cartId}`)
    setCart(c)
  }

  useEffect(() => { refresh() }, [])

  const updateQty = async (idx, qty) => {
    const items = cart.items.slice()
    items[idx].quantity = qty
    await apiPut(`/api/cart/${cart._id}`, { items })
    refresh()
  }

  const checkout = async () => {
    const cartId = cart._id
    const res = await apiPost('/api/checkout', {
      cart_id: cartId,
      shipping_address: {
        full_name: 'Delicassy Guest',
        line1: '123 Craft Ln', city: 'Artisan', postal_code: '00000', country: 'US'
      },
      payment: { method: 'card', token: 'test' },
      insured: true,
      premium_packaging: true,
    })
    setSummary(res)
  }

  if (!cart) return <div className="max-w-4xl mx-auto p-6">Your cart is empty.</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {(cart.items || []).map((it, idx) => (
            <div key={idx} className="p-3 rounded border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="text-sm">{it.product_id}</div>
              <input type="number" min={1} value={it.quantity} onChange={e => updateQty(idx, parseInt(e.target.value)||1)} className="w-20 px-3 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-transparent" />
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 h-fit">
          <div className="font-semibold mb-2">Summary</div>
          <button onClick={checkout} className="w-full px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Secure Checkout</button>
          {summary && (
            <div className="text-sm mt-3">
              <div>Order: {summary.order_id}</div>
              <div>Total: ${summary.amount_total}</div>
              <div className="text-emerald-600 flex items-center gap-2 mt-2"><BadgeCheck className="w-4 h-4" /> Protected shipment</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PackagingPage() {
  const [guides, setGuides] = useState([])
  useEffect(() => { apiGet('/api/packaging').then(setGuides) }, [])
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Safety & Packaging</h1>
      <p className="text-zinc-600 dark:text-zinc-400">We use multi-layer protection, shock indicators, and climate-aware packaging. Upgrade to premium for museum-grade crates.</p>
      <div className="mt-6 space-y-4">
        {guides.map((g, i) => (
          <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="font-medium">{g.title}</div>
            <div className="prose prose-zinc dark:prose-invert mt-2 text-sm whitespace-pre-wrap">{g.content_md}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AboutPage() {
  const [about, setAbout] = useState(null)
  useEffect(() => { apiGet('/api/about').then(setAbout) }, [])
  if (!about) return null
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold">About Delicassy</h1>
      <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">{about.headline}</p>
      <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">{about.story}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {(about.badges||[]).map((b,i)=>(<span key={i} className="px-3 py-1 rounded-full text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">{b}</span>))}
      </div>
    </div>
  )
}

function Home() {
  const [search, setSearch] = useState('')
  return (
    <Shell onSearch={setSearch}>
      <Hero />
      <Catalog key={search} />
    </Shell>
  )
}

function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-xs tracking-widest text-zinc-500">DELICATE ARTISAN OBJECTS</div>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold leading-tight">Elegance, handled with grace.</h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Discover handcrafted glassware, ceramics, collectibles and luxury décor—protected from our hands to yours.</p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="#collections" className="px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Browse Catalog</Link>
            <Link to="/about" className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800">Our Story</Link>
          </div>
        </div>
        <div className="aspect-square rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-800" />
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:slug" element={<Shell><ProductPage /></Shell>} />
        <Route path="/cart" element={<Shell><CartPage /></Shell>} />
        <Route path="/packaging" element={<Shell><PackagingPage /></Shell>} />
        <Route path="/about" element={<Shell><AboutPage /></Shell>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
