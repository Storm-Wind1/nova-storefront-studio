import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import hero from "@/assets/hero.jpg";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageMeta } from "@/components/page-meta";

export const Route = createFileRoute("/")({
  head: () => pageMeta("Calm technology for considered spaces", "Explore NOVA, a concept store demo of headphones, desk gear, chargers and bags — with a working cart, wishlist and demo checkout.", "/"),
  component: Home,
});

function Home() {
  const featured = products.filter((p) => p.featured);
  const best = products.filter((p) => p.bestseller).slice(0, 4);
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="NOVA headphones, charger and notebook arranged on a warm oak desk" className="absolute inset-0 -z-10 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 md:py-40">
          <p className="text-xs font-semibold tracking-[0.25em] text-sage uppercase">Autumn edit · 2026</p>
          <h1 className="mt-4 max-w-xl text-5xl leading-[1.05] md:text-7xl">Quiet tools for a louder world.</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Headphones, desk essentials and power, designed to disappear into your day.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/shop">Shop the collection</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/about">Our story</Link></Button>
          </div>
        </div>
      </section>

      <Section title="Featured" link={<Link to="/shop" className="text-sm underline underline-offset-4">View all</Link>}>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </Section>

      <Section title="Shop by category">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.id} to="/shop" search={{ cat: c.id }} className="group relative block aspect-square overflow-hidden rounded-lg">
              <img src={c.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 to-transparent p-4 text-primary-foreground">
                <p className="font-display text-2xl">{c.name}</p>
                <p className="text-sm opacity-90">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Bestsellers">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{best.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </Section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 rounded-2xl bg-accent p-8 text-accent-foreground md:grid-cols-2 md:p-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase">Brand story</p>
            <h2 className="mt-3 text-4xl">Made to be used, not noticed.</h2>
          </div>
          <div className="space-y-4">
            <p>NOVA imagines a small studio making fewer, better things — soft materials, honest specs and repairable parts. Every product here is fictional, but the care in the experience is real.</p>
            <Link to="/about" className="inline-block font-semibold underline underline-offset-4">Read the story</Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

function Section({ title, link, children }: { title: string; link?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
      <div className="mb-8 flex items-end justify-between"><h2 className="text-3xl md:text-4xl">{title}</h2>{link}</div>
      {children}
    </section>
  );
}

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);

function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto mt-24 max-w-2xl px-4 text-center">
      <h2 className="text-3xl">Letters from the studio</h2>
      <p className="mt-2 text-muted-foreground">Simulated newsletter — nothing is sent and your email is not stored.</p>
      {done ? (
        <p role="status" className="mt-6 rounded-lg bg-accent p-4 text-accent-foreground">Thanks! In a real store you'd now be subscribed. (Demo only.)</p>
      ) : (
        <form noValidate className="mt-6 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => {
          e.preventDefault();
          const r = emailSchema.safeParse(email);
          if (!r.success) { setError(r.error.issues[0]?.message ?? "Enter a valid email address"); return; }
          setError(""); setDone(true); setEmail(""); toast.success("Subscribed (demo)");
        }}>
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <Input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-invalid={!!error} aria-describedby={error ? "nl-err" : undefined} className="h-11 bg-card" />
          <Button type="submit" size="lg">Subscribe</Button>
        </form>
      )}
      {error && <p id="nl-err" className="mt-2 text-sm text-destructive">{error}</p>}
    </section>
  );
}
