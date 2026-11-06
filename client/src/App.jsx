import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, UserRound, ChevronDown, Menu, X, Plus, Minus, Trash2, Truck, ShieldCheck, Headphones, Heart, ArrowRight, PackageCheck } from "lucide-react";

const API = "http://localhost:4000/api";
const money = (n) => "₦" + Number(n).toLocaleString("en-NG");
const fallbackImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80";

function Header({ query, setQuery, cartCount, onCart }) {
  return <>
    <div className="bg-brand text-white text-xs"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2"><span>ShopNaija — great deals, delivered to your door</span><span className="hidden sm:block">Sell on ShopNaija · Help centre</span></div></div>
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
        <button className="md:hidden" aria-label="Open menu"><Menu /></button>
        <a href="#" className="shrink-0 text-2xl font-black tracking-tight text-brand">shop<span className="text-ink">naija</span><span className="text-brand">.</span></a>
        <div className="hidden flex-1 md:flex">
          <div className="flex w-full items-center rounded-md border border-gray-300 px-3 focus-within:border-brand">
            <Search className="text-gray-400" size={19} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products, brands and categories" className="w-full border-0 px-3 py-3 outline-none" />
            <button className="rounded bg-brand px-6 py-2 font-semibold text-white hover:bg-orange-600">SEARCH</button>
          </div>
        </div>
        <button className="hidden items-center gap-2 font-semibold sm:flex"><UserRound size={20}/> Account <ChevronDown size={15}/></button>
        <button onClick={onCart} className="relative flex items-center gap-2 font-semibold"><ShoppingCart size={23}/><span className="hidden sm:inline">Cart</span>{cartCount > 0 && <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs text-white">{cartCount}</span>}</button>
      </div>
      <div className="border-t px-4 py-2 md:hidden"><div className="mx-auto flex max-w-7xl items-center rounded border px-3"><Search size={18} className="text-gray-400"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="w-full px-2 py-2 outline-none"/></div></div>
    </header>
  </>;
}

function ProductCard({ product, add, open }) {
  return <article className="group overflow-hidden rounded bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
    <button onClick={() => open(product)} className="relative block aspect-square w-full overflow-hidden bg-gray-100">
      <img src={product.image || fallbackImage} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" onError={e => {e.currentTarget.src=fallbackImage}}/>
      {product.discount > 0 && <span className="absolute left-2 top-2 rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">-{product.discount}%</span>}
      <span className="absolute right-2 top-2 rounded-full bg-white p-2 text-gray-500"><Heart size={16}/></span>
    </button>
    <div className="p-3">
      <button onClick={() => open(product)} className="line-clamp-2 min-h-10 text-left text-sm hover:text-brand">{product.name}</button>
      <p className="mt-2 text-lg font-bold">{money(product.price)}</p>
      {product.oldPrice > product.price && <p className="text-xs text-gray-400 line-through">{money(product.oldPrice)}</p>}
      <div className="mt-3 flex items-center justify-between"><span className="text-xs text-amber-500">★★★★★ <span className="text-gray-400">({product.rating})</span></span><button onClick={() => add(product)} className="rounded bg-brand px-3 py-2 text-xs font-bold text-white hover:bg-orange-600">ADD TO CART</button></div>
    </div>
  </article>;
}

function CartDrawer({ open, onClose, cart, update, remove, checkout }) {
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [showCheckout, setShowCheckout] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  useEffect(() => { if (!open) setShowCheckout(false); }, [open]);
  if (!open) return null;
  const change = e => setCustomer({ ...customer, [e.target.name]: e.target.value });
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onMouseDown={onClose}>
    <aside onMouseDown={e => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b p-5"><h2 className="text-xl font-bold">Your cart ({cart.length})</h2><button onClick={onClose}><X/></button></div>
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {cart.length === 0 ? <div className="py-16 text-center text-gray-500"><ShoppingCart className="mx-auto mb-3" size={40}/><p>Your cart is empty.</p></div> : cart.map(item => <div key={item.id} className="flex gap-3 border-b pb-4">
          <img src={item.image || fallbackImage} className="h-20 w-20 rounded object-cover" alt=""/>
          <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-semibold">{item.name}</p><p className="mt-1 font-bold">{money(item.price)}</p><div className="mt-2 flex items-center gap-3"><button onClick={() => update(item.id, item.quantity-1)} className="rounded border p-1"><Minus size={14}/></button><span>{item.quantity}</span><button onClick={() => update(item.id, item.quantity+1)} className="rounded border p-1"><Plus size={14}/></button><button onClick={() => remove(item.id)} className="ml-auto text-red-500"><Trash2 size={17}/></button></div></div>
        </div>)}
        {showCheckout && <form id="checkout-form" onSubmit={e => {e.preventDefault(); checkout(customer);}} className="space-y-3 rounded bg-gray-50 p-4"><h3 className="font-bold">Delivery details</h3>{[["name","Full name"],["email","Email address"],["phone","Phone number"],["address","Delivery address"]].map(([name,label])=><input key={name} required name={name} value={customer[name]} onChange={change} placeholder={label} className="w-full rounded border bg-white px-3 py-2 text-sm"/>) }<p className="text-xs text-gray-500">Demo checkout only. No payment is collected.</p></form>}
      </div>
      <div className="border-t p-5"><div className="mb-4 flex justify-between text-lg font-bold"><span>Subtotal</span><span>{money(total)}</span></div>{showCheckout ? <button form="checkout-form" disabled={!cart.length} className="w-full rounded bg-brand py-3 font-bold text-white disabled:opacity-50">PLACE DEMO ORDER</button> : <button onClick={() => setShowCheckout(true)} disabled={!cart.length} className="w-full rounded bg-brand py-3 font-bold text-white disabled:opacity-50">CHECKOUT</button>}</div>
    </aside>
  </div>;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("shopnaija-cart") || "[]"));
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch(`${API}/products`), fetch(`${API}/categories`)])
      .then(async ([p,c]) => { if (!p.ok || !c.ok) throw new Error("Could not load store data"); return [await p.json(), await c.json()]; })
      .then(([p,c]) => { setProducts(p); setCategories(c); })
      .catch(() => setError("We couldn't connect to the store API. Make sure the backend is running on port 4000."))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { localStorage.setItem("shopnaija-cart", JSON.stringify(cart)); }, [cart]);
  const filtered = useMemo(() => products.filter(p => (category === "All" || p.category === category) && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase())), [products, category, query]);
  const add = product => { setCart(old => { const found=old.find(x=>x.id===product.id); return found ? old.map(x=>x.id===product.id?{...x,quantity:x.quantity+1}:x) : [...old,{...product,quantity:1}]; }); setNotice(`${product.name} added to cart`); setTimeout(()=>setNotice(""),2200); };
  const update = (id, quantity) => setCart(old => quantity <= 0 ? old.filter(x=>x.id!==id) : old.map(x=>x.id===id?{...x,quantity}:x));
  const remove = id => setCart(old=>old.filter(x=>x.id!==id));
  const checkout = async customer => {
    try {
      const response = await fetch(`${API}/orders`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({customer,items:cart.map(({id,quantity})=>({productId:id,quantity}))}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Order failed");
      setCart([]); setCartOpen(false); setNotice(`Order #${data.orderId} placed successfully!`); setTimeout(()=>setNotice(""),5000);
    } catch(e) { setNotice(e.message); }
  };
  const cartCount = cart.reduce((s,i)=>s+i.quantity,0);
  return <div className="min-h-screen">
    <Header query={query} setQuery={setQuery} cartCount={cartCount} onCart={()=>setCartOpen(true)}/>
    <main className="mx-auto max-w-7xl px-4 pb-12 pt-5">
      <div className="grid gap-4 lg:grid-cols-[230px_1fr]">
        <aside className="hidden rounded bg-white p-4 shadow-soft lg:block"><h2 className="mb-3 font-bold">Categories</h2><div className="space-y-1">{["All",...categories].map(c=><button key={c} onClick={()=>setCategory(c)} className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-orange-50 hover:text-brand ${category===c?"bg-orange-50 font-bold text-brand":""}`}>{c}</button>)}</div></aside>
        <section className="relative flex min-h-56 flex-col justify-center overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 p-7 text-white sm:min-h-72 sm:p-12">
          <div className="relative z-10 max-w-lg"><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">The big everyday sale</span><h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Good deals.<br/>Great everyday living.</h1><p className="mt-3 max-w-sm text-sm text-white/90 sm:text-base">Discover electronics, fashion, home essentials and more — all in one place.</p><button onClick={()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"})} className="mt-6 inline-flex items-center gap-2 rounded bg-white px-5 py-3 font-bold text-brand">Shop now <ArrowRight size={17}/></button></div>
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full border-[35px] border-white/15 sm:right-10 sm:h-96 sm:w-96"/><div className="pointer-events-none absolute bottom-[-90px] right-24 h-64 w-64 rounded-full bg-white/15"/>
        </section>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="flex items-center gap-3 rounded bg-white p-4 shadow-soft"><Truck className="text-brand"/><div><p className="text-sm font-bold">Convenient delivery</p><p className="text-xs text-gray-500">To your doorstep</p></div></div><div className="flex items-center gap-3 rounded bg-white p-4 shadow-soft"><ShieldCheck className="text-brand"/><div><p className="text-sm font-bold">Shop with confidence</p><p className="text-xs text-gray-500">A simple demo storefront</p></div></div><div className="flex items-center gap-3 rounded bg-white p-4 shadow-soft"><Headphones className="text-brand"/><div><p className="text-sm font-bold">Here to help</p><p className="text-xs text-gray-500">Customer-first experience</p></div></div></div>
      <section id="products" className="mt-7">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-brand">Picked for you</p><h2 className="text-2xl font-bold">{category==="All"?"Top deals":category}</h2></div><span className="text-sm text-gray-500">{filtered.length} products</span></div>
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">{["All",...categories].map(c=><button key={c} onClick={()=>setCategory(c)} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${category===c?"border-brand bg-brand text-white":"bg-white"}`}>{c}</button>)}</div>
        {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? <p className="rounded bg-white p-10 text-center">Loading products…</p> : filtered.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{filtered.map(p=><ProductCard key={p.id} product={p} add={add} open={setSelected}/>)}</div> : <div className="rounded bg-white p-12 text-center text-gray-500">No products match your search.</div>}
      </section>
    </main>
    <footer className="bg-[#282828] text-white"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-2xl font-black text-brand">shopnaija.</p><p className="mt-3 max-w-xs text-sm text-gray-400">A demo marketplace experience built for learning full-stack development.</p></div><div><h3 className="font-bold">Let us help you</h3><p className="mt-3 text-sm text-gray-400">Help centre</p><p className="mt-2 text-sm text-gray-400">How to shop</p></div><div><h3 className="font-bold">About ShopNaija</h3><p className="mt-3 text-sm text-gray-400">About us</p><p className="mt-2 text-sm text-gray-400">Terms and conditions</p></div><div><h3 className="font-bold">Shopping made simple</h3><p className="mt-3 text-sm text-gray-400">Browse products, add to cart and place a demo order.</p></div></div><div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">© 2026 ShopNaija. Independent demo project; not affiliated with Jumia.</div></footer>
    {notice && <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded bg-gray-900 px-5 py-3 text-sm text-white shadow-xl">{notice}</div>}
    <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} cart={cart} update={update} remove={remove} checkout={checkout}/>
    {selected && <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onMouseDown={()=>setSelected(null)}><div onMouseDown={e=>e.stopPropagation()} className="relative grid w-full max-w-2xl gap-5 rounded-lg bg-white p-5 sm:grid-cols-2"><button onClick={()=>setSelected(null)} className="absolute right-3 top-3 rounded-full bg-gray-100 p-2"><X size={18}/></button><img src={selected.image || fallbackImage} alt={selected.name} className="aspect-square w-full rounded object-cover"/><div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase text-brand">{selected.category}</p><h2 className="mt-2 text-2xl font-bold">{selected.name}</h2><p className="mt-3 text-sm leading-6 text-gray-500">{selected.description}</p><p className="mt-5 text-2xl font-black">{money(selected.price)}</p><button onClick={()=>{add(selected);setSelected(null)}} className="mt-5 rounded bg-brand py-3 font-bold text-white">ADD TO CART</button></div></div></div>}
  </div>;
}