import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Heart, Minus, Plus, Truck } from "lucide-react";
import { toast } from "sonner";
import { formatUSD, gallery, getProduct, isSoldOut, products } from "@/data/products";
import { useStore } from "@/lib/store";
import { FREE_SHIPPING_THRESHOLD, MAX_QTY } from "@/lib/pricing";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/components/page-meta";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData ? getProduct(loaderData.slug) : undefined;
    if (!p) return { meta: [{ title: "Product unavailable — NOVA Store Demo" }, { name: "robots", content: "noindex" }] };
    return pageMeta(p.name, `${p.tagline}. ${p.description}`, `/product/${params.slug}`);
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl">Product not found</h1>
      <p className="mt-3 text-muted-foreground">It may have been retired from the collection.</p>
      <Button asChild className="mt-6"><Link to="/shop">Back to shop</Link></Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  return <ProductDetail key={slug} slug={slug} />;
}

function ProductDetail({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const navigate = useNavigate();
  const { add, wishlist, toggleWish } = useStore();
  const views = gallery(product);
  const [view, setView] = useState(0);
  const current = views[view] ?? views[0];
  const firstAvailable = product.variants.find((v) => !v.soldOut)?.label ?? product.variants[0]?.label ?? "";
  const [variant, setVariant] = useState(firstAvailable);
  const [qty, setQty] = useState(1);
  const soldOut = isSoldOut(product, variant);
  const maxQty = Math.min(MAX_QTY, product.stock);
  const wished = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).concat(products.filter((p) => p.bestseller && p.category !== product.category)).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/shop" className="hover:text-foreground">Shop</Link> /{" "}
        <Link to="/shop" search={{ cat: product.category }} className="capitalize hover:text-foreground">{product.category}</Link> / <span className="text-foreground">{product.name}</span>
      </nav>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
            {current && <img src={current.src} alt={current.alt} className="size-full object-cover transition-transform duration-300" style={{ objectPosition: current.position, transform: `scale(${current.zoom})`, transformOrigin: current.position }} />}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3" role="group" aria-label="Product images">
            {views.map((v, i) => (
              <button key={i} onClick={() => setView(i)} aria-label={`Show image ${i + 1}: ${v.alt}`} aria-pressed={view === i}
                className={cn("aspect-square overflow-hidden rounded-lg border-2", view === i ? "border-foreground" : "border-transparent")}>
                <img src={v.src} alt="" className="size-full object-cover" style={{ objectPosition: v.position, transform: `scale(${v.zoom})`, transformOrigin: v.position }} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-sage uppercase">{product.category}</p>
          <h1 className="mt-2 text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>
          <p className="mt-5 text-2xl font-semibold">{formatUSD(product.price)}{product.compareAt && <span className="ml-2 text-lg font-normal text-muted-foreground line-through">{formatUSD(product.compareAt)}</span>}</p>
          <p className="mt-5 leading-relaxed">{product.description}</p>

          <fieldset className="mt-8">
            <legend className="text-sm font-semibold">{product.variantName}: <span className="font-normal">{variant}</span></legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button key={v.label} onClick={() => { setVariant(v.label); setQty(1); }} aria-pressed={variant === v.label}
                  className={cn("rounded-full border px-4 py-2 text-sm", variant === v.label ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground", v.soldOut && "line-through opacity-60")}>
                  {v.label}{v.soldOut && <span className="sr-only"> (sold out)</span>}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex h-11 items-center rounded-md border bg-card">
              <button className="grid size-11 place-items-center disabled:opacity-40" aria-label="Decrease quantity" disabled={qty <= 1 || soldOut} onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="size-4" /></button>
              <span className="w-8 text-center" aria-live="polite" aria-label={`Quantity ${qty}`}>{qty}</span>
              <button className="grid size-11 place-items-center disabled:opacity-40" aria-label="Increase quantity" disabled={qty >= maxQty || soldOut} onClick={() => setQty((q) => Math.min(maxQty, q + 1))}><Plus className="size-4" /></button>
            </div>
            <Button size="lg" className="h-11 flex-1" disabled={soldOut} onClick={() => {
              const r = add(product.id, variant, qty);
              if (r.ok) toast.success(r.message, { action: { label: "View cart", onClick: () => { void navigate({ to: "/cart" }); } } }); else toast.error(r.message);
            }}>{soldOut ? "Sold out" : "Add to cart"}</Button>
            <Button size="lg" variant="outline" className="h-11" aria-pressed={wished} aria-label={wished ? "Remove from wishlist" : "Save to wishlist"} onClick={() => { const a = toggleWish(product.id); toast(a ? "Saved to wishlist" : "Removed from wishlist"); }}>
              <Heart className={cn("size-4", wished && "fill-foreground")} />
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {product.stock <= 0 ? "Currently sold out." : product.stock <= 5 ? `Only ${product.stock} left in stock.` : "In stock, ready to ship."}
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm"><Truck className="size-4" /> Free standard shipping on orders over {formatUSD(FREE_SHIPPING_THRESHOLD)} (demo).</p>

          <h2 className="mt-10 font-sans text-sm font-semibold">Features</h2>
          <ul className="mt-3 space-y-2">{product.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 text-sage" />{f}</li>)}</ul>
          <h2 className="mt-8 font-sans text-sm font-semibold">Specifications</h2>
          <dl className="mt-3 divide-y border-y text-sm">
            {product.specs.map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </div>
      <section className="mt-24">
        <h2 className="mb-8 text-3xl">You may also like</h2>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>
    </div>
  );
}
