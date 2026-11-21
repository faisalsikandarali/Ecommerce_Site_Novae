const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const readProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

const saveProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

exports.getAllProducts = (req, res) => {
  try {
    let products = readProducts();
    const { category, gender, search, minPrice, maxPrice, size, color, rating, sort, hangerOnly } = req.query;

    if (hangerOnly === 'true') {
      products = products.filter(p => p.isHangerItem);
    }

    if (category && category !== 'All') {
      products = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (gender && gender !== 'All') {
      products = products.filter(p => 
        p.gender.toLowerCase() === gender.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    if (size) {
      products = products.filter(p => p.sizes && p.sizes.includes(size));
    }

    if (color) {
      products = products.filter(p => 
        p.colors && p.colors.some(c => c.name.toLowerCase().includes(color.toLowerCase()))
      );
    }

    if (rating) {
      products = products.filter(p => p.rating >= Number(rating));
    }

    // Sorting
    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching products', error: error.message });
  }
};

exports.getProductById = (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching product', error: error.message });
  }
};

exports.getCategories = (req, res) => {
  try {
    const products = readProducts();
    const categories = ['All', ...new Set(products.map(p => p.category))];
    const genders = ['All', ...new Set(products.map(p => p.gender))];
    res.json({ success: true, data: { categories, genders } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching categories', error: error.message });
  }
};

// Admin Create Product
exports.createProduct = (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: `nv-${Date.now()}`,
      name: req.body.name || 'New Garment',
      subtitle: req.body.subtitle || 'Everyday Collection',
      price: Number(req.body.price) || 2999,
      originalPrice: Number(req.body.originalPrice) || Number(req.body.price) || 3500,
      currency: 'Rs.',
      rating: 5.0,
      reviewCount: 1,
      category: req.body.category || 'Clothing',
      gender: req.body.gender || 'Men',
      isBestSeller: Boolean(req.body.isBestSeller),
      isNewArrival: Boolean(req.body.isNewArrival ?? true),
      isHangerItem: Boolean(req.body.isHangerItem ?? true),
      description: req.body.description || 'Crafted with premium materials for everyday living.',
      hangerDetails: req.body.hangerDetails || {
        fabricWeight: req.body.fabricWeight || '220 GSM Premium Weave',
        hangerType: req.body.hangerType || 'Scandi Oak Wood with Brass Hook',
        cut: req.body.cut || 'Relaxed Boxy Fit',
        swayIntensity: 'medium'
      },
      images: req.body.images && req.body.images.length > 0 ? req.body.images : [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: req.body.colors && req.body.colors.length > 0 ? req.body.colors : [
        { name: 'Natural Sand', hex: '#D8CAB8' }
      ],
      sizes: req.body.sizes && req.body.sizes.length > 0 ? req.body.sizes : ['S', 'M', 'L', 'XL'],
      inStock: req.body.inStock !== false,
      details: req.body.details || ['100% sustainably sourced fabric', 'Boutique hanger display tag included'],
      shipping: 'Standard delivery Rs. 200 nationwide.',
      returns: '30-day exchange available.'
    };

    products.unshift(newProduct);
    saveProducts(products);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

// Admin Update Product
exports.updateProduct = (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    products[index] = {
      ...products[index],
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : products[index].price
    };

    saveProducts(products);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: products[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// Admin Delete Product
exports.deleteProduct = (req, res) => {
  try {
    let products = readProducts();
    const exists = products.some(p => p.id === req.params.id);

    if (!exists) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    products = products.filter(p => p.id !== req.params.id);
    saveProducts(products);

    res.json({
      success: true,
      message: 'Product removed from collection'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};
