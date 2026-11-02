export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_RATES = { standard: 8, express: 18 } as const;
export type ShippingMethod = keyof typeof SHIPPING_RATES;
export const MAX_QTY = 10;

const round = (n: number) => Math.round(n * 100) / 100;

export function subtotalOf(lines: { price: number; qty: number }[]) {
  return round(lines.reduce((s, l) => s + l.price * l.qty, 0));
}

export function shippingFor(subtotal: number, method: ShippingMethod = "standard") {
  if (subtotal <= 0) return 0;
  if (method === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_RATES[method];
}

export function totals(lines: { price: number; qty: number }[], method: ShippingMethod = "standard") {
  const subtotal = subtotalOf(lines);
  const shipping = shippingFor(subtotal, method);
  return { subtotal, shipping, total: round(subtotal + shipping) };
}

export function clampQty(qty: number, stock: number) {
  const max = Math.min(MAX_QTY, Math.max(0, stock));
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.min(max, Math.floor(qty)));
}
