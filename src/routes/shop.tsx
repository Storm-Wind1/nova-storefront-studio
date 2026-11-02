import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { categories, products, type CategoryId } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageMeta } from "@/components/page-meta";

const SORTS = { featured: "Featured", newest: "Newest", "price-asc": "Price: low to high", "price-desc": "Price: high to low", name: "Name A–Z" } as const;
type Sort = keyof typeof SORTS;
const PRICES = { any: "Any price", "50": "Under $50", "100": "Under $100", "200": "Under $200" } as const;

interface ShopSearch { q?: string; cat?: CategoryId; max?: string; avail?: boolean; sort?: Sort }

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    q: typeof s.q === "string" && s.q ? s.q.slice(0, 80) : undefined,
    cat: categories.some((c) => c.id === s.cat) ? (s.cat as CategoryId) : undefined,
    max: typeof s.max === "string" && s.max in PRICES && s.max !== "any" ? s.max : undefined,
    avail: s.avail === true || s.avail === "true" ? true : undefined,
    sort: typeof s.sort === "string" && s.sort in SORTS ? (s.sort as Sort) : undefined,
  }),
  head: () => pageMeta("Shop all", "Browse 16 NOVA concept products across audio, workspace, power and carry. Search, filter and sort.", "/shop"),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const set = (patch: Partial<ShopSearch>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const results = useMemo(() => {
    const q = (search.q ?? "").toLowerCase().trim();
    let list = products.filter((p) =>
      (!q || `${p.name} ${p.tagline} ${p.category} ${p.description}`.toLowerCase().includes(q)) &&
      (!search.cat || p.category === search.cat) &&
      (!search.max || p.price < Number(search.max)) &&
      (!search.avail || p.stock > 0));
    const s = search.sort ?? "featured";
    list = [...list].sort((a, b) =>
      s === "price-asc" ? a.price - b.price : s === "price-desc" ? b.price - a.price : s === "name" ? a.name.localeCompare(b.name) :
      s === "newest" ? b.addedAt.localeCompare(a.addedAt) : Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [search]);

  const active = !!(search.q || search.cat || search.max || search.avail);
  const selectCls = "h-10 rounded-md border bg-card px-3 text-sm";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{search.cat ? categories.find((c) => c.id === search.cat)?.name : "Shop all"}</h1>
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search aria-hidden className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="shop-q" className="sr-only">Search products</label>
          <Input id="shop-q" type="search" placeholder="Search products…" value={search.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} className="h-10 bg-card pl-9" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="f-cat">Category</label>
          <select id="f-cat" className={selectCls} value={search.cat ?? ""} onChange={(e) => set({ cat: (e.target.value || undefined) as CategoryId | undefined })}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className="sr-only" htmlFor="f-price">Price</label>
          <select id="f-price" className={selectCls} value={search.max ?? "any"} onChange={(e) => set({ max: e.target.value === "any" ? undefined : e.target.value })}>
            {Object.entries(PRICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <label className="flex h-10 items-center gap-2 rounded-md border bg-card px-3 text-sm">
            <input type="checkbox" checked={!!search.avail} onChange={(e) => set({ avail: e.target.checked || undefined })} className="accent-[var(--sage)]" />
            In stock only
          </label>
          <label className="sr-only" htmlFor="f-sort">Sort by</label>
          <select id="f-sort" className={selectCls} value={search.sort ?? "featured"} onChange={(e) => set({ sort: e.target.value === "featured" ? undefined : (e.target.value as Sort) })}>
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>Sort: {v}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <p aria-live="polite">{results.length} {results.length === 1 ? "product" : "products"}</p>
        {active && <button className="inline-flex items-center gap-1 underline" onClick={() => navigate({ search: {}, replace: true })}><X className="size-3" />Clear filters</button>}
      </div>
      {results.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed p-16 text-center">
          <p className="font-display text-2xl">Nothing matches that yet</p>
          <p className="mt-2 text-muted-foreground">Try a different search or loosen the filters.</p>
          <Button className="mt-6" variant="outline" onClick={() => navigate({ search: {}, replace: true })}>Reset filters</Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
