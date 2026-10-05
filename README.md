# Fashion E-Commerce Platform 

A full-stack fashion e-commerce web application featuring a React-based frontend and an Express/Node.js REST API with MongoDB. The application supports demographic shopping categories (`men`, `women`, `kids`), variant-level apparel sizing, real-time cart synchronization, secure authentication, and order workflows.

---

## Features

### Frontend (Client)
- **Responsive UI:** Built with React, featuring a responsive navigation bar, category filters, and product grids[cite: 2].
- **Apparel Catalog & Filtering:** Browse by gender demographic (`men`, `women`, `kids`), apparel subcategories, and search keywords.
- **Product Details & Sizing:** Dynamic size selection (`S`, `M`, `L`, `XL`, etc.) with real-time stock-state detection (disabling sold-out sizes).
- **Cart & Checkout Flow:** Interactive shopping cart with quantity adjustments and an integrated checkout interface[cite: 2].
- **User Dashboard & Orders:** Customer login, registration, and order history tracking[cite: 2].

### Backend (Server)
- **Authentication & Security:** JWT authentication with hashed passwords via `bcryptjs` and role/user-protected routes[cite: 2].
- **Mongoose Fashion Schema:** Structured data validation enforcing category enums, MRP discount checks (`originalPrice >= price`), and nested size subdocuments (`size`, `stock`).
- **Compound Database Indexing:** Full-text search and multi-field compound indexes for high-performance category/price queries.
- **Inventory Control:** Positional array atomic updates (`$inc`) to decrement exact size inventory during order placement.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, React Router[cite: 2], Lucide React Icons[cite: 2], Axios / Fetch API |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Local / Atlas), Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |

---
