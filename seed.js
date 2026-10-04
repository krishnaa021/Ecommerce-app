require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: "Classic Oversized Cotton T-Shirt",
    brand: "Urban Thread",
    description:
      "A comfortable oversized T-shirt made from soft, breathable cotton for everyday wear.",
    category: "men",
    subCategory: "T-Shirts",
    price: 799,
    originalPrice: 1299,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1"
    ],
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 18 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 0 }
    ],
    color: "Black",
    rating: 4.5,
    ratingCount: 128,
    tags: ['trending']
  },
  {
    name: "Slim Fit Stretch Denim Jeans",
    brand: "Denim District",
    description:
      "Modern slim-fit jeans with a touch of stretch for all-day comfort and easy movement.",
    category: "men",
    subCategory: "Jeans",
    price: 1499,
    originalPrice: 2499,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452"
    ],
    sizes: [
      { size: "28", stock: 6 },
      { size: "30", stock: 14 },
      { size: "32", stock: 20 },
      { size: "34", stock: 8 },
      { size: "36", stock: 0 }
    ],
    color: "Dark Blue",
    rating: 4.3,
    ratingCount: 96,
    tags: ['trending']
  },
  {
    name: "Floral Wrap Midi Dress",
    brand: "Belle Avenue",
    description:
      "A graceful floral midi dress featuring a flattering wrap silhouette and lightweight fabric.",
    category: "women",
    subCategory: "Dresses",
    price: 1899,
    originalPrice: 2999,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446"
    ],
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 11 },
      { size: "M", stock: 16 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 0 }
    ],
    color: "Floral Pink",
    rating: 4.7,
    ratingCount: 214,
    tags: ['trending']
  },
  {
    name: "High-Waisted Wide-Leg Trousers",
    brand: "Mode Studio",
    description:
      "Elegant high-waisted trousers with a relaxed wide-leg fit, suitable for work and casual styling.",
    category: "women",
    subCategory: "Trousers",
    price: 1599,
    originalPrice: 2299,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3"
    ],
    sizes: [
      { size: "XS", stock: 4 },
      { size: "S", stock: 9 },
      { size: "M", stock: 13 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 2 }
    ],
    color: "Beige",
    rating: 4.2,
    ratingCount: 74,
    tags: ['trending']
  },
  {
    name: "Kids Printed Casual Hoodie",
    brand: "Happy Sprouts",
    description:
      "A warm and playful hoodie made with soft fleece fabric for comfortable everyday adventures.",
    category: "kids",
    subCategory: "Hoodies",
    price: 999,
    originalPrice: 1599,
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4"
    ],
    sizes: [
      { size: "4-5Y", stock: 8 },
      { size: "6-7Y", stock: 12 },
      { size: "8-9Y", stock: 10 },
      { size: "10-11Y", stock: 0 }
    ],
    color: "Yellow",
    rating: 4.6,
    ratingCount: 58,
    tags: ['trending']
  },
  {
    name: "Minimal Canvas Sneakers",
    brand: "Step Culture",
    description:
      "Clean and versatile canvas sneakers designed to pair effortlessly with everyday outfits.",
    category: "men",
    subCategory: "Sneakers",
    price: 1299,
    originalPrice: 1999,
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    ],
    sizes: [
      { size: "6", stock: 3 },
      { size: "7", stock: 9 },
      { size: "8", stock: 15 },
      { size: "9", stock: 11 },
      { size: "10", stock: 0 }
    ],
    color: "White",
    rating: 4.4,
    ratingCount: 143,
    tags: ['trending']
  },
  {
    name: "Ribbed Knit Cardigan",
    brand: "Cozy Lane",
    description:
      "A soft ribbed cardigan with a relaxed fit that adds warmth and style to layered outfits.",
    category: "women",
    subCategory: "Sweaters",
    price: 1399,
    originalPrice: 2199,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e"
    ],
    sizes: [
      { size: "S", stock: 7 },
      { size: "M", stock: 14 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 3 }
    ],
    color: "Cream",
    rating: 4.1,
    ratingCount: 61,
    tags: ['trending']
  },
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
    const deleted = await Product.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} old products.`);

    console.log('Inserting seed products...');
    await Product.insertMany(products); 

    console.log(`Successfully seeded ${products.length} fashion products!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();