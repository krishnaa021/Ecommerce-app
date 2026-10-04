const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); 

router.get('/', getCart);
router.post('/', addToCart); 
router.delete('/item/:productId', removeFromCart); 

// router.put('/item/:productId', updateCartItem);  //will implement later

module.exports = router;