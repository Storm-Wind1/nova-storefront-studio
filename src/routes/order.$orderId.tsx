import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { formatUSD } from "@/data/products";
import { readOrder, type OrderSummary } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Summary } from "./cart";

export const Route = createFileRoute("/order/$orderId")({
  head: () => ({ meta: [{ title: "Demo order confirmed — NOVA Store Demo" }, { name: "description", content: "Confirmation for a simulated NOVA demo order." }, { property: "og:title", content: "Demo order confirmed — NOVA Store Demo" }, { property: "og:description", content: "Confirmation for a simulated NOVA demo order." }, { name: "robots", content: "noindex" }] }),
  component: OrderPage,
});

function OrderPage() {
  const { orderId } = Route.useParams();
  const [state, setState] = useState<{ loading: boolean; order: OrderSummary | null }>({ loading: true, order: null });
  useEffect(() => {
    const o = readOrder();
    setState({ loading: false, order: o && o.id === orderId ? o : null });
  }, [orderId]);

  if (state.loading) return <p className="px-4 py-24 text-center text-muted-foreground" aria-busy="true">Loading order…</p>;
  if (!state.order) return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl">Order not found</h1>
      <p className="mt-3 text-muted-foreground">Demo orders live only in the browser that placed them, and only the most recent one is kept.</p>
      <Button asChild className="mt-6"><Link to="/shop">Continue shopping</Link></Button>
    </div>
  );
  const o = state.order;
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-12 text-sage" aria-hidden />
        <h1 className="mt-4 text-4xl md:text-5xl">Thank you — demo order placed</h1>
        <p className="mt-3 text-muted-foreground">Order <strong className="text-foreground" data-testid="order-id">{o.id}</strong> · {new Date(o.createdAt).toLocaleString()}</p>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">This is a concept demo: no payment was taken, nothing will ship, and no email was sent. Your contact and address details were not saved.</p>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y rounded-lg border bg-card">
          {o.lines.map((l, i) => (
            <li key={i} className="flex justify-between p-4 text-sm">
              <div><p className="font-semibold">{l.name}</p><p className="text-muted-foreground">{l.variant} · Qty {l.qty} · {formatUSD(l.price)} each</p></div>
              <p className="font-semibold">{formatUSD(l.price * l.qty)}</p>
            </li>
          ))}
          <li className="p-4 text-sm text-muted-foreground">Shipping: {o.method === "express" ? "Express · 1–2 days" : "Standard · 4–6 days"}</li>
        </ul>
        <Summary subtotal={o.subtotal} shipping={o.shipping} total={o.total}>
          <Button asChild className="mt-6 w-full"><Link to="/shop">Continue shopping</Link></Button>
        </Summary>
      </div>
    </div>
  );
}
