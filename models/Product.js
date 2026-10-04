const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ['men', 'women', 'kids'],
    },
    subCategory: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v) {
          return v >= this.price;
        },
        message: 'originalPrice must be greater than or equal to price',
      },
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one image is required',
      },
    },
    sizes: {
      type: [sizeSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one size is required',
      },
    },
    color: { type: String, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', brand: 'text', subCategory: 'text', description: 'text' });
productSchema.index({ category: 1, subCategory: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);