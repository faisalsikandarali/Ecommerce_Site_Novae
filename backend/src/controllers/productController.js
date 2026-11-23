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
    const stockCount = req.body.stockCount !== undefined ? Number(req.body.stockCount) : 10;
    const inStock = req.body.inStock !== undefined 
      ? (req.body.inStock === true || req.body.inStock === 'true')
      : stockCount > 0;

    const imageUrl = req.body.imageUrl || (req.body.images && req.body.images[0]) || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80';
    const images = Array.isArray(req.body.images) && req.body.images.length > 0 
      ? req.body.images 
      : [imageUrl];

    const sizes = Array.isArray(req.body.sizes) && req.body.sizes.length > 0
      ? req.body.sizes
      : (typeof req.body.sizes === 'string' ? req.body.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['S', 'M', 'L', 'XL']);

    const colors = Array.isArray(req.body.colors) && req.body.colors.length > 0
      ? req.body.colors
      : [{
          name: req.body.colorName || 'Natural Tone',
          hex: req.body.colorHex || '#D8CAB8',
          image: imageUrl
        }];

    const details = Array.isArray(req.body.details) && req.body.details.length > 0
      ? req.body.details
      : (typeof req.body.details === 'string' ? req.body.details.split('\n').map(s => s.trim()).filter(Boolean) : [
          '100% sustainably sourced atelier weave',
          'Hand-finished seams with signature drape',
          'Signature boutique oak wood hanger included'
        ]);

    const newProduct = {
      id: `nv-${Date.now()}`,
      name: req.body.name || 'New Atelier Garment',
      subtitle: req.body.subtitle || 'Signature Boutique Drop',
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
      inStock,
      stockCount: inStock ? (stockCount > 0 ? stockCount : 10) : 0,
      description: req.body.description || 'Crafted with premium materials for discerning collectors.',
      details,
      hangerDetails: {
        fabricWeight: req.body.fabricWeight || req.body.hangerDetails?.fabricWeight || '240 GSM Pure Flax Linen',
        hangerType: req.body.hangerType || req.body.hangerDetails?.hangerType || 'Scandi Oak Wood with Brushed Brass Hook',
        cut: req.body.cut || req.body.hangerDetails?.cut || 'Relaxed Boxy Fit',
        swayIntensity: req.body.swayIntensity || req.body.hangerDetails?.swayIntensity || 'medium'
      },
      images,
      colors,
      sizes,
      shipping: req.body.shipping || 'Standard delivery Rs. 200 nationwide.',
      returns: req.body.returns || '30-day exchange available with hanger tag attached.'
    };

    products.unshift(newProduct);
    saveProducts(products);

    res.status(201).json({
      success: true,
      message: 'Product created and hung on live wardrobe rail',
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

    const current = products[index];

    // Handle stock status & stock count
    let inStock = current.inStock;
    let stockCount = current.stockCount !== undefined ? current.stockCount : 10;

    if (req.body.inStock !== undefined) {
      inStock = req.body.inStock === true || req.body.inStock === 'true';
      if (!inStock) stockCount = 0;
      else if (stockCount === 0) stockCount = 5;
    }

    if (req.body.stockCount !== undefined) {
      stockCount = Number(req.body.stockCount);
      if (stockCount <= 0) {
        stockCount = 0;
        inStock = false;
      } else {
        inStock = true;
      }
    }

    // Handle images
    let images = current.images;
    if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
      images = req.body.images;
    } else if (req.body.imageUrl) {
      images = [req.body.imageUrl];
    }

    // Handle sizes
    let sizes = current.sizes;
    if (req.body.sizes) {
      sizes = Array.isArray(req.body.sizes) 
        ? req.body.sizes 
        : req.body.sizes.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Handle colors
    let colors = current.colors;
    if (req.body.colors && Array.isArray(req.body.colors) && req.body.colors.length > 0) {
      colors = req.body.colors;
    } else if (req.body.colorName) {
      colors = [{
        name: req.body.colorName,
        hex: req.body.colorHex || '#222',
        image: images[0]
      }];
    }

    // Handle details
    let details = current.details;
    if (req.body.details) {
      details = Array.isArray(req.body.details)
        ? req.body.details
        : req.body.details.split('\n').map(s => s.trim()).filter(Boolean);
    }

    products[index] = {
      ...current,
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : current.originalPrice,
      inStock,
      stockCount,
      images,
      sizes,
      colors,
      details,
      hangerDetails: {
        ...current.hangerDetails,
        ...(req.body.hangerDetails || {}),
        fabricWeight: req.body.fabricWeight || req.body.hangerDetails?.fabricWeight || current.hangerDetails?.fabricWeight,
        hangerType: req.body.hangerType || req.body.hangerDetails?.hangerType || current.hangerDetails?.hangerType,
        cut: req.body.cut || req.body.hangerDetails?.cut || current.hangerDetails?.cut
      }
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

// Customer Add Review
exports.addReview = (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { author, rating, comment } = req.body;
    if (!author || !rating) {
      return res.status(400).json({ success: false, message: 'Author name and star rating are required' });
    }

    const newReview = {
      id: `rev_${Date.now()}`,
      author: author.trim(),
      rating: Number(rating) || 5,
      comment: comment ? comment.trim() : 'Exceptional quality and fabric feel on the hanger.',
      createdAt: new Date().toISOString()
    };

    if (!products[index].reviews) {
      products[index].reviews = [
        {
          id: 'rev_default_1',
          author: 'Hamza Malik',
          rating: 5,
          comment: 'The drape and linen texture are incredible. Hangs beautifully in my closet.',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 'rev_default_2',
          author: 'Zainab Tariq',
          rating: 4.8,
          comment: 'Premium stitching and fast courier delivery to Lahore. Worth every rupee.',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
        }
      ];
    }

    products[index].reviews.unshift(newReview);
    products[index].reviewCount = products[index].reviews.length;
    const avgRating = products[index].reviews.reduce((sum, r) => sum + r.rating, 0) / products[index].reviews.length;
    products[index].rating = Number(avgRating.toFixed(1));

    saveProducts(products);

    res.status(201).json({
      success: true,
      message: 'Review published successfully',
      data: {
        review: newReview,
        product: products[index]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
  }
};
