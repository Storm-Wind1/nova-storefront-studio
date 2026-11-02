import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatUSD } from "@/data/products";
import { useStore } from "@/lib/store";
import { FREE_SHIPPING_THRESHOLD, MAX_QTY, totals } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { pageMeta } from "@/components/page-meta";

export const Route = createFileRoute("/cart")({
  head: () => pageMeta("Your cart", "Review the items in your NOVA demo cart.", "/cart"),
  component: CartPage,
});

function CartPage() {
  const { ready, lines, setQty, remove } = useStore();
  const t = totals(lines);
  if (!ready) return <div className="mx-auto max-w-5xl space-y-4 px-4 py-12" aria-busy="true"><Skeleton className="h-10 w-40" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div>;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl md:text-5xl">Your cart</h1>
      {lines.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed p-16 text-center">
          <p className="font-display text-2xl">Your cart is empty</p>
          <p className="mt-2 text-muted-foreground">Find something calm and useful.</p>
          <Button asChild className="mt-6"><Link to="/shop">Browse the shop</Link></Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y border-y">
            {lines.map((l) => {
              const max = Math.min(MAX_QTY, l.product.stock);
              return (
                <li key={l.key} className="flex gap-4 py-5">
                  <img src={l.product.image} alt={l.product.imageAlt} className="size-24 rounded-md object-cover sm:size-28" />
                  <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <Link to="/product/$slug" params={{ slug: l.product.slug }} className="font-semibold hover:underline">{l.product.name}</Link>
                      <p className="text-sm text-muted-foreground">{l.product.variantName}: {l.variant}</p>
                      <p className="text-sm text-muted-foreground">{formatUSD(l.price)} each</p>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                      <div className="flex h-9 items-center rounded-md border bg-card">
                        <button className="grid size-9 place-items-center disabled:opacity-40" aria-label={`Decrease quantity of ${l.product.name}`} disabled={l.qty <= 1} onClick={() => setQty(l.productId, l.variant, l.qty - 1)}><Minus className="size-3" /></button>
                        <span className="w-7 text-center text-sm" aria-label={`Quantity ${l.qty}`}>{l.qty}</span>
                        <button className="grid size-9 place-items-center disabled:opacity-40" aria-label={`Increase quantity of ${l.product.name}`} disabled={l.qty >= max} onClick={() => setQty(l.productId, l.variant, l.qty + 1)}><Plus className="size-3" /></button>
                      </div>
                      <p className="font-semibold" data-testid="line-total">{formatUSD(l.price * l.qty)}</p>
                      <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive" onClick={() => remove(l.productId, l.variant)} aria-label={`Remove ${l.product.name} (${l.variant})`}><Trash2 className="size-4" />Remove</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Summary subtotal={t.subtotal} shipping={t.shipping} total={t.total} note={t.subtotal < FREE_SHIPPING_THRESHOLD ? `Add ${formatUSD(FREE_SHIPPING_THRESHOLD - t.subtotal)} more for free standard shipping.` : "You've unlocked free standard shipping."}>
            <Button asChild size="lg" className="mt-6 w-full"><Link to="/checkout">Checkout</Link></Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Demo checkout — no payment will be taken.</p>
          </Summary>
        </div>
      )}
    </div>
  );
}

export function Summary({ subtotal, shipping, total, note, children }: { subtotal: number; shipping: number; total: number; note?: string; children?: React.ReactNode }) {
  return (
    <aside className="h-fit rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="font-sans text-lg font-semibold">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd data-testid="subtotal">{formatUSD(subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Shipping</dt><dd data-testid="shipping">{shipping === 0 ? "Free" : formatUSD(shipping)}</dd></div>
        <div className="flex justify-between border-t pt-3 text-base font-semibold"><dt>Total (USD)</dt><dd data-testid="total">{formatUSD(total)}</dd></div>
      </dl>
      {note && <p className="mt-3 text-xs text-muted-foreground">{note}</p>}
      <p className="mt-1 text-xs text-muted-foreground">Taxes not applied in this demo.</p>
      {children}
    </aside>
  );
}
