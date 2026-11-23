const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');
const ordersFilePath = path.join(__dirname, '../data/orders.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@novae.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  name: 'Head of Boutique Operations',
  role: 'SuperAdmin'
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password'
    });
  }

  if (email.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
    const token = `adm_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return res.json({
      success: true,
      message: 'Authentication successful. Welcome to NOVAÉ Boutique HQ.',
      data: {
        token,
        user: {
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role
        }
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid administrator credentials. Access denied.'
  });
};

exports.getStats = (req, res) => {
  try {
    let products = [];
    let orders = [];
    let users = [];

    if (fs.existsSync(productsFilePath)) {
      products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    }
    if (fs.existsSync(ordersFilePath)) {
      orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
    }
    if (fs.existsSync(usersFilePath)) {
      users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    }

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const hangerItemsCount = products.filter(p => p.isHangerItem).length;
    
    // Status breakdown
    const statusCounts = {
      Confirmed: orders.filter(o => o.status === 'Confirmed').length,
      Processing: orders.filter(o => o.status === 'Processing').length,
      'In Transit': orders.filter(o => o.status === 'In Transit').length,
      Delivered: orders.filter(o => o.status === 'Delivered').length,
      Cancelled: orders.filter(o => o.status === 'Cancelled').length
    };

    // Category revenue breakdown
    const categoryRevenue = {
      Clothing: 0,
      Accessories: 0,
      Footwear: 0,
      Backpack: 0
    };

    orders.forEach(o => {
      o.items?.forEach(item => {
        const cat = item.category || 'Clothing';
        if (categoryRevenue[cat] !== undefined) {
          categoryRevenue[cat] += (item.price * item.quantity);
        } else {
          categoryRevenue.Clothing += (item.price * item.quantity);
        }
      });
    });

    res.json({
      success: true,
      data: {
        totalRevenue,
        ordersCount: orders.length,
        productsCount: products.length,
        hangerItemsCount,
        usersCount: users.length,
        statusCounts,
        categoryRevenue,
        recentOrders: orders.slice(0, 8)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate store stats', error: error.message });
  }
};
