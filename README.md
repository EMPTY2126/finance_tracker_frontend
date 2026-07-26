# Ledger — Finance Tracker (Frontend)

A React frontend for a personal finance tracking API — dashboard analytics, transaction and budget management, all backed by a Spring Boot + JWT backend.

![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-8B93A1)

---

## Table of contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Tech stack](#tech-stack)
- [Features](#features)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [How auth works](#how-auth-works)
- [API integration](#api-integration)
- [Known limitations](#known-limitations)
- [License](#license)

---

## Overview

Ledger is the client for the [`finance_tracking`](https://github.com/EMPTY2126/finance_tracking) Spring Boot API. It covers the full workflow of tracking personal finances: signing in, logging income and expenses, setting monthly budgets per category, and reviewing spending trends on a dashboard.

## Screenshots

| Login | Dashboard |
|---|---|
| ![Login screen](./docs/screenshots/login.png) | ![Dashboard](./docs/screenshots/dashboard.png) |

| Transactions |
|---|
| ![Transactions](./docs/screenshots/transactions.png) |

## Tech stack

| Layer | Choice |
|---|---|
| UI library | React 18 |
| Build tool | Vite 5 |
| Routing | React Router 6 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| HTTP client | Axios |

## Features

- **Auth** — cookie-based session (httpOnly JWT), login and registration forms with inline validation
- **Dashboard** — income / expense / budget summary cards, spend-vs-budget chart by category, monthly income-vs-expense trend, recent activity feed, month & year selector
- **Transactions** — create, edit, delete; filter by type, category, date range, and amount range; server-side pagination
- **Budgets** — create, edit, delete monthly limits per category; filter by category, month, and year; server-side pagination
- Centralized error handling that surfaces the backend's actual error message
- Responsive layout down to mobile, visible keyboard focus states

## Getting started

### Prerequisites

- Node.js 18+
- The [backend](https://github.com/EMPTY2126/finance_tracking) running locally on port `8080`

### Install & run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. In development, `vite.config.js` proxies all `/api/*`
requests to `http://localhost:8080`, so the browser treats the app and API as same-origin — this
is what makes the httpOnly `jwt` cookie work without any backend CORS configuration.

### Build for production

```bash
npm run build
npm run preview   # serve the production build locally to sanity-check it
```

## Environment variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `VITE_API_URL` | No | `/api` (proxied) | Override the API base URL for production builds, e.g. `https://api.yourdomain.com` |

Copy `.env.example` to `.env` and fill in values as needed.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with API proxying |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built app locally |

## Project structure

```
src/
├── api/            axios calls per resource — auth, transactions, budgets, dashboard
├── context/         AuthContext: session state, login / register / logout
├── components/       forms, tables, filter bars, layout, pagination
├── pages/            Login, Register, Dashboard, Transactions, Budgets
├── constants.js       enum values shared with the backend, formatters
├── App.jsx            route definitions
└── main.jsx            entry point
```

## How auth works

1. `POST /auth/login` authenticates against the backend and sets an httpOnly `jwt` cookie — the
   frontend never reads or stores the token itself.
2. Every subsequent request is sent with `withCredentials: true`, so the cookie is included
   automatically.
3. On load, `AuthContext` pings a protected endpoint (`/test/gettest`) to determine whether the
   session is still valid, since the backend doesn't expose a dedicated `/auth/me` endpoint.
4. "Logout" clears local app state. Because the cookie is httpOnly, the frontend cannot clear it
   directly — see [Known limitations](#known-limitations).

## API integration

| Endpoint | Used for |
|---|---|
| `POST /auth/login` | Sign in |
| `POST /auth/register` | Create account |
| `GET /dashboard?month&year` | Dashboard summary, charts, recent transactions |
| `GET /transactions` | Paginated, filterable transaction list |
| `POST /transactions` | Create transaction |
| `PUT /transactions/{id}` | Update transaction |
| `DELETE /transactions/{id}` | Delete transaction |
| `GET /budgets` | Paginated, filterable budget list |
| `POST /budgets` | Create budget |
| `PUT /budgets/{id}` | Update budget |
| `DELETE /budgets/{id}` | Delete budget |

Full request/response shapes are documented in the backend's own README.

## Known limitations

These stem from the current backend, not the frontend, and are worth closing on the API side:

- **No CORS config** — fine for local dev thanks to the Vite proxy, but a deployed frontend on
  its own domain needs the backend to allow its origin with credentials.
- **No logout endpoint** — logout only clears local state; the httpOnly cookie expires on its own.
- **No `/auth/me` endpoint** — session validity is inferred from a protected-route probe rather
  than a dedicated check.

## License

MIT
