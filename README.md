# 🏋️ GearUp Frontend

> **Rent Sports & Outdoor Gear Instantly.** A responsive Next.js app where customers rent equipment, providers manage inventory and orders, and admins moderate the platform.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui** and **TanStack Query**, on top of the GearUp REST API.

---

## ✨ Features

### Public

- Landing page with a stock-photo hero, gear search, a category grid, featured gear carousel, how-it-works and contact sections
- **Gear catalog** (`/gear`) with search, category, brand, price range, availability and rental-date filters, sorting, pagination and skeleton loaders. Filters live in the URL, so results are shareable.
- **Gear details** (`/gear/[id]`) with an image gallery, specifications, provider card, renter reviews and a **Rent Now** card with a date-range picker

### Customer

- Register or log in with inline validation (React Hook Form + Zod) and toast feedback
- Date pickers block past dates and dates you've already booked for the same item
- Checkout page places a rental request, then follows the order status flow
- **Pay Now** once the provider confirms, via **Stripe Checkout**, with `/payment/success` and `/payment/cancel` pages
- Dashboard: overview, rentals with status badges and a timeline, payment history, reviews (leave one after gear is returned) and profile

### Provider

- Overview with total gear, active rentals, pending orders, revenue chart and new requests
- Inventory table with search, filters, pagination, availability toggle and delete confirmation
- Shared add/edit gear form: image URL or upload, pricing, stock and availability
- Orders table with **Confirm → Mark Picked Up → Mark Returned** (and Cancel) actions. Updates are optimistic, so the table changes instantly and rolls back on error.

### Admin

- Platform overview: users, active gear, rentals, revenue and monthly rentals chart
- User management with search, role/status filters, pagination and Suspend/Activate
- Moderation views for all gear listings and all rental orders
- Category management

### Rental status badges

| Status      | Badge  | Next action               |
| ----------- | ------ | ------------------------- |
| `PLACED`    | Amber  | Provider: **Confirm**     |
| `CONFIRMED` | Blue   | Customer: **Pay Now**     |
| `PAID`      | Violet | Provider: **Mark Picked Up** |
| `PICKED_UP` | Green  | Provider: **Mark Returned** |
| `RETURNED`  | Gray   | Customer: **Leave Review** |
| `CANCELLED` | Red    | —                         |

---

## 🛠 Tech stack

| Area          | Choice                                    |
| ------------- | ----------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack)        |
| UI            | React 19, Tailwind CSS v4, shadcn/ui (Radix) |
| Server state  | TanStack Query v5                         |
| Forms         | React Hook Form + Zod                     |
| Dates         | react-day-picker, date-fns                |
| Charts        | Recharts                                  |
| Toasts        | Sonner                                    |
| Theming       | next-themes (light / dark / system)       |

---

## 🚀 Getting started

### 1. Prerequisites

- Node.js **20.9+**
- The GearUp backend running locally or deployed

### 2. Install and configure

```bash
npm install
cp .env.example .env.local
```

Set the backend URL in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 3. Configure the backend's Stripe redirects

For payments to come back to this app, set these in the **backend** `.env`:

```env
CLIENT_SUCCESS_URL=http://localhost:3000/payment/success
CLIENT_CENCEL_URL=http://localhost:3000/payment/cancel
```

Orders only switch to `PAID` after Stripe calls the backend webhook. Locally, run `npm run stripe:webhook` in the backend.

### 4. Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

---

## 🧭 Routes

```text
/                                     Home
/gear                                 Browse & filter gear
/gear/[id]                            Gear details + Rent Now
/checkout/[gearId]                    Checkout (customer)
/auth/login  /auth/register           Authentication
/payment/success  /payment/cancel     Stripe outcome pages (customer)

/dashboard/customer                   Overview
  /orders, /orders/[id], /orders/[id]/pay, /payments, /reviews, /profile

/dashboard/provider                   Overview
  /gear, /gear/new, /gear/[id]/edit, /orders, /profile

/dashboard/admin                      Overview
  /users, /gear, /orders, /categories, /profile
```

---

## 🏗 Architecture

```text
Browser ──fetch /api/*──▶ app/api/[...path]/route.ts ──Bearer token──▶ GearUp API
           (same origin)     reads httpOnly cookie
```

- **Backend-for-frontend proxy.** Client components call `/api/...` on the Next.js server. The route handler attaches the `accessToken` from an httpOnly cookie, so tokens never reach browser JavaScript. On a `401` it tries the refresh token once, then clears the session.
- **Route protection (`proxy.ts`).** Next 16's proxy (formerly middleware) decodes the JWT to redirect guests to login and keep each role inside its own dashboard. Role layouts also double-check the user against `/auth/get-me`.
- **Auth.** Login and register are Server Actions that set httpOnly cookies. Forms validate with Zod before anything is sent.
- **Data layer.** `services/*` wraps each API module, `hooks/*` exposes typed TanStack Query hooks with cache invalidation, optimistic updates and toasts.

```text
app/            routes, layouts, loading/error/not-found boundaries, /api proxy
components/     ui (shadcn), shared, home, gears, rental, customer, provider, admin, charts
hooks/          TanStack Query hooks per module
services/       API clients (browser) + server fetchers
lib/            api client, formatting, constants, validation schemas, images
types/          shared TypeScript models
proxy.ts        role-based route protection
```

---

## 🔌 API mapping

| Frontend                          | Backend endpoint                                   |
| --------------------------------- | -------------------------------------------------- |
| Home, `/gear`                     | `GET /gear`, `GET /categories`                     |
| `/gear/[id]`                      | `GET /gear/:id`, `GET /review/gear/:gearItemId`    |
| Register / Login                  | `POST /auth/register`, `POST /auth/login`, `GET /auth/get-me` |
| Checkout                          | `POST /rentals`                                    |
| Customer rentals                  | `GET /my-rentals`, `GET /rentals/:id`              |
| Pay Now / success page            | `POST /payment/create`, `GET /payment/confirm`     |
| Payment history                   | `GET /payment`                                     |
| Reviews                           | `POST /review`, `GET /review/my-reviews`, `DELETE /review/:id` |
| Provider inventory                | `GET/POST /provider/gear`, `PUT/DELETE /provider/gear/:id` |
| Provider orders                   | `GET /provider/orders`, `PATCH /provider/orders/:id` |
| Admin users                       | `GET /admin/users`, `PATCH /admin/users/:id`       |
| Admin rentals                     | `GET /admin/rentals`                               |
| Admin gear / categories           | `GET /gear`, `GET/POST /categories`                |

### Notes on the current backend

- The **admin user and rental endpoints** aren't in `gearup-backend` yet. Those admin views show a clear "API not available" state until the routes exist.
- The backend mounts customer auth in front of `/api/review`, so **public review reads need a customer login**. Guests see a sign-in prompt instead of an error.
- Image **uploads** use the backend's Cloudinary account. Pasting an image URL works without it.

---

## 🖼 Image credits

Stock photography from [Unsplash](https://unsplash.com), stored in `public/images`.

---

## 📄 License

Developed as part of an academic assignment for educational purposes.
