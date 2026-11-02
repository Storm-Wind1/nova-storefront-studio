import headphones from "@/assets/p-headphones.jpg";
import earbuds from "@/assets/p-earbuds.jpg";
import laptopStand from "@/assets/p-laptop-stand.jpg";
import deskMat from "@/assets/p-desk-mat.jpg";
import chargerStand from "@/assets/p-charger-stand.jpg";
import gan from "@/assets/p-gan-charger.jpg";
import powerBank from "@/assets/p-power-bank.jpg";
import backpack from "@/assets/p-backpack.jpg";

export type CategoryId = "audio" | "workspace" | "power" | "carry";

export const categories: { id: CategoryId; name: string; blurb: string; image: string }[] = [
  { id: "audio", name: "Audio", blurb: "Quiet, warm, all-day sound.", image: headphones },
  { id: "workspace", name: "Workspace", blurb: "Calm desks, better posture.", image: laptopStand },
  { id: "power", name: "Power", blurb: "Fast, tidy charging.", image: chargerStand },
  { id: "carry", name: "Carry", blurb: "Bags built for the commute.", image: backpack },
];

export interface Variant { label: string; soldOut?: boolean }
export interface GalleryView { src: string; position: string; zoom: number; alt: string }

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  price: number; // USD
  compareAt?: number;
  tagline: string;
  description: string;
  features: string[];
  specs: [string, string][];
  variantName: string;
  variants: Variant[];
  stock: number; // 0 = sold out
  bestseller?: boolean;
  featured?: boolean;
  addedAt: string; // ISO date, used for "newest"
  image: string;
  imageAlt: string;
}

function p(x: Product) { return x; }

export const products: Product[] = [
  p({ id: "p01", slug: "aura-over-ear-headphones", name: "Aura Over-Ear Headphones", category: "audio", price: 189, tagline: "Soft-touch noise cancelling", description: "Plush memory-foam cushions, adaptive noise cancelling and a 40-hour battery tuned for long focus sessions.", features: ["Adaptive noise cancelling", "40-hour battery", "Multipoint Bluetooth 5.3"], specs: [["Battery", "40 h"], ["Weight", "254 g"], ["Charging", "USB-C"], ["Warranty", "2 years"]], variantName: "Color", variants: [{ label: "Sand" }, { label: "Charcoal" }, { label: "Sage", soldOut: true }], stock: 14, bestseller: true, featured: true, addedAt: "2026-08-02", image: headphones, imageAlt: "Cream over-ear headphones resting on a linen surface" }),
  p({ id: "p02", slug: "aura-studio-headphones", name: "Aura Studio Headphones", category: "audio", price: 249, compareAt: 279, tagline: "Lossless wired + wireless", description: "Our reference-tuned model with a detachable braided cable and hi-res wireless codec support.", features: ["Hi-res wireless codecs", "Detachable braided cable", "Hard travel case"], specs: [["Battery", "35 h"], ["Driver", "40 mm"], ["Weight", "280 g"], ["Warranty", "2 years"]], variantName: "Color", variants: [{ label: "Charcoal" }, { label: "Sand" }], stock: 6, addedAt: "2026-10-12", image: headphones, imageAlt: "Over-ear studio headphones in soft daylight" }),
  p({ id: "p03", slug: "pebble-wireless-earbuds", name: "Pebble Wireless Earbuds", category: "audio", price: 119, tagline: "Pocket-sized calm", description: "Rounded, featherweight earbuds with a pebble-shaped case and clear call microphones.", features: ["Active noise cancelling", "28 h with case", "IPX4 sweat resistant"], specs: [["Battery", "7 h + 21 h case"], ["Weight", "4.8 g per bud"], ["Charging", "USB-C / Qi"]], variantName: "Color", variants: [{ label: "Cream" }, { label: "Charcoal" }], stock: 22, bestseller: true, featured: true, addedAt: "2026-06-18", image: earbuds, imageAlt: "Cream wireless earbuds in an open charging case" }),
  p({ id: "p04", slug: "pebble-sport-earbuds", name: "Pebble Sport Earbuds", category: "audio", price: 139, tagline: "Secure fit for movement", description: "Flexible wing tips and an IPX7 rating for runs, rides and rainy commutes.", features: ["IPX7 waterproof", "Secure wing tips", "Ambient mode"], specs: [["Battery", "8 h + 24 h case"], ["Rating", "IPX7"]], variantName: "Color", variants: [{ label: "Sage" }, { label: "Charcoal" }], stock: 0, addedAt: "2026-09-21", image: earbuds, imageAlt: "Sport earbuds beside their charging case" }),
  p({ id: "p05", slug: "lift-aluminum-laptop-stand", name: "Lift Aluminum Laptop Stand", category: "workspace", price: 79, tagline: "Eye-level, all day", description: "A single piece of bead-blasted aluminum that raises your screen 15 cm and keeps your laptop cool.", features: ["Raises screen 15 cm", "Fits 11–16\" laptops", "Non-slip silicone pads"], specs: [["Material", "Anodized aluminum"], ["Weight", "1.1 kg"], ["Max load", "8 kg"]], variantName: "Finish", variants: [{ label: "Silver" }, { label: "Graphite" }], stock: 30, bestseller: true, featured: true, addedAt: "2026-04-10", image: laptopStand, imageAlt: "Aluminum laptop stand on a wooden desk" }),
  p({ id: "p06", slug: "lift-fold-travel-stand", name: "Lift Fold Travel Stand", category: "workspace", price: 49, tagline: "Folds flatter than a notebook", description: "Six height settings, folds to 9 mm and slips into a laptop sleeve.", features: ["6 height settings", "Folds to 9 mm", "Carry pouch included"], specs: [["Weight", "220 g"], ["Material", "Aluminum alloy"]], variantName: "Finish", variants: [{ label: "Silver" }, { label: "Graphite" }], stock: 3, addedAt: "2026-10-28", image: laptopStand, imageAlt: "Slim folding laptop stand" }),
  p({ id: "p07", slug: "felt-desk-mat", name: "Felt Desk Mat", category: "workspace", price: 45, tagline: "Quiet surface, warm touch", description: "Dense merino-blend felt with a cork underside that stays put and softens keystrokes.", features: ["Merino-blend felt", "Natural cork base", "Stitched edges"], specs: [["Size", "80 × 35 cm"], ["Thickness", "4 mm"]], variantName: "Color", variants: [{ label: "Oat" }, { label: "Charcoal" }, { label: "Sage" }], stock: 40, featured: true, addedAt: "2026-03-05", image: deskMat, imageAlt: "Felt desk mat with keyboard and notebook" }),
  p({ id: "p08", slug: "felt-desk-mat-xl", name: "Felt Desk Mat XL", category: "workspace", price: 65, tagline: "Room for the whole setup", description: "The extra-wide version for dual monitors, keyboards and a coffee or two.", features: ["Full-desk coverage", "Water-resistant finish", "Cork base"], specs: [["Size", "120 × 60 cm"], ["Thickness", "4 mm"]], variantName: "Color", variants: [{ label: "Oat" }, { label: "Charcoal" }], stock: 12, addedAt: "2026-07-14", image: deskMat, imageAlt: "Large felt desk mat across a desk" }),
  p({ id: "p09", slug: "dock-wireless-charging-stand", name: "Dock Wireless Charging Stand", category: "power", price: 59, tagline: "Charge upright, glance easily", description: "15 W wireless charging in portrait or landscape, wrapped in soft-touch fabric.", features: ["15 W fast wireless", "Portrait & landscape", "Fabric finish"], specs: [["Output", "15 W"], ["Input", "USB-C PD"]], variantName: "Color", variants: [{ label: "Cream" }, { label: "Charcoal" }], stock: 18, bestseller: true, addedAt: "2026-05-01", image: chargerStand, imageAlt: "Wireless charging stand holding a phone" }),
  p({ id: "p10", slug: "dock-trio-charging-station", name: "Dock Trio Charging Station", category: "power", price: 129, tagline: "Phone, buds and watch at once", description: "One tidy base for three devices, with a gentle night-light mode and a weighted walnut foot.", features: ["Charges 3 devices", "Walnut base", "Night-light mode"], specs: [["Output", "15 W + 5 W + 3 W"], ["Base", "Solid walnut"]], variantName: "Base", variants: [{ label: "Walnut" }, { label: "Ash" }], stock: 9, featured: true, addedAt: "2026-09-30", image: chargerStand, imageAlt: "Multi-device charging station" }),
  p({ id: "p11", slug: "volt-65w-gan-charger", name: "Volt 65W GaN Charger", category: "power", price: 49, tagline: "Laptop power, pocket size", description: "Gallium-nitride charger that tops up a laptop, phone and earbuds from one wall plug.", features: ["65 W total output", "2× USB-C + 1× USB-A", "Foldable prongs"], specs: [["Output", "65 W"], ["Ports", "3"], ["Weight", "112 g"]], variantName: "Plug", variants: [{ label: "US" }, { label: "UK" }, { label: "EU" }], stock: 50, bestseller: true, addedAt: "2026-02-11", image: gan, imageAlt: "Compact white GaN wall charger" }),
  p({ id: "p12", slug: "volt-100w-gan-charger", name: "Volt 100W GaN Charger", category: "power", price: 79, tagline: "Power for the whole desk", description: "Four ports and 100 W output for a full workstation from a single socket.", features: ["100 W total output", "4 ports", "Smart power split"], specs: [["Output", "100 W"], ["Ports", "4"]], variantName: "Plug", variants: [{ label: "US" }, { label: "UK" }, { label: "EU" }], stock: 0, addedAt: "2026-10-05", image: gan, imageAlt: "Four-port GaN charger" }),
  p({ id: "p13", slug: "reserve-10k-power-bank", name: "Reserve 10K Power Bank", category: "power", price: 55, tagline: "Two full phone charges", description: "Slim 10,000 mAh power bank with 20 W USB-C and a pass-through charging mode.", features: ["10,000 mAh", "20 W USB-C PD", "Pass-through charging"], specs: [["Capacity", "10,000 mAh"], ["Weight", "190 g"]], variantName: "Color", variants: [{ label: "Cream" }, { label: "Charcoal" }], stock: 25, addedAt: "2026-01-20", image: powerBank, imageAlt: "Slim cream power bank" }),
  p({ id: "p14", slug: "reserve-20k-power-bank", name: "Reserve 20K Power Bank", category: "power", price: 89, tagline: "Laptop-ready backup", description: "20,000 mAh with 65 W output — enough to rescue a laptop mid-flight.", features: ["20,000 mAh", "65 W output", "Flight-safe capacity"], specs: [["Capacity", "20,000 mAh"], ["Output", "65 W"]], variantName: "Color", variants: [{ label: "Charcoal" }], stock: 8, addedAt: "2026-08-25", image: powerBank, imageAlt: "High-capacity power bank" }),
  p({ id: "p15", slug: "transit-daypack", name: "Transit Daypack", category: "carry", price: 149, tagline: "Commute-proof, clutter-free", description: "Water-resistant recycled canvas with a padded 16\" laptop sleeve and quick-access pockets.", features: ["Recycled water-resistant canvas", "Padded 16\" sleeve", "Luggage pass-through"], specs: [["Volume", "20 L"], ["Weight", "0.9 kg"]], variantName: "Color", variants: [{ label: "Charcoal" }, { label: "Sage" }, { label: "Sand" }], stock: 11, bestseller: true, featured: true, addedAt: "2026-06-02", image: backpack, imageAlt: "Charcoal canvas backpack" }),
  p({ id: "p16", slug: "transit-sling", name: "Transit Sling", category: "carry", price: 69, tagline: "Essentials, close at hand", description: "A compact crossbody for keys, phone, earbuds and a power bank.", features: ["Hidden back pocket", "Adjustable strap", "Water-resistant zip"], specs: [["Volume", "3 L"], ["Weight", "260 g"]], variantName: "Color", variants: [{ label: "Charcoal" }, { label: "Sage" }], stock: 16, addedAt: "2026-10-30", image: backpack, imageAlt: "Canvas sling bag" }),
];

export const getProduct = (slug: string) => products.find((x) => x.slug === slug);
export const getProductById = (id: string) => products.find((x) => x.id === id);
export const isSoldOut = (prod: Product, variant?: string) =>
  prod.stock <= 0 || (variant ? !!prod.variants.find((v) => v.label === variant)?.soldOut : false);

export function gallery(prod: Product): GalleryView[] {
  return [
    { src: prod.image, position: "50% 50%", zoom: 1, alt: prod.imageAlt },
    { src: prod.image, position: "30% 40%", zoom: 1.6, alt: `${prod.name}, close-up detail` },
    { src: prod.image, position: "70% 60%", zoom: 1.35, alt: `${prod.name}, alternate angle` },
  ];
}

export const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
