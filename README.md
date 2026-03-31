# 💰 ExpensiGo – Expense & Budget Management App

ExpensiGo is a full-stack expense tracking and budget management app built with the Next.js App Router. Users manage budgets, categorise expenses, and view analytics through a responsive dashboard.

🔗 **[Live App](https://expensigo.vercel.app/)**

For local setup and environment variables, see **[SETUP.md](./SETUP.md)**.

---

## 📌 Features

- 🔐 **Authentication** with Clerk (sign-in, sign-up, protected routes)
- 👤 **Multi-user** data isolation via server-side API routes
- 📊 **Dashboard** with budgets, expenses, charts (Recharts), and AI-assisted quick inputs
- ➕ **CRUD** for budgets and expenses
- 📈 **Totals** and category breakdowns per budget
- 💾 **PostgreSQL** persistence (Neon) via Drizzle ORM
- 💳 **Stripe** integration for subscriptions and billing portal
- 🤖 **OpenAI** for natural-language parsing of expenses and budgets (AI quick actions)
- 📱 **Responsive** layout (mobile-first)
- 🎯 **Demo mode** for recruiters (seeded data, optional scheduled reset)

---

## 🛠️ Tech Stack

| Category        | Technologies                                                                 |
| --------------- | ------------------------------------------------------------------------------ |
| **Frontend**    | Next.js 15 (App Router), React 18, JavaScript, Tailwind CSS, Radix UI, Framer Motion |
| **State**       | React Context (budget, subscription, notifications), client `fetch` to APIs |
| **Backend**     | Next.js Route Handlers (`app/api/*`), Drizzle ORM, PostgreSQL (Neon serverless) |
| **Auth**        | Clerk                                                                          |
| **Payments**    | Stripe (checkout, webhooks, customer portal)                                   |
| **AI**          | OpenAI API (ai-parse route)                                                    |
| **Charts**      | Recharts                                                                       |
| **Deployment**  | Vercel (optional cron for demo data reset)                                   |

---

## 🧠 Architecture Overview

- **Routing:** `app/` uses the App Router with route groups `(auth)` for sign-in/sign-up and `(routes)/dashboard` for the main app shell (layout, nav, pages).
- **Client vs server:** Dashboard pages are mostly client components; mutations use `fetch` to `/api/*` routes. No direct database access from the browser.
- **Data:** `lib/db.js` wires Drizzle to Neon; `utils/schema.js` defines tables (`budgets`, `expenses`, `categories`).
- **Auth:** `middleware.ts` uses `clerkMiddleware` for public routes and `auth.protect()` elsewhere. APIs resolve the current user via Clerk (`auth`, `currentUser`) and scope data by user email.
- **Cross-cutting:** `app/Provider.jsx` wraps the app with `ClerkProvider` and React contexts (`BudgetProvider`, `SubscriptionProvider`, `NotificationProvider`).

---

## 📊 Core Functionalities

### Budget Management

- Create multiple budgets with limits, icons, and colours
- Track spend per budget and remaining balance

### Expense Tracking

- Add expenses under budgets; categories align with budget names
- Edit and delete expenses; totals update from API data

### Analytics & Export

- Dashboard charts and summaries
- Export routes for budgets/expenses where implemented

### Demo Mode (Recruiters)

- Demo user is configured in Clerk (`publicMetadata.demo === true` recommended) and matches `DEMO_USER_EMAIL` in env.
- **Try demo:** `/sign-in?demo=user` redirects to `/api/demo-login`, which seeds demo data and issues a Clerk sign-in ticket.
- **Scheduled reset:** Vercel cron can call `GET /api/reset-demo` every 30 minutes (see `vercel.json`); set `CRON_SECRET` in Vercel and send `Authorization: Bearer <CRON_SECRET>`.
- **Manual reset:** Demo users can call `POST /api/reset-demo` when authenticated.
- Seed definitions live in `lib/demoSeed.js`; reset logic in `lib/resetDemoData.js`.

### Authentication & Security

- Clerk handles sessions; APIs enforce ownership using the authenticated user’s email
- Middleware protects non-public routes
- Stripe webhooks and optional Clerk webhooks are separate from demo data; demo password reset via webhooks is not required for the demo flow

---

## 🎯 Learning Highlights

This project demonstrates:

- Full-stack patterns with Next.js App Router and route handlers
- Clerk-integrated auth and secure, user-scoped API design
- Drizzle ORM with PostgreSQL
- CRUD and reporting flows for a finance-style dashboard
- Production-oriented deployment (e.g. Vercel + Neon)
