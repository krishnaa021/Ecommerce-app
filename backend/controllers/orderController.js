const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const validItems = cart.items.filter((item) => item.product !== null);
    if (validItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid products in cart' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 1. Validate stock per size variant
    for (const item of validItems) {
      const sizeVariant = item.product.sizes.find(
        (s) => s.size.toLowerCase() === item.size.toLowerCase()
      );

      if (!sizeVariant || sizeVariant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name} (Size: ${item.size})`,
        });
      }

      totalAmount += item.product.price * item.quantity;
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        size: item.size,
        price: item.product.price,
        image: item.product.images[0] || '',
        quantity: item.quantity,
      });
    }

    // 2. Decrement variant stock atomically using positional $
    for (const item of validItems) {
      await Product.updateOne(
        { _id: item.product._id, 'sizes.size': item.size },
        { $inc: { 'sizes.$.stock': -item.quantity } }
      );
    }

    // 3. Persist order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
    });

    // 4. Reset Cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};