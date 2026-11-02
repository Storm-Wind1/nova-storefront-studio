import { Link } from "@tanstack/react-router";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function DemoBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-xs tracking-wide text-primary-foreground">
      Concept demo — not a real store. Fictional products; no orders or payments are processed.
    </div>
  );
}

export function SiteHeader() {
  const { count, wishlist, ready } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="rounded-md p-2 md:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetHeader><SheetTitle className="font-display text-2xl">NOVA</SheetTitle></SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {[{ to: "/", label: "Home" }, ...nav, { to: "/wishlist", label: "Wishlist" }, { to: "/cart", label: "Cart" }].map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-lg hover:bg-secondary" activeProps={{ className: "bg-secondary" }}>
                    {n.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="font-display text-2xl font-semibold tracking-tight" aria-label="NOVA Store home">NOVA</Link>
        </div>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground font-semibold" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link to="/wishlist" className="relative rounded-md p-2 hover:bg-secondary" aria-label={`Wishlist, ${ready ? wishlist.length : 0} items`}>
            <Heart className="size-5" />
            {ready && wishlist.length > 0 && <Count n={wishlist.length} />}
          </Link>
          <Link to="/cart" className="relative rounded-md p-2 hover:bg-secondary" aria-label={`Cart, ${ready ? count : 0} items`}>
            <ShoppingBag className="size-5" />
            {ready && count > 0 && <Count n={count} />}
          </Link>
        </div>
      </div>
    </header>
  );
}

function Count({ n }: { n: number }) {
  return <span aria-hidden className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-sage px-1 text-[11px] font-bold text-sage-foreground">{n}</span>;
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">NOVA</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Calm technology for considered spaces. A fictional brand built as a frontend portfolio demonstration.</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {(["audio", "workspace", "power", "carry"] as const).map((c) => (
              <li key={c}><Link to="/shop" search={{ cat: c }} className="capitalize hover:text-foreground">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {nav.slice(1).map((n) => <li key={n.to}><Link to={n.to} className="hover:text-foreground">{n.label}</Link></li>)}
          </ul>
        </div>
      </div>
      <p className="border-t px-4 py-5 text-center text-xs text-muted-foreground">© 2026 NOVA Store (fictional). Concept demo — not a real store. Prices in USD for illustration only.</p>
    </footer>
  );
}
