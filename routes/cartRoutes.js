const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);                         
router.put('/item/:productId', updateCartQuantity);  
router.delete('/item/:productId', removeFromCart);   

module.exports = router;