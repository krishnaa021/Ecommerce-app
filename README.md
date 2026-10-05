# Fashion E-Commerce Backend

A RESTful backend API for a fashion e-commerce platform built with Node.js, Express, and MongoDB. The system supports apparel variant inventory (sizes, stock), multi-field search and category filtering, user authentication, cart management, and order processing.

---

## Features

- **Authentication & Security:** JWT-based user authentication with protected routes.
- **Product Catalog:** Fashion-specific schema supporting demographic categories (`men`, `women`, `kids`), subcategories, tags, discount validation, and nested sizes (`size`, `stock`).
- **Search & Filtering:** Text indexing across `name`, `brand`, `subCategory`, and `description` with price and category filtering.
- **Cart Management:** Size-aware shopping cart operations.
- **Order Processing:** Stock verification and atomic inventory reduction per size upon checkout.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Local or Atlas) with Mongoose ODM
- **Auth:** JSON Web Tokens (JWT) & bcryptjs

---

## Project Structure

```text
Ecommerce-app/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic (auth, product, cart, order)
│   ├── models/          # Mongoose models (User, Product, Cart, Order)
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Auth & error handling middleware
│   ├── seed.js          # Database seeding script
│   ├── .env             # Environment variables (ignored by Git)
│   ├── .env.example     # Template for environment variables
│   └── server.js        # App entry point
├── package.json
└── README.md