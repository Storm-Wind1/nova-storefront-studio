import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ShieldAlert } from "lucide-react";
import { formatUSD } from "@/data/products";
import { saveOrder, useStore } from "@/lib/store";
import { totals, type ShippingMethod } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Summary } from "./cart";
import { pageMeta } from "@/components/page-meta";

export const Route = createFileRoute("/checkout")({
  head: () => ({ ...pageMeta("Demo checkout", "Simulated checkout for the NOVA concept store. No payment will be taken.", "/checkout"), meta: [...pageMeta("Demo checkout", "Simulated checkout for the NOVA concept store. No payment will be taken.", "/checkout").meta, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).regex(/^[+\d\s()-]*$/, "Use digits, spaces, + ( ) - only").optional().or(z.literal("")),
  address: z.string().trim().min(5, "Enter a street address").max(200),
  city: z.string().trim().min(2, "Enter a city").max(100),
  postal: z.string().trim().min(3, "Enter a postal code").max(12).regex(/^[A-Za-z0-9 -]+$/, "Letters, digits, spaces and - only"),
  country: z.string().trim().min(2, "Enter a country").max(60),
});
type Form = z.infer<typeof schema>;
const fields: { key: keyof Form; label: string; type?: string; auto: string; full?: boolean }[] = [
  { key: "name", label: "Full name", auto: "name", full: true },
  { key: "email", label: "Email", type: "email", auto: "email" },
  { key: "phone", label: "Phone (optional)", type: "tel", auto: "tel" },
  { key: "address", label: "Street address", auto: "street-address", full: true },
  { key: "city", label: "City", auto: "address-level2" },
  { key: "postal", label: "Postal code", auto: "postal-code" },
  { key: "country", label: "Country", auto: "country-name", full: true },
];

function Checkout() {
  const { ready, lines, clear } = useStore();
  const navigate = useNavigate();
  // Personal details live only in this component's memory — never written to storage.
  const [form, setForm] = useState<Form>({ name: "", email: "", phone: "", address: "", city: "", postal: "", country: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [method, setMethod] = useState<ShippingMethod>("standard");
  const [step, setStep] = useState<"details" | "review">("details");
  const [placing, setPlacing] = useState(false);
  const t = totals(lines, method);

  if (!ready) return <p className="px-4 py-24 text-center text-muted-foreground" aria-busy="true">Loading your cart…</p>;
  if (lines.length === 0) return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl">Nothing to check out</h1>
      <p className="mt-3 text-muted-foreground">Your cart is empty.</p>
      <Button asChild className="mt-6"><Link to="/shop">Browse the shop</Link></Button>
    </div>
  );

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: typeof errors = {};
      for (const i of r.error.issues) errs[i.path[0] as keyof Form] ??= i.message;
      setErrors(errs);
      document.getElementById(`co-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setErrors({}); setStep("review"); window.scrollTo({ top: 0 });
  };

  const place = () => {
    setPlacing(true);
    const id = `NOVA-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    saveOrder({ id, createdAt: new Date().toISOString(), method, lines: lines.map((l) => ({ name: l.product.name, variant: l.variant, qty: l.qty, price: l.price })), ...t });
    setTimeout(() => { clear(); navigate({ to: "/order/$orderId", params: { orderId: id } }); }, 600);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div role="note" className="flex items-start gap-3 rounded-lg border-2 border-sage bg-accent p-4 text-accent-foreground">
        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
        <p><strong>Demo checkout — no payment will be taken.</strong> No card details are requested, nothing is sent anywhere, and your contact and address details are not saved.</p>
      </div>
      <h1 className="mt-8 text-4xl md:text-5xl">{step === "details" ? "Shipping details" : "Review your order"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Step {step === "details" ? 1 : 2} of 2</p>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {step === "details" ? (
          <form noValidate onSubmit={submitDetails} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                  <Label htmlFor={`co-${f.key}`}>{f.label}</Label>
                  <Input id={`co-${f.key}`} type={f.type ?? "text"} autoComplete={f.auto} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    aria-invalid={!!errors[f.key]} aria-describedby={errors[f.key] ? `co-${f.key}-err` : undefined} className="mt-1.5 h-11 bg-card" />
                  {errors[f.key] && <p id={`co-${f.key}-err`} className="mt-1 text-sm text-destructive">{errors[f.key]}</p>}
                </div>
              ))}
            </div>
            <fieldset>
              <legend className="text-sm font-semibold">Shipping method</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {([["standard", "Standard · 4–6 days", t.subtotal >= 150 ? "Free" : "$8.00"], ["express", "Express · 1–2 days", "$18.00"]] as const).map(([k, label, price]) => (
                  <label key={k} className="flex cursor-pointer items-center justify-between rounded-lg border bg-card p-4 has-[:checked]:border-foreground">
                    <span className="flex items-center gap-3"><input type="radio" name="method" value={k} checked={method === k} onChange={() => setMethod(k)} />{label}</span>
                    <span className="text-sm font-semibold">{price}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Button type="submit" size="lg" className="w-full sm:w-auto">Continue to review</Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-5 text-sm">
              <div className="flex justify-between"><h2 className="font-sans font-semibold">Ship to</h2><button className="underline" onClick={() => setStep("details")}>Edit</button></div>
              <p className="mt-2">{form.name}<br />{form.address}<br />{form.city} {form.postal}<br />{form.country}<br />{form.email}</p>
              <p className="mt-2 text-muted-foreground">{method === "express" ? "Express · 1–2 days" : "Standard · 4–6 days"}</p>
            </div>
            <ul className="divide-y rounded-lg border bg-card">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 p-4 text-sm">
                  <img src={l.product.image} alt="" className="size-14 rounded object-cover" />
                  <div className="flex-1"><p className="font-semibold">{l.product.name}</p><p className="text-muted-foreground">{l.variant} · Qty {l.qty}</p></div>
                  <p className="font-semibold">{formatUSD(l.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <Button size="lg" onClick={place} disabled={placing} className="w-full sm:w-auto">{placing ? "Placing demo order…" : `Place demo order · ${formatUSD(t.total)}`}</Button>
            <p className="text-xs text-muted-foreground">No payment will be taken. This only simulates an order in your browser.</p>
          </div>
        )}
        <Summary {...t} />
      </div>
    </div>
  );
}
