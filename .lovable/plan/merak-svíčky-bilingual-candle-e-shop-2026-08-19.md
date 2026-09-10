# MERAK svíčky — bilingual candle e-shop

A premium, warm, feminine e-shop for handmade candles, built around one customizable product with 1,000 combinations (10 scents x 10 colors x 10 packagings) — never 1,000 separate products.

## Design direction

- Palette: cream `#faf6f0`, soft sand `#f0e4db`, powder pink `#e3bfc0`, warm brown `#6b4f3f`, subtle gold accent.
- Typography: elegant serif headings (Cormorant) + clean sans body (Karla), generous whitespace, soft rounded cards, gentle fade/lift animations.
- Mobile-first: everything designed for Instagram traffic — big tap targets, sticky "Create your candle" CTA, thumb-friendly configurator.

## Languages

Czech and English, Czech as default. Language switcher in the header, choice remembered. All UI text, product data (scent/color/packaging names and descriptions) and legal pages exist in both languages.

## Pages

- **Home** — hero candle photo, "MERAK svíčky", "Vůně, barva, okamžik. Tvoje svíčka." / "Scent, Color, Moment. Your Candle.", primary button CREATE YOUR CANDLE, plus sections: how it works, scent teaser, gifts, brand story, Instagram-style gallery.
- **Create Your Candle** — the configurator (below).
- **Scents / Colors / Packaging** — browsable galleries with descriptions; each item links straight into the configurator preselected.
- **Gifts** — curated ready-made combinations (still the same single product, just presets) and gift messaging.
- **About Us**, **Contact** (form + details), **Cart**, **Checkout**, **Order confirmation**.
- **Legal**: Terms & Conditions, Privacy Policy, Returns & Complaints, Cookies + a cookie consent banner.

## Configurator

Step flow (all visible on desktop, stepped on mobile): Packaging → Scent → Color → optional personal message → quantity.

- Live preview: candle rendered with the chosen wax color inside the chosen packaging, message shown on the label.
- Price recalculates instantly: base price + packaging surcharge + color/scent surcharge, times quantity; personalization fee if a message is entered.
- Out-of-stock options greyed out with a note.
- Add to cart stores the full configuration; cart persists between visits.

## Checkout & payment

- Fields: name, e-mail, phone, Zásilkovna/Packeta pickup point (searchable list of pickup points the admin maintains, plus free-text), order note, legal consent checkbox.
- Payment: Czech QR payment code (SPAYD) + bank transfer details, with the order number as the variable symbol. Order is created as "awaiting payment"; you confirm payment manually in the admin.
- Confirmation page shows the QR code and full summary.

## Automated e-mails

- **Order confirmation** (sent immediately): order number, scent, color, packaging, personal message, quantity, total price, QR payment details and bank info, pickup point.
- **Shipping confirmation** (sent when you mark the order as shipped in the admin): tracking number and a link to track it.
- Both bilingual — sent in the language the customer ordered in.

## Admin

Password-protected admin area (your account only):

- **Orders**: list with status (new / paid / shipped / cancelled), detail with full configuration, mark as paid, enter tracking number and mark as shipped (triggers the shipping e-mail).
- **Catalog**: manage scents, colors, packaging — name and description in both languages, image, price surcharge, stock quantity, active/inactive.
- **Settings**: base price, bank account for the QR payment, shipping price, contact details.
- **Pickup points**: manage the Packeta pickup point list.

## Content

I'll create realistic placeholder catalog data — 10 scents, 10 colors, 10 packaging options with Czech + English names, descriptions and sensible Czech pricing — plus generated candle imagery. Everything is editable in the admin afterwards.

## Technical notes

- Lovable Cloud provides the database, admin authentication, image storage and server functions (order creation, QR/SPAYD generation, e-mail sending). No external accounts needed from you.
- Data model: `scents`, `colors`, `packagings`, `pickup_points`, `settings`, `orders`, `order_items` (each item stores the chosen scent/color/packaging + message + price snapshot). Row-level security: public read of active catalog rows, order insert by anyone, order read/update restricted to admin via a separate `user_roles` table.
- Cart lives client-side; prices are recalculated and validated server-side when the order is placed so they can't be tampered with.
- i18n through a lightweight translation dictionary plus bilingual columns in the database; each language has its own URL path for SEO, with per-page titles, descriptions and social previews.
- E-mails are sent from a server function; you'll be asked once for a sending address/API key when we wire that up.

## Out of scope for now

Live Packeta API (pickup widget, automatic labels/tracking) and card payments — the site is built so both can be added later without rework.
