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
  {
    name: "Vintage Washed Graphic Tee",
    brand: "Urban Thread",
    description: "Soft washed cotton graphic tee featuring distressed typography and dropped shoulders.",
    category: "men",
    subCategory: "T-Shirts",
    price: 849,
    originalPrice: 1399,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518"
    ],
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 4 }
    ],
    color: "Charcoal Grey",
    rating: 4.4,
    ratingCount: 89,
    tags: ["trending", "streetwear", "casual"]
  },
  {
    name: "Structured Oxford Cotton Shirt",
    brand: "Tailor Craft",
    description: "Classic button-down Oxford shirt crafted from woven long-staple cotton for smart-casual wear.",
    category: "men",
    subCategory: "Shirts",
    price: 1399,
    originalPrice: 2199,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"
    ],
    sizes: [
      { size: "38", stock: 5 },
      { size: "40", stock: 11 },
      { size: "42", stock: 14 },
      { size: "44", stock: 3 }
    ],
    color: "Light Blue",
    rating: 4.6,
    ratingCount: 112,
    tags: ["formal", "office", "classic"]
  },
  {
    name: "Regular Fit Utility Cargo Pants",
    brand: "Denim District",
    description: "Multi-pocket durable cotton twill cargo trousers with reinforced knees and adjustable cuffs.",
    category: "men",
    subCategory: "Pants",
    price: 1699,
    originalPrice: 2699,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7"
    ],
    sizes: [
      { size: "30", stock: 7 },
      { size: "32", stock: 16 },
      { size: "34", stock: 10 },
      { size: "36", stock: 2 }
    ],
    color: "Olive Green",
    rating: 4.3,
    ratingCount: 67,
    tags: ["utility", "streetwear"]
  },
  {
    name: "Classic Denim Trucker Jacket",
    brand: "Denim District",
    description: "Authentic non-stretch denim trucker jacket with metal shank buttons and chest flap pockets.",
    category: "men",
    subCategory: "Jackets",
    price: 2499,
    originalPrice: 3999,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e"
    ],
    sizes: [
      { size: "M", stock: 9 },
      { size: "L", stock: 14 },
      { size: "XL", stock: 6 }
    ],
    color: "Washed Blue",
    rating: 4.7,
    ratingCount: 154,
    tags: ["trending", "outerwear", "denim"]
  },
  {
    name: "Heavyweight Fleece Pullover Hoodie",
    brand: "Urban Thread",
    description: "Plush 380 GSM brushed fleece hoodie with double-layered hood and ribbed side panels.",
    category: "men",
    subCategory: "Hoodies",
    price: 1599,
    originalPrice: 2499,
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6"
    ],
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 12 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 5 }
    ],
    color: "Heather Grey",
    rating: 4.5,
    ratingCount: 98,
    tags: ["winter", "trending", "basics"]
  },
  {
    name: "Water-Resistant Windbreaker Jacket",
    brand: "Active Form",
    description: "Ultra-lightweight packable windbreaker jacket featuring a toggle hood and zip pockets.",
    category: "men",
    subCategory: "Jackets",
    price: 1899,
    originalPrice: 2999,
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a"
    ],
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 10 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 2 }
    ],
    color: "Matte Black",
    rating: 4.2,
    ratingCount: 45,
    tags: ["athleisure", "outerwear"]
  },
  {
    name: "Puff-Sleeve Smocked Peplum Top",
    brand: "Belle Avenue",
    description: "Romantic square-neck top featuring an elastic smocked bodice and breezy puff sleeves.",
    category: "women",
    subCategory: "Tops",
    price: 999,
    originalPrice: 1599,
    images: [
      "https://images.unsplash.com/photo-1534126511673-b6899657816a",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
    ],
    sizes: [
      { size: "XS", stock: 6 },
      { size: "S", stock: 14 },
      { size: "M", stock: 11 },
      { size: "L", stock: 4 }
    ],
    color: "Lavender",
    rating: 4.5,
    ratingCount: 83,
    tags: ["trending", "summer", "floral"]
  },
  {
    name: "Pleated A-Line Midi Skirt",
    brand: "Mode Studio",
    description: "Flowy accordion pleat skirt with a comfortable satin elastic waistband.",
    category: "women",
    subCategory: "Skirts",
    price: 1299,
    originalPrice: 1999,
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa",
      "https://images.unsplash.com/photo-1577900232427-18219b9166a0"
    ],
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 15 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 1 }
    ],
    color: "Emerald Green",
    rating: 4.3,
    ratingCount: 52,
    tags: ["elegant", "party"]
  },
  {
    name: "Double-Breasted Tailored Blazer",
    brand: "Mode Studio",
    description: "Sharp shoulder-padded blazer featuring notched lapels and tortoise-shell buttons.",
    category: "women",
    subCategory: "Blazers",
    price: 2799,
    originalPrice: 4499,
    images: [
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea"
    ],
    sizes: [
      { size: "XS", stock: 3 },
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 5 }
    ],
    color: "Camel",
    rating: 4.8,
    ratingCount: 167,
    tags: ["trending", "formal", "office"]
  },
  {
    name: "High-Rise Mom Fit Jeans",
    brand: "Denim District",
    description: "Classic 90s vintage wash mom jeans featuring a tapered ankle cut and high waist rise.",
    category: "women",
    subCategory: "Jeans",
    price: 1699,
    originalPrice: 2599,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09"
    ],
    sizes: [
      { size: "26", stock: 5 },
      { size: "28", stock: 12 },
      { size: "30", stock: 14 },
      { size: "32", stock: 6 }
    ],
    color: "Vintage Light Blue",
    rating: 4.4,
    ratingCount: 119,
    tags: ["trending", "denim", "retro"]
  },
  {
    name: "Tiered Cotton Ruffle Sundress",
    brand: "Belle Avenue",
    description: "Breathable pure cotton sundress with tie straps and an airy flared skirt.",
    category: "women",
    subCategory: "Dresses",
    price: 1499,
    originalPrice: 2299,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c"
    ],
    sizes: [
      { size: "XS", stock: 4 },
      { size: "S", stock: 10 },
      { size: "M", stock: 12 },
      { size: "L", stock: 5 }
    ],
    color: "Soft Butter Yellow",
    rating: 4.6,
    ratingCount: 94,
    tags: ["summer", "vacation"]
  },
  {
    name: "Oversized Knit Crewneck Sweater",
    brand: "Cozy Lane",
    description: "Chunky cable-knit sweater made from plush thermal yarn with drop shoulders.",
    category: "women",
    subCategory: "Sweaters",
    price: 1799,
    originalPrice: 2699,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633"
    ],
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 16 },
      { size: "L", stock: 11 },
      { size: "XL", stock: 2 }
    ],
    color: "Rust Orange",
    rating: 4.5,
    ratingCount: 88,
    tags: ["winter", "cozy"]
  },
  {
    name: "Strappy Block Heel Sandals",
    brand: "Step Culture",
    description: "Minimalist open-toe sandals with cushioned insoles and a sturdy 2.5-inch block heel.",
    category: "women",
    subCategory: "Footwear",
    price: 1599,
    originalPrice: 2399,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95"
    ],
    sizes: [
      { size: "5", stock: 4 },
      { size: "6", stock: 8 },
      { size: "7", stock: 12 },
      { size: "8", stock: 6 }
    ],
    color: "Nude Tan",
    rating: 4.2,
    ratingCount: 47,
    tags: ["heels", "party"]
  },
  {
    name: "Kids Dino Graphic Cotton T-Shirt",
    brand: "Happy Sprouts",
    description: "Vibrant dinosaur-printed daily t-shirt made with itch-free tagless cotton.",
    category: "kids",
    subCategory: "T-Shirts",
    price: 499,
    originalPrice: 799,
    images: [
      "https://images.unsplash.com/photo-1522771930-78848d9293e8",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4"
    ],
    sizes: [
      { size: "3-4Y", stock: 10 },
      { size: "5-6Y", stock: 15 },
      { size: "7-8Y", stock: 8 },
      { size: "9-10Y", stock: 0 }
    ],
    color: "Sky Blue",
    rating: 4.7,
    ratingCount: 63,
    tags: ["kids", "casual"]
  },
  {
    name: "Kids Elastic-Waist Denim Joggers",
    brand: "Happy Sprouts",
    description: "Flexible stretch denim joggers with a drawstring elastic waist and soft ankle cuffs.",
    category: "kids",
    subCategory: "Jeans",
    price: 799,
    originalPrice: 1299,
    images: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91"
    ],
    sizes: [
      { size: "4-5Y", stock: 6 },
      { size: "6-7Y", stock: 14 },
      { size: "8-9Y", stock: 9 },
      { size: "10-11Y", stock: 4 }
    ],
    color: "Medium Blue Wash",
    rating: 4.4,
    ratingCount: 41,
    tags: ["kids", "denim", "playwear"]
  },
  {
    name: "Kids Floral Tulle Party Dress",
    brand: "TinyTribe",
    description: "Twirl-ready party dress with a soft cotton inner lining and layered floral tulle skirt.",
    category: "kids",
    subCategory: "Dresses",
    price: 1199,
    originalPrice: 1899,
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7"
    ],
    sizes: [
      { size: "3-4Y", stock: 5 },
      { size: "5-6Y", stock: 11 },
      { size: "7-8Y", stock: 8 }
    ],
    color: "Blush Peach",
    rating: 4.8,
    ratingCount: 76,
    tags: ["party", "kids"]
  },
  {
    name: "Kids Colorblocked Windbreaker",
    brand: "TinyTribe",
    description: "Playful hooded colorblock jacket with zip front and breathable mesh lining.",
    category: "kids",
    subCategory: "Jackets",
    price: 1099,
    originalPrice: 1699,
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca56a"
    ],
    sizes: [
      { size: "4-5Y", stock: 4 },
      { size: "6-7Y", stock: 9 },
      { size: "8-9Y", stock: 12 },
      { size: "10-11Y", stock: 3 }
    ],
    color: "Red / Navy",
    rating: 4.3,
    ratingCount: 32,
    tags: ["outerwear", "kids"]
  },
  {
    name: "Retro Suede Low-Top Sneakers",
    brand: "Step Culture",
    description: "Vintage-inspired low-profile sneakers with suede overlays and vulcanized rubber outsoles.",
    category: "men",
    subCategory: "Sneakers",
    price: 1899,
    originalPrice: 2899,
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772"
    ],
    sizes: [
      { size: "7", stock: 4 },
      { size: "8", stock: 10 },
      { size: "9", stock: 14 },
      { size: "10", stock: 6 },
      { size: "11", stock: 2 }
    ],
    color: "Beige & Forest Green",
    rating: 4.6,
    ratingCount: 105,
    tags: ["trending", "sneakers", "streetwear"]
  },
  {
    name: "Quilted Lightweight Puffer Vest",
    brand: "Active Form",
    description: "Insulated water-repellent sleeveless puffer vest with high stand collar and zip pockets.",
    category: "men",
    subCategory: "Jackets",
    price: 1799,
    originalPrice: 2799,
    images: [
      "https://images.unsplash.com/photo-1516826957135-700dedea698c",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a"
    ],
    sizes: [
      { size: "M", stock: 7 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 5 }
    ],
    color: "Navy Blue",
    rating: 4.4,
    ratingCount: 59,
    tags: ["winter", "layering"]
  },
  {
    name: "Seamless Ribbed Workout Leggings",
    brand: "Active Form",
    description: "High-support seamless 4-way stretch active leggings with a wide stay-put waistband.",
    category: "women",
    subCategory: "Pants",
    price: 1199,
    originalPrice: 1799,
    images: [
      "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a"
    ],
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 13 },
      { size: "M", stock: 16 },
      { size: "L", stock: 8 }
    ],
    color: "Slate Grey",
    rating: 4.7,
    ratingCount: 142,
    tags: ["athleisure", "activewear", "trending"]
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