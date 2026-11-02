import { createFileRoute, Link } from "@tanstack/react-router";
import { getProductById } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/components/page-meta";

export const Route = createFileRoute("/wishlist")({
  head: () => pageMeta("Wishlist", "Products you've saved in the NOVA demo store.", "/wishlist"),
  component: Wishlist,
});

function Wishlist() {
  const { ready, wishlist } = useStore();
  const items = wishlist.map(getProductById).filter((p) => !!p);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl md:text-5xl">Wishlist</h1>
      {ready && items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed p-16 text-center">
          <p className="font-display text-2xl">Nothing saved yet</p>
          <p className="mt-2 text-muted-foreground">Tap the heart on any product to keep it here.</p>
          <Button asChild className="mt-6"><Link to="/shop">Browse the shop</Link></Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
