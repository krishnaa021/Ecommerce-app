const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// product routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/products', protect, adminOnly, createProduct);

// cart routes
router.get('/cart', protect, getCart);
router.get('/cart/add', protect, addToCart);
router.get('/cart/item/"productId', protect, removeFromCart);

// order routes
router.post('/orders', protect, createOrder);
router.get('/orders/my-orders', protect, getMyOrders);

module.exports = router;