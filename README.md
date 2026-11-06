# Jumia-inspired full-stack store

A learning project inspired by the layout and shopping flow of Jumia Nigeria. It is not affiliated with Jumia and uses original demo branding/content.

## Requirements
- Node.js 20.19+ (or a current supported LTS release)
- npm

## Run locally
1. Extract the ZIP and open the `jumia-inspired-fullstack` folder in VS Code.
2. Open Terminal → New Terminal.
3. Install dependencies from the project root:
   ```bash
   npm install
   ```
4. Start the API and React development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173

The API runs at http://localhost:4000. On first run it creates `server/data/store.db` and seeds demo products.

## Included features
- Responsive React + Tailwind CSS storefront
- Express REST API for product listing and order creation
- SQLite database with demo product seed data
- Search, category filtering, product detail modal
- Cart quantity controls and localStorage persistence
- Demo checkout that records an order in SQLite

## API routes
- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/orders`

Example order body:
```json
{
  "customer": {
    "name": "Ada Okafor",
    "email": "ada@example.com",
    "phone": "08012345678",
    "address": "Ikeja, Lagos"
  },
  "items": [{ "productId": 1, "quantity": 2 }]
}
```

## Important production work
This is a functional learning MVP, not a production marketplace. Before deploying:
- Add authentication, authorization, rate limiting, validation and security headers.
- Integrate a payment provider (e.g. Paystack) on the server; never collect/store card details yourself.
- Add admin product management, image hosting, order status management and transactional email.
- Configure HTTPS, backups, logging, monitoring and production environment variables.
- Replace demo product content/images with assets you own or are licensed to use.
