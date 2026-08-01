# 🏋️ GearUp Frontend

> A modern, responsive, and scalable sports & outdoor equipment rental platform built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Shadcn UI**, and **TanStack Query**.

---

## 📖 Overview

GearUp is a full-featured frontend application for an online sports and outdoor equipment rental platform. Customers can browse equipment, book rental dates, complete payments, and manage their rental history. Providers can manage inventory and rental orders, while administrators oversee users, equipment, and platform activities.

This project follows a **feature-based architecture**, reusable component design, and modern frontend engineering best practices for scalability and maintainability.

---

# ✨ Features

## 🌐 Public Features

- Responsive landing page
- Featured equipment section
- Browse all equipment
- Advanced search
- Filter by
  - Category
  - Brand
  - Price
  - Availability
- Equipment details page
- Image gallery
- Equipment specifications
- Provider information
- Rent Now section
- Responsive UI
- Skeleton loading
- Error pages
- Empty states

---

## 👤 Authentication

- User Registration
- Login
- Role Selection
- JWT Authentication
- Protected Routes
- Middleware Authorization
- Session Persistence
- Logout

Supported Roles

- Customer
- Provider
- Admin

---

## 🏋️ Customer Features

- Browse available equipment
- Select rental dates
- Checkout page
- Payment integration
- Payment Success page
- Payment Cancel page
- Rental history
- Payment history
- Order tracking
- Review submission

---

## 🏪 Provider Features

- Provider Dashboard
- Dashboard statistics
- Add equipment
- Update equipment
- Delete equipment
- Inventory management
- Order management
- Update rental status
- Active rental overview

---

## 👑 Admin Features

- Admin Dashboard
- Platform statistics
- User management
- Suspend users
- Activate users
- Equipment moderation
- Rental moderation

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Library | Shadcn UI |
| State Management | TanStack Query |
| Forms | React Hook Form |
| Validation | Zod |
| HTTP Client | Axios |
| Notifications | Sonner |
| Date Picker | React Day Picker |
| Charts | Recharts |
| Icons | Lucide React |
| Utilities | date-fns |

---

# 📁 Project Structure

```text
src
│
├── app
│   ├── (public)
│   ├── (auth)
│   ├── (dashboard)
│   ├── payment
│   ├── api
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components
│   ├── ui
│   ├── layout
│   ├── common
│   ├── cards
│   ├── forms
│   ├── tables
│   ├── charts
│   ├── feedback
│   └── providers
│
├── features
│   ├── auth
│   ├── gear
│   ├── rental
│   ├── payment
│   ├── review
│   ├── provider
│   └── admin
│
├── hooks
├── lib
├── services
├── store
├── constants
├── types
├── utils
├── middleware.ts
└── assets
```

---

# 📂 Route Structure

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
│   ├── customer
│   │   ├── orders
│   │   ├── payments
│   │   └── reviews
│   │
│   ├── provider
│   │   ├── gear
│   │   ├── inventory
│   │   └── orders
│   │
│   └── admin
│       ├── users
│       ├── gear
│       └── rentals
│
└── payment
    ├── success
    └── cancel
```

---

# 🔐 Role-Based Access

## Customer

- Browse Gear
- Rent Equipment
- Checkout
- Payment
- Order Tracking
- Reviews

---

## Provider

- Dashboard
- Equipment CRUD
- Inventory
- Rental Orders
- Status Updates

---

## Admin

- Dashboard
- User Management
- Platform Statistics
- Equipment Moderation
- Rental Moderation

---

# ⚙️ Architecture

This project follows a **Feature-Based Architecture** instead of organizing code by pages.

```text
Feature
│
├── api
├── hooks
├── components
├── types
├── validation
└── utils
```

Each feature owns its:

- API calls
- Components
- Hooks
- Validation
- Types
- Utilities

This keeps the project modular and easy to maintain.

---

# 📦 API Layer

The application uses a dedicated service layer.

```text
services

├── api.ts
├── auth.service.ts
├── gear.service.ts
├── rental.service.ts
├── payment.service.ts
├── provider.service.ts
└── admin.service.ts
```

UI components never call Axios directly.

---

# 🔄 State Management

## Server State

Managed by **TanStack Query**

- Equipment
- Orders
- Users
- Payments
- Reviews
- Dashboard Statistics

---

## Client State

Managed by React Context

- Authentication
- Theme
- Sidebar
- Modal

---

## URL State

- Search
- Filters
- Pagination
- Sorting

Example

```text
/gear
?search=football
&category=ball
&brand=nike
&minPrice=100
&maxPrice=1000
&page=2
```

---

# 🎨 UI Components

Reusable Components

- Button
- Input
- Select
- Badge
- Dialog
- Drawer
- Table
- Card
- Pagination
- Avatar
- Calendar
- Tooltip
- Skeleton
- Empty State
- Alert

---

# 📊 Dashboard Components

- Sidebar
- Topbar
- Dashboard Header
- Statistics Cards
- Recent Orders
- Revenue Charts
- Activity Feed

---

# 📝 Forms

- Login Form
- Registration Form
- Equipment Form
- Rental Form
- Checkout Form
- Review Form

Built using

- React Hook Form
- Zod Validation

---

# 🔒 Route Protection

Protected using **Next.js Middleware**

```text
Visitor

↓

Login

↓

JWT Cookie

↓

Middleware

↓

Role Validation

↓

Authorized Route
```

Supported Roles

- Customer
- Provider
- Admin

---

# 🎯 Rental Status

| Status | Badge Color |
|----------|-------------|
| PLACED | Orange |
| CONFIRMED | Blue |
| PAID | Purple |
| PICKED_UP | Green |
| RETURNED | Gray |
| CANCELLED | Red |

---

# ⚡ Performance Optimizations

- Server Components
- React Query Caching
- Image Optimization
- Lazy Loading
- Dynamic Imports
- Pagination
- Debounced Search
- Skeleton Loading
- Code Splitting

---

# 📱 Responsive Design

Optimized for

- Mobile
- Tablet
- Laptop
- Desktop

Dashboard tables automatically adapt to mobile-friendly cards.

---

# ♿ Accessibility

- Semantic HTML
- Keyboard Navigation
- Focus States
- Accessible Forms
- Proper Labels
- Color Contrast
- Screen Reader Friendly Components

---

# 🎨 Design Principles

- Clean UI
- Minimal Design
- Consistent Spacing
- Reusable Components
- Scalable Architecture
- Feature-Based Structure
- Type-Safe Development

---

# 🚀 Development Roadmap

- [x] Project Setup
- [ ] Authentication
- [ ] Public Pages
- [ ] Equipment Module
- [ ] Customer Dashboard
- [ ] Provider Dashboard
- [ ] Admin Dashboard
- [ ] Payment Integration
- [ ] Reviews
- [ ] Responsive Design
- [ ] Performance Optimization
- [ ] Testing
- [ ] Final Deployment

---

# 📌 Engineering Principles

- Feature-Based Folder Structure
- Clean Code
- SOLID Principles
- Reusable Components
- Separation of Concerns
- Strict TypeScript
- No `any`
- Modular Services
- Reusable Hooks
- Scalable Architecture
- Optimized Rendering
- Consistent UI System

---

# 📄 License

This project was developed as part of an academic assignment for educational purposes.