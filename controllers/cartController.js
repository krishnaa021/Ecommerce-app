const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title price imageUrl stock');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const addQty = Math.max(1, parseInt(quantity, 10) || 1);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      const totalRequested = cart.items[itemIndex].quantity + addQty;
      if (product.stock < totalRequested) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${addQty}. Stock remaining: ${product.stock}, in cart: ${cart.items[itemIndex].quantity}`,
        });
      }
      cart.items[itemIndex].quantity = totalRequested;
    } else {
      if (product.stock < addQty) {
        return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock' });
      }
      cart.items.push({ product: productId, quantity: addQty });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'title price imageUrl stock');
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT
exports.updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const targetQty = parseInt(quantity, 10);

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === req.params.productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (targetQty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(req.params.productId);
      if (!product || product.stock < targetQty) {
        return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock' });
      }
      cart.items[itemIndex].quantity = targetQty;
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'title price imageUrl stock');
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'title price imageUrl stock');
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};