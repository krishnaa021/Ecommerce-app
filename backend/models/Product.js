const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title : { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price : { type: Number, required: true, min: 0 },
    category : { type: String, required: true, lowercase: true, trim: true },
    stock : { type: Number, required: true, default: 0, min: 0 },
    imageUrl : { type: String },
}, { timestamps: true } );

productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);