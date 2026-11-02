import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { formatUSD, type Product } from "@/data/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/safe-image";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWish } = useStore();
  const wished = wishlist.includes(product.id);
  const soldOut = product.stock <= 0;
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary">
        <SafeImage src={product.image} alt={product.imageAlt} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {soldOut && <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Sold out</span>}
        {!soldOut && product.compareAt && <span className="absolute top-3 left-3 rounded-full bg-sage px-3 py-1 text-xs font-semibold text-sage-foreground">Sale</span>}
        <button
          onClick={() => { const added = toggleWish(product.id); toast(added ? "Saved to wishlist" : "Removed from wishlist"); }}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wished}
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-background/90 shadow-sm hover:bg-background"
        >
          <Heart className={cn("size-4", wished && "fill-foreground")} />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-sans text-sm font-semibold">
            <Link to="/product/$slug" params={{ slug: product.slug }} className="after:absolute after:inset-0">{product.name}</Link>
          </h3>
          <p className="text-sm text-muted-foreground">{product.tagline}</p>
        </div>
        <p className="text-sm font-semibold whitespace-nowrap">
          {formatUSD(product.price)}
          {product.compareAt && <span className="ml-1 font-normal text-muted-foreground line-through">{formatUSD(product.compareAt)}</span>}
        </p>
      </div>
    </article>
  );
}
