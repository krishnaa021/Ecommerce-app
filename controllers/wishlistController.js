const User = require('../models/User.js');
const Product = require('../models/Product.js');
const mongoose = require('mongoose');

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  if(!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'A valid product is required' });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyAdded = user.wishlist.some(
      (id) => id.toString() === productId.toString()
    );

    if (alreadyAdded) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId.toString()
      );
      await user.save();
      return res.status(200).json({
        message: 'Product removed from wishlist',
        wishlist: user.wishlist
      });
    }

    const exists = await Product.exists({ _id:productId });
    if(!exists){
      return res.status(404).json({ message: 'Product not found' });
    }
    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();
    return res.status(200).json({
      message: 'Product added to wishlist',
      wishlist: user.wishlist
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};