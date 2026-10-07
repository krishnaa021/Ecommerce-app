const express = require('express');
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);

module.exports = router;