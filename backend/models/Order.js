const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product : { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title : { type: String, required: true },
    price : { type: Number, required: true },
    quantity : { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items : [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalAmount : { type: Number, required: true, min: 0 },
    paymentStatus : { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    orderStatus : { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);