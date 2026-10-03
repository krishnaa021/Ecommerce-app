require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  {
    title: 'Wireless Noise-Canceling Headphones',
    description: 'Over-ear Bluetooth headphones with 30-hour battery life and high-fidelity audio.',
    price: 99.99,
    category: 'electronics',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  },
  {
    title: 'Mechanical Gaming Keyboard',
    description: 'Tenkeyless RGB backlit mechanical keyboard with tactile blue switches.',
    price: 59.99,
    category: 'electronics',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
  },
  {
    title: 'Minimalist Leather Watch',
    description: 'Classic analog wristwatch with stainless steel case and genuine leather strap.',
    price: 79.50,
    category: 'accessories',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  },
  {
    title: 'Ergonomic Desk Chair',
    description: 'Breathable mesh back with adjustable lumbar support, headrest, and armrests.',
    price: 189.00,
    category: 'furniture',
    stock: 7,
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3f81518f886?w=600&q=80',
  },
  {
    title: 'Running Shoes Pro',
    description: 'Lightweight cushioned road running sneakers designed for performance and comfort.',
    price: 64.99,
    category: 'footwear',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    title: 'Insulated Stainless Steel Bottle',
    description: 'Double-walled vacuum insulated water bottle keeping drinks cold for 24 hours.',
    price: 24.99,
    category: 'accessories',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
  }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in your .env file');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    console.log('Inserting seed products...');
    await Product.insertMany(sampleProducts);

    console.log('Database successfully seeded with products!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();