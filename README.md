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
npm ci
npm run dev             # original Lovable / TanStack Start development server
npm run typecheck
npm test
npm run build           # original SSR target for Lovable-compatible hosting
npm run build:pages     # standalone static frontend in dist-pages/
```

## GitHub sync
This project is exported to `Storm-Wind1/nova-storefront-studio`. Commits on the linked branch sync with Lovable. Do not force-push or rewrite published history.

## GitHub Pages deployment
The separate client-only build uses Vite and TanStack Router with hash URLs, for example `/nova-storefront-studio/#/shop`. It contains no server code and does not require Node, Nitro, a database, or an API at runtime. The original Lovable build remains available separately.

1. In this repository, open **Settings → Pages** and select **GitHub Actions** as the source. This requires a repository administrator. Private repositories require a GitHub plan that supports Pages for private repositories; changing source visibility is a separate owner decision.
2. The `Deploy NOVA to GitHub Pages` workflow runs on pushes to `main` and can also be started manually from Actions. It installs the npm lockfile, checks types, runs the tests, builds the static site, uploads `dist-pages`, and deploys it.
3. After a successful deployment, the default demo URL is `https://storm-wind1.github.io/nova-storefront-studio/`. A committed workflow alone does not mean this URL is live.

The workflow uses the built-in short-lived GitHub token, with Pages and ID-token write permissions restricted to the deploy job. No personal token or secret is required in source. It cannot enable Pages on your behalf.

For another repository name or custom domain, set `PAGES_BASE_PATH` and `PAGES_SITE_URL` when running `npm run build:pages`; update the workflow environment to match. The default values target this repository. Hash routing makes direct links and refresh work on static hosting without rewrite rules. The skip link focuses the main region without changing the route.

To inspect the production output locally under the same prefix:
```sh
npm run build:pages
mkdir -p /tmp/nova-preview
ln -s "$PWD/dist-pages" /tmp/nova-preview/nova-storefront-studio
python -m http.server 8765 --directory /tmp/nova-preview
# Open http://localhost:8765/nova-storefront-studio/
```

Product photos and OFL-licensed Fraunces/Manrope fonts are bundled as local assets. Font licenses are provided in the installed Fontsource packages.

## Deployment validation
Strict TypeScript checks, the seven pricing/storage tests, the original production build and the static production build were run locally. Browser validation uses only `dist-pages` on a plain static server under the repository prefix, including search, filter/sort, product direct links and refresh, cart totals/quantity persistence, wishlist persistence, validated checkout, order review and confirmation refresh, no saved shipping/contact details, mobile navigation, asset requests and console errors. Remote availability must be checked after Pages is enabled and its deployment succeeds.
