# Mini E-Commerce Platform (MERN)

Full implementation of the 8-phase execution plan: React (Vite) + Redux Toolkit frontend,
Node.js/Express + MongoDB (Mongoose) backend, JWT auth with role-based access, cart, checkout,
orders, and admin/customer dashboards.

## Project structure

```
mini-ecommerce/
  backend/     Express API, MongoDB models, JWT auth, orders, products
  frontend/    React (Vite) + Redux Toolkit + Tailwind CSS
```

## Prerequisites

- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and a strong JWT_SECRET
npm run dev          # starts on http://localhost:5000
```

Seed sample products + an admin account (`admin@example.com` / `admin1234`):

```bash
node seed.js
```

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev          # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000` (see `vite.config.js`),
so no CORS config is needed in development beyond what's already in `server.js`.

## What's implemented (mapped to the execution plan)

- **Phase 1 - Setup**: Vite React frontend, Express backend, Mongoose connection, env config,
  all listed packages (React Router, Redux Toolkit, Axios, Tailwind, Express, Mongoose, JWT,
  bcrypt, Helmet, CORS).
- **Phase 2 - Auth**: `User` model with bcrypt password hashing, `/api/auth/register`,
  `/api/auth/login`, JWT middleware (`protect`), role-based `authorize('admin')` middleware.
- **Phase 3 - Products**: `Product` model, full admin CRUD, frontend listing with search
  (text index), category filter, price range, sort, and pagination.
- **Phase 4 - Cart**: Redux `cartSlice` with add/remove/update quantity, stock-aware quantity
  caps, derived subtotal/tax/shipping/total selector, persisted to localStorage.
- **Phase 5 - Orders**: Checkout page, `POST /api/orders` (uses a MongoDB transaction to
  validate stock and decrement it atomically), customer order history, admin order management
  with status updates.
- **Phase 6 - Dashboards**: `CustomerDashboard` (order history) and `AdminDashboard`
  (product CRUD UI + order status management).
- **Phase 7 - Security**: bcrypt hashing, JWT auth, Helmet, CORS restricted to `CLIENT_URL`,
  `express-rate-limit` (stricter on `/api/auth`), `express-validator` on register/login,
  Mongoose schema validation.
- **Phase 8 - Testing/docs**: see Postman section below, responsive Tailwind UI, this README,
  and `.env.example` in both `backend/` and `frontend/`.

## API quick reference (for Postman)

| Method | Endpoint                  | Auth        | Description                  |
|--------|----------------------------|-------------|-------------------------------|
| POST   | /api/auth/register          | Public      | Create account                |
| POST   | /api/auth/login             | Public      | Login, returns JWT            |
| GET    | /api/auth/me                | Bearer      | Current user profile          |
| GET    | /api/products                | Public      | List products (q, category, minPrice, maxPrice, sort, page, limit) |
| GET    | /api/products/:id            | Public      | Product detail                |
| GET    | /api/products/categories/list | Public     | Distinct categories            |
| POST   | /api/products                | Admin       | Create product                |
| PUT    | /api/products/:id             | Admin       | Update product                 |
| DELETE | /api/products/:id             | Admin       | Delete product                 |
| POST   | /api/orders                  | Bearer      | Place order (validates stock) |
| GET    | /api/orders/my                | Bearer      | Current user's orders          |
| GET    | /api/orders/:id                | Bearer      | Single order (owner or admin) |
| GET    | /api/orders                    | Admin       | All orders                     |
| PUT    | /api/orders/:id/status          | Admin       | Update order status            |

Send the JWT as `Authorization: Bearer <token>`.

## Next steps you may want to add

- Payment gateway integration (Stripe/Razorpay) — currently orders are created with `paymentStatus: 'unpaid'`.
- Image upload (Cloudinary/S3) instead of pasting image URLs in the admin form.
- Automated tests (Jest + Supertest for the API, Vitest/RTL for the frontend).
- Product reviews/ratings (schema fields exist on `Product` but aren't wired up yet).

## Admin account login details

Email: admin@example.com
Password: admin1234