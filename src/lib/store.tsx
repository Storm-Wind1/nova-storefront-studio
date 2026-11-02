import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProductById, isSoldOut, type Product } from "@/data/products";
import { clampQty } from "@/lib/pricing";

export interface CartItem { productId: string; variant: string; qty: number }
export interface CartLine extends CartItem { product: Product; price: number; key: string }

const CART_KEY = "nova.cart.v1";
const WISH_KEY = "nova.wishlist.v1";
export const ORDER_KEY = "nova.lastOrder.v1";

export const lineKey = (id: string, variant: string) => `${id}::${variant}`;

function safeRead(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeWrite(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* storage full or blocked */ }
}

/** Parse and sanitize stored cart; invalid, unknown or sold-out items are dropped. */
export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!data || data.v !== 1 || !Array.isArray(data.items)) return [];
    const out: CartItem[] = [];
    for (const it of data.items) {
      if (!it || typeof it.productId !== "string" || typeof it.variant !== "string") continue;
      const prod = getProductById(it.productId);
      if (!prod || !prod.variants.some((v) => v.label === it.variant) || isSoldOut(prod, it.variant)) continue;
      if (out.some((o) => o.productId === it.productId && o.variant === it.variant)) continue;
      out.push({ productId: it.productId, variant: it.variant, qty: clampQty(Number(it.qty), prod.stock) });
    }
    return out;
  } catch { return []; }
}

export function parseWishlist(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!data || data.v !== 1 || !Array.isArray(data.ids)) return [];
    return [...new Set(data.ids.filter((id: unknown) => typeof id === "string" && getProductById(id as string)))] as string[];
  } catch { return []; }
}

interface StoreValue {
  ready: boolean;
  items: CartItem[];
  lines: CartLine[];
  count: number;
  add: (productId: string, variant: string, qty: number) => { ok: boolean; message: string };
  setQty: (productId: string, variant: string, qty: number) => void;
  remove: (productId: string, variant: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWish: (productId: string) => boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setItems(parseCart(safeRead(CART_KEY)));
    setWishlist(parseWishlist(safeRead(WISH_KEY)));
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItems(parseCart(e.newValue));
      if (e.key === WISH_KEY) setWishlist(parseWishlist(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => { if (ready) safeWrite(CART_KEY, JSON.stringify({ v: 1, items })); }, [items, ready]);
  useEffect(() => { if (ready) safeWrite(WISH_KEY, JSON.stringify({ v: 1, ids: wishlist })); }, [wishlist, ready]);

  const add = useCallback<StoreValue["add"]>((productId, variant, qty) => {
    const prod = getProductById(productId);
    if (!prod) return { ok: false, message: "Product not found" };
    if (isSoldOut(prod, variant)) return { ok: false, message: "That option is sold out" };
    let result = { ok: true, message: `Added ${prod.name} to cart` };
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.variant === variant);
      const want = (existing?.qty ?? 0) + qty;
      const next = clampQty(want, prod.stock);
      if (next < want) result = { ok: true, message: `Quantity limited to ${next} for ${prod.name}` };
      if (existing) return prev.map((i) => (i === existing ? { ...i, qty: next } : i));
      return [...prev, { productId, variant, qty: next }];
    });
    return result;
  }, []);

  const setQty = useCallback((productId: string, variant: string, qty: number) => {
    const prod = getProductById(productId);
    if (!prod) return;
    setItems((prev) => prev.map((i) => (i.productId === productId && i.variant === variant ? { ...i, qty: clampQty(qty, prod.stock) } : i)));
  }, []);

  const remove = useCallback((productId: string, variant: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variant === variant)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const toggleWish = useCallback((productId: string) => {
    let added = false;
    setWishlist((prev) => {
      if (prev.includes(productId)) return prev.filter((x) => x !== productId);
      added = true;
      return [...prev, productId];
    });
    return added;
  }, []);

  const lines = useMemo<CartLine[]>(() => items.flatMap((i) => {
    const product = getProductById(i.productId);
    return product ? [{ ...i, product, price: product.price, key: lineKey(i.productId, i.variant) }] : [];
  }), [items]);

  const value = useMemo(() => ({
    ready, items, lines, count: lines.reduce((s, l) => s + l.qty, 0),
    add, setQty, remove, clear, wishlist, toggleWish,
  }), [ready, items, lines, add, setQty, remove, clear, wishlist, toggleWish]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/** Safe order summary: product lines and totals only — no name, email or address. */
export interface OrderSummary {
  id: string;
  createdAt: string;
  method: "standard" | "express";
  lines: { name: string; variant: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
}

export function saveOrder(o: OrderSummary) { safeWrite(ORDER_KEY, JSON.stringify({ v: 1, order: o })); }
export function readOrder(): OrderSummary | null {
  const raw = safeRead(ORDER_KEY);
  if (!raw) return null;
  try {
    const d = JSON.parse(raw);
    const o = d?.order;
    if (d?.v !== 1 || !o || typeof o.id !== "string" || !Array.isArray(o.lines) || typeof o.total !== "number") return null;
    return o as OrderSummary;
  } catch { return null; }
}
