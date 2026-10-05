const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name brand price originalPrice images sizes'
    );

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
    const { productId, size, quantity = 1 } = req.body;
    const addQty = Math.max(1, parseInt(quantity, 10) || 1);

    if (!size) {
      return res.status(400).json({ success: false, message: 'Please select a size' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Locate the exact size variant
    const sizeVariant = product.sizes.find(
      (s) => s.size.toLowerCase() === size.trim().toLowerCase()
    );

    if (!sizeVariant) {
      return res.status(400).json({ success: false, message: `Size "${size}" is not available for this item` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Match both product AND size
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size.toLowerCase() === size.trim().toLowerCase()
    );

    if (itemIndex > -1) {
      const totalRequested = cart.items[itemIndex].quantity + addQty;
      if (sizeVariant.stock < totalRequested) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${addQty}. Stock remaining for size ${sizeVariant.size}: ${sizeVariant.stock}, already in cart: ${cart.items[itemIndex].quantity}`,
        });
      }
      cart.items[itemIndex].quantity = totalRequested;
    } else {
      if (sizeVariant.stock < addQty) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${sizeVariant.stock} left for size ${sizeVariant.size})`,
        });
      }
      cart.items.push({ product: productId, size: sizeVariant.size, quantity: addQty });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name brand price originalPrice images sizes'
    );

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, quantity } = req.body;
    const targetQty = parseInt(quantity, 10);

    if (!size) {
      return res.status(400).json({ success: false, message: 'Size is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size.toLowerCase() === size.trim().toLowerCase()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (targetQty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      const sizeVariant = product?.sizes.find(
        (s) => s.size.toLowerCase() === size.trim().toLowerCase()
      );

      if (!sizeVariant || sizeVariant.stock < targetQty) {
        return res.status(400).json({ success: false, message: 'Requested quantity exceeds available size stock' });
      }
      cart.items[itemIndex].quantity = targetQty;
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name brand price originalPrice images sizes'
    );

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size } = req.query; // Passed as query param: /api/cart/:productId?size=M

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    if (size) {
      cart.items = cart.items.filter(
        (item) => !(item.product.toString() === productId && item.size.toLowerCase() === size.trim().toLowerCase())
      );
    } else {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name brand price originalPrice images sizes'
    );

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};