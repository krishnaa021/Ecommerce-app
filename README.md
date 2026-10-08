# E-Commerce App

A full-stack fashion and lifestyle e-commerce platform built with React on the frontend and Node.js/Express on the backend. The app includes product browsing, search and filtering, cart and wishlist functionality, user authentication, checkout, and order tracking.

## Deployed Link

[View the site live on vercel]( https://ecommerce-app-lytt.vercel.app/)

## Overview

This project is designed as a complete ecommerce experience with:

- Responsive storefront built in React + Vite
- REST API built with Express and MongoDB
- JWT-based authentication and protected routes
- Product catalog with category, search, and size-based inventory handling
- Cart, wishlist, checkout, and user order management

## Features

### Customer Experience
- Browse products by category: men, women, kids
- Search and filter products by keyword, category, and subcategory
- View detailed product information and stock availability by size
- Save favorite products to a wishlist
- Add products to cart, adjust quantities, and proceed to checkout
- Track previous orders in a profile/dashboard flow

### Backend Functionality
- Secure user registration and login using JWT
- Password hashing with bcryptjs
- Product, cart, order, and wishlist API routes
- MongoDB integration using Mongoose models
- Inventory-aware checkout logic

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios |
| Styling | CSS, responsive UI components |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |

## Project Structure

```text
Ecommerce-app/
├─ .env.example
├─ app.js
├─ server.js
├─ seed.js
├─ package.json
├─ config/
│  └─ db.js
├─ controllers/
│  ├─ authController.js
│  ├─ cartController.js
│  ├─ orderController.js
│  ├─ productController.js
│  └─ wishlistController.js
├─ middlewares/
│  └─ authMiddleware.js
├─ models/
│  ├─ Cart.js
│  ├─ Order.js
│  ├─ Product.js
│  └─ User.js
├─ routes/
│  ├─ authRoutes.js
│  ├─ cartRoutes.js
│  ├─ orderRoutes.js
│  ├─ productRoutes.js
│  └─ wishlistRoutes.js
├─ utils/
│  └─ generateToken.js
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ index.html
│  ├─ public/
│  └─ src/
│     ├─ api/
│     ├─ components/
│     ├─ context/
│     ├─ pages/
│     ├─ routes/
│     ├─ App.jsx
│     ├─ main.jsx
│     └─ index.css
└─ README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Ecommerce-app
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using the example file as a reference:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

You can copy the sample file:

```bash
copy .env.example .env
```

### 4. Seed sample products (optional)

```bash
node seed.js
```

### 5. Start the backend

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

### 6. Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the Vite local URL, typically:

```text
http://localhost:5173
```

### 7. Frontend environment

Create a `.env` file inside `frontend/` if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

## Main API Endpoints

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile

GET  /api/products
GET  /api/products/:id

GET  /api/cart
POST /api/cart
PUT  /api/cart/:id
DELETE /api/cart/:id

GET  /api/orders
POST /api/orders

GET  /api/wishlist
POST /api/wishlist
DELETE /api/wishlist/:id
```

## Notes

- The project is ready for local development and can be deployed to a cloud platform with a Node.js runtime and MongoDB database.
- Update the deployed link above once your app is live.
- For production, use a secure `JWT_SECRET` and a hosted MongoDB instance such as MongoDB Atlas.

## License

This project is for learning and portfolio use unless otherwise specified.
