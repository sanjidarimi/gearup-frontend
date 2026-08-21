
## Recommended Tech Stack

| Area           | Technology                   |
| -------------- | ---------------------------- |
| Framework      | Next.js App Router           |
| Language       | TypeScript                   |
| Styling        | Tailwind CSS                 |
| UI Components  | shadcn/ui                    |
| Server State   | TanStack Query               |
| API Client     | Axios                        |
| Forms          | React Hook Form              |
| Validation     | Zod                          |
| Icons          | Lucide React                 |
| Notifications  | Sonner                       |
| Date Handling  | date-fns                     |
| Authentication | Backend JWT/session strategy |
| Payment        | Stripe Checkout / SSLCommerz |
| Deployment     | Vercel                       |

**TypeScript rule:** strict mode, no `any`.

---

# Updated Milestone Structure

I would use **8 major milestones** instead of splitting every small concern into a separate milestone.

```text
M1  Foundation & Architecture
 ↓
M2  Authentication & Authorization
 ↓
M3  Public Gear Experience
 ↓
M4  Customer Rental & Payment
 ↓
M5  Customer Dashboard
 ↓
M6  Provider Dashboard
 ↓
M7  Admin Dashboard
 ↓
M8  Polish, Testing & Deployment
```

---

# M1: Foundation & Architecture

### Goal

Set up the entire Next.js application structure.

### Tasks

* Initialize Next.js with App Router
* Configure TypeScript strict mode
* Configure Tailwind CSS
* Configure shadcn/ui
* Configure Axios
* Configure TanStack Query
* Configure React Hook Form
* Configure Zod
* Configure Sonner
* Configure environment variables
* Create API client
* Create common types
* Create shared UI components
* Create public layout
* Create dashboard layouts

### Folder structure

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── gear/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── dashboard/
│   │   ├── customer/
│   │   ├── provider/
│   │   └── admin/
│   │
│   ├── payment/
│   │   ├── success/
│   │   └── cancel/
│   │
│   ├── error.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── layout.tsx
│   └── providers.tsx
│
├── components/
│   ├── ui/
│   ├── shared/
│   ├── layout/
│   └── forms/
│
├── features/
│   ├── auth/
│   ├── gear/
│   ├── rental/
│   ├── payment/
│   ├── provider/
│   └── admin/
│
├── hooks/
├── services/
├── types/
├── schemas/
├── lib/
├── constants/
└── utils/
```

---

# M2: Authentication & Authorization

### Routes

```text
/auth/login
/auth/register
```

### Features

* Login
* Registration
* Role selection
* Logout
* Current user
* Auth state
* Token handling
* Role-based redirects
* Middleware protection

### Roles

```text
CUSTOMER
PROVIDER
ADMIN
```

After login:

```text
CUSTOMER
    ↓
/dashboard/customer

PROVIDER
    ↓
/dashboard/provider

ADMIN
    ↓
/dashboard/admin
```

---

# M3: Public Gear Experience

### Routes

```text
/
/gear
/gear/[id]
```

### Features

#### Home

* Hero
* Search
* Featured gear
* Categories
* How it works
* CTA

##### Categories

* Cycling Gear
* Camping & Trekking
* Water Sports
* Winter Expeditions

Category filtering dynamically displays gear matching the selected category. Categories are shown as filter buttons in the gear catalog and on the home page for quick browsing.

##### How it works

* Browse gear by category or search
* Select rental dates
* Reserve and pay securely
* Provider approval
* Pick up gear
* Return and receive refund

#### Gear

* Gear grid
* Search
* Category filter
* Brand filter
* Price range
* Availability
* Pagination
* Loading state
* Empty state

#### Gear Details

* Image gallery
* Gear information
* Specifications
* Provider information
* Price/day
* Availability
* Rental date picker
* Rent Now

---

# M4: Customer Rental & Payment

### Routes

```text
/dashboard/customer/orders/[id]/pay

/payment/success
/payment/cancel
```

### Flow

```text
Gear Details
      ↓
Select Rental Dates
      ↓
Rent Now
      ↓
Create Rental
      ↓
Checkout
      ↓
Payment Gateway
      ↓
Success / Cancel
```

### Important UI

Date picker should prevent:

```text
Past dates
Unavailable dates
Invalid date ranges
```

Checkout should show:

```text
Gear
Rental period
Number of days
Price per day
Total
Payment button
```

---

# M5: Customer Dashboard

## Sidebar Routes

I recommend:

```text
/dashboard/customer
/dashboard/customer/orders
/dashboard/customer/payments
/dashboard/customer/profile
```

### Sidebar

```text
Customer Dashboard

Overview
My Rentals
Payments
Profile

----------------
Logout
```

### Overview

```text
/dashboard/customer
```

Show:

* Total rentals
* Active rentals
* Pending payments
* Completed rentals
* Recent orders

### My Rentals

```text
/dashboard/customer/orders
```

Show:

* Order ID
* Gear
* Rental dates
* Amount
* Status
* Actions

### Order Details

```text
/dashboard/customer/orders/[id]
```

Show:

* Gear
* Provider
* Rental dates
* Payment status
* Rental status
* Price breakdown
* Available action

Example:

```text
PLACED
→ Waiting for provider

CONFIRMED
→ Pay Now

PAID
→ Waiting for pickup

PICKED_UP
→ Currently rented

RETURNED
→ Leave Review
```

### Payments

```text
/dashboard/customer/payments
```

Show:

* Payment ID
* Order
* Amount
* Method
* Status
* Date

### Profile

```text
/dashboard/customer/profile
```

---

# M6: Provider Dashboard

This should have its own reusable dashboard layout.

## Sidebar Routes

```text
/dashboard/provider
/dashboard/provider/gear
/dashboard/provider/gear/new
/dashboard/provider/orders
/dashboard/provider/profile
```

### Sidebar

```text
Provider Dashboard

Overview
My Gear
Orders

----------------
Profile
Logout
```

---

## Provider Overview

```text
/dashboard/provider
```

Cards:

```text
Total Gear
Active Rentals
Pending Orders
Total Revenue
```

Also show:

* Recent orders
* Recent gear
* Quick actions

---

## My Gear

```text
/dashboard/provider/gear
```

Table:

```text
Image
Name
Category
Price / Day
Stock
Availability
Actions
```

Actions:

```text
Edit
Delete
Toggle Availability
```

---

## Add Gear

```text
/dashboard/provider/gear/new
```

Form:

```text
Name
Description
Category
Brand
Price per Day
Stock
Images
Specifications
Availability
```

---

## Edit Gear

```text
/dashboard/provider/gear/[id]/edit
```

Reuse the same:

```text
GearForm
```

instead of creating another form.

---

## Provider Orders

```text
/dashboard/provider/orders
```

Table:

```text
Order ID
Customer
Gear
Rental Dates
Amount
Status
Actions
```

Actions based on status:

```text
PLACED
    ↓
Confirm

PAID
    ↓
Mark Picked Up

PICKED_UP
    ↓
Mark Returned
```

---

# M7: Admin Dashboard

Admin needs a slightly more powerful sidebar.

## Sidebar Routes

```text
/dashboard/admin
/dashboard/admin/users
/dashboard/admin/gear
/dashboard/admin/orders
/dashboard/admin/profile
```

### Sidebar

```text
Admin Dashboard

Overview

Management
├── Users
├── Gear
└── Orders

----------------
Profile
Logout
```

---

## Admin Overview

```text
/dashboard/admin
```

Statistics:

```text
Total Users
Active Users
Total Gear
Active Gear
Total Rentals
Total Revenue
```

---

## User Management

```text
/dashboard/admin/users
```

Features:

* Search
* Pagination
* User table
* Role
* Account status
* Suspend
* Activate

Example:

```text
Name
Email
Role
Status
Joined
Actions
```

---

## Gear Moderation

```text
/dashboard/admin/gear
```

Admin can inspect:

* Gear
* Provider
* Category
* Price
* Availability
* Status

---

## Rental Moderation

```text
/dashboard/admin/orders
```

Admin can inspect:

* Order
* Customer
* Provider
* Gear
* Amount
* Rental dates
* Status

---

# M8: Polish, Testing & Deployment

### UI

* Responsive design
* Mobile sidebar
* Skeleton loaders
* Empty states
* Error states
* Toast notifications
* Confirmation dialogs
* Accessible forms
* Keyboard navigation

### Performance

* `next/image`
* Proper caching
* React Query configuration
* Debounced search
* Pagination
* Avoid unnecessary client components
* Avoid unnecessary API calls

### Testing

Test the important flows:

```text
Register
↓
Login
↓
Browse Gear
↓
Select Dates
↓
Create Rental
↓
Payment
↓
Customer Dashboard
```

Provider:

```text
Login
↓
Add Gear
↓
Edit Gear
↓
Receive Order
↓
Confirm
↓
Pick Up
↓
Return
```

Admin:

```text
Login
↓
View Statistics
↓
Search Users
↓
Suspend / Activate
↓
Moderate Gear
↓
View Orders
```

---

# Final Route Map

This is the route structure I would actually use for the assignment:

```text
/
├── gear
│   └── [id]
│
├── auth
│   ├── login
│   └── register
│
├── dashboard
│   │
│   ├── customer
│   │   ├── page
│   │   ├── orders
│   │   │   └── [id]
│   │   │       └── pay
│   │   ├── payments
│   │   └── profile
│   │
│   ├── provider
│   │   ├── page
│   │   ├── gear
│   │   │   ├── new
│   │   │   └── [id]
│   │   │       └── edit
│   │   ├── orders
│   │   └── profile
│   │
│   └── admin
│       ├── page
│       ├── users
│       ├── gear
│       ├── orders
│       └── profile
│
└── payment
    ├── success
    └── cancel
```

## Sidebar Summary

| Customer   | Provider | Admin    |
| ---------- | -------- | -------- |
| Overview   | Overview | Overview |
| My Rentals | My Gear  | Users    |
| Payments   | Orders   | Gear     |
| Profile    | Profile  | Orders   |
| Logout     | Logout   | Profile  |
|            |          | Logout   |

One thing I'd **not** put in the sidebar is `/gear`. That's a public marketplace route, so the main navbar should handle it. The dashboard sidebar should stay focused on the user's role and tasks.

For this assignment, this structure gives you a clean separation between **public browsing, authentication, customer operations, provider operations, and admin operations**, while keeping the implementation small enough to finish properly.
