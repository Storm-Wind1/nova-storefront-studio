# NOVA Store — E-commerce Demo

A responsive, accessible e-commerce **frontend concept demo** for a fictional calm-technology brand. Built with TanStack Start, React 19, TypeScript and Tailwind CSS v4.

> Concept demo — not a real store. No payments, card fields, database, accounts, external APIs or real form submissions.

## Features
- Home: campaign hero, featured products, categories, bestsellers, brand story, simulated newsletter.
- Shop: 16 fictional products (USD), search, category / price / in-stock filters, sorting (featured, newest, price, name), empty state; filters live in the URL.
- Product pages: image gallery, variants (with sold-out options), quantity, features, specs, recommendations.
- Cart & wishlist saved in `localStorage` (versioned keys `nova.cart.v1`, `nova.wishlist.v1`); malformed or unknown data is discarded safely; header counts.
- Variant-aware cart lines, stock/10-unit quantity caps, sold-out protection.
- Pricing: standard shipping $8 (free from $150), express $18, no taxes.
- Demo checkout: validated details → review → local order ID → confirmation that survives refresh. Only products and totals are stored (`nova.lastOrder.v1`); name, email and address are never saved.
- About, FAQ, Contact (validated, simulated). Mobile menu, skip link, labels, focus rings, reduced-motion support.

## Limitations
- Product images are AI-generated, unbranded; gallery "views" are crops of one photo per product.
- Orders, newsletter and contact forms are simulated in the browser only. Only the most recent demo order is kept.
- Stock levels do not decrease after an order.

## Run locally
```sh
npm install      # or: bun install
npm run dev      # http://localhost:8080
npm run build
npm test         # pricing and storage rules
```

## GitHub export / sync / deploy
GitHub sync is **not connected yet**. To connect: in Lovable open the project → **Connectors / GitHub** → Connect → choose an account and create the repository. After that, changes sync both ways on the default branch.

Deploy: use Lovable's **Publish** button. This project uses server-side rendering (TanStack Start on an edge worker), so pure static hosting has **not been verified**; other hosts would need a TanStack Start-compatible adapter.
