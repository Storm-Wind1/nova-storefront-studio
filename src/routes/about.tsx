import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/components/page-meta";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("About NOVA", "The story behind NOVA, a fictional calm-technology brand created as an e-commerce portfolio demo.", "/about"),
  component: About,
});

const values = [
  ["Fewer, better", "A tight collection where every product earns its place on the desk."],
  ["Soft materials", "Felt, cork, canvas and warm metals instead of glossy plastic."],
  ["Honest specs", "Plain-language details, realistic battery figures, no hype."],
];

function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.25em] text-sage uppercase">Our story</p>
      <h1 className="mt-3 max-w-3xl text-5xl leading-tight md:text-6xl">Technology should feel like a well-made notebook.</h1>
      <img src={hero} alt="A calm workspace with NOVA products on an oak desk" className="mt-10 aspect-[16/7] w-full rounded-xl object-cover" />
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <p className="text-lg leading-relaxed">NOVA is an imagined studio designing quiet, durable accessories for people who work and live with their devices all day. We started with a simple question: what if the things on your desk made it calmer rather than busier?</p>
        <div className="space-y-4 text-muted-foreground">
          <p>This site is a <strong className="text-foreground">concept demo</strong> built to showcase a complete, accessible shopping experience — product discovery, variants, cart, wishlist and checkout — entirely in the browser.</p>
          <p>The brand, products, prices and stock levels are fictional. No orders are fulfilled and no payments are processed.</p>
        </div>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {values.map(([t, d]) => <div key={t} className="rounded-xl bg-card p-6 ring-1 ring-border"><h2 className="text-2xl">{t}</h2><p className="mt-2 text-muted-foreground">{d}</p></div>)}
      </div>
      <Button asChild size="lg" className="mt-12"><Link to="/shop">Explore the collection</Link></Button>
    </div>
  );
}
