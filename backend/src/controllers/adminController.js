const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');
const ordersFilePath = path.join(__dirname, '../data/orders.json');

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

    if (fs.existsSync(productsFilePath)) {
      products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    }
    if (fs.existsSync(ordersFilePath)) {
      orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
    }

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const hangerItemsCount = products.filter(p => p.isHangerItem).length;
    const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    res.json({
      success: true,
      data: {
        totalRevenue,
        ordersCount: orders.length,
        productsCount: products.length,
        hangerItemsCount,
        confirmedOrders,
        deliveredOrders,
        recentOrders: orders.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate store stats', error: error.message });
  }
};
