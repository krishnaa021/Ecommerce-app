const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { search, category, subCategory, sort, page = 1, limit = 12 } = req.query;
    const query = {};

    // Keyword search across name and brand
    if (search) {
      query.$or = [
        { name: { $regex: search.trim(),$options: 'i' } },
        { brand: { $regex: search.trim(),$options: 'i' } },
        { subCategory: { $regex: search.trim(),$options: 'i' } },
      ];
    }

    // Gender Category ('men', 'women', 'kids')
    if (category) {
      query.category = category.trim().toLowerCase();
    }

    // Subcategory ('t-shirt', 'jeans', 'jackets', etc.)
    if (subCategory) {
      query.subCategory = { $regex: `^${subCategory.trim()}$`, $options: 'i' };
    }

    // Dynamic sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (currentPage - 1) * pageLimit;

    const [products, totalCount] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(pageLimit),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      totalPages: Math.ceil(totalCount / pageLimit),
      currentPage,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};