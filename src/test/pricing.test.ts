import { describe, expect, it } from "vitest";
import { clampQty, shippingFor, totals } from "@/lib/pricing";
import { parseCart } from "@/lib/store";

describe("pricing", () => {
  it("sums lines and charges $8 standard shipping under $150", () => {
    expect(totals([{ price: 49, qty: 2 }, { price: 45, qty: 1 }])).toEqual({ subtotal: 143, shipping: 8, total: 151 });
  });
  it("gives free standard shipping at $150 or more", () => {
    expect(shippingFor(150, "standard")).toBe(0);
  });
  it("always charges $18 for express", () => {
    expect(shippingFor(500, "express")).toBe(18);
  });
  it("caps quantity at stock and at 10", () => {
    expect(clampQty(12, 50)).toBe(10);
    expect(clampQty(5, 3)).toBe(3);
  });
});

describe("cart storage", () => {
  it("recovers from malformed data", () => {
    expect(parseCart("{not json")).toEqual([]);
    expect(parseCart(JSON.stringify({ v: 1, items: [{ productId: "nope", variant: "x", qty: 1 }] }))).toEqual([]);
  });
  it("drops sold-out products", () => {
    expect(parseCart(JSON.stringify({ v: 1, items: [{ productId: "p04", variant: "Sage", qty: 1 }] }))).toEqual([]);
  });
});
