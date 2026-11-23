const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../data/orders.json');

const readOrders = () => {
  try {
    if (!fs.existsSync(ordersFilePath)) {
      fs.writeFileSync(ordersFilePath, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(ordersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
};

const saveOrders = (orders) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
};

exports.createOrder = (req, res) => {
  try {
    const { customer, items, subtotal, shippingCost, total, paymentMethod } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.address || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required customer and order details'
      });
    }

    const orders = readOrders();
    const orderNumber = `NV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email || 'customer@example.com',
        address: customer.address,
        city: customer.city || 'Multan',
        notes: customer.notes || ''
      },
      items,
      subtotal: Number(subtotal) || 0,
      shippingCost: Number(shippingCost) || 0,
      total: Number(total) || 0,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      deliveryMethod: 'Standard Delivery',
      status: 'Confirmed'
    };

    orders.unshift(newOrder);
    saveOrders(orders);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing order',
      error: error.message
    });
  }
};

exports.getAllOrders = (req, res) => {
  try {
    const orders = readOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders', error: error.message });
  }
};

exports.getOrderById = (req, res) => {
  try {
    const orders = readOrders();
    const query = req.params.id;
    const order = orders.find(o => o.id === query || o.orderNumber.toLowerCase() === query.toLowerCase());

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching order', error: error.message });
  }
};

exports.updateOrderStatus = (req, res) => {
  try {
    const orders = readOrders();
    const { status } = req.body;
    const index = orders.findIndex(o => o.id === req.params.id || o.orderNumber === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    orders[index].status = status || orders[index].status;
    saveOrders(orders);

    res.json({
      success: true,
      message: `Order status updated to ${orders[index].status}`,
      data: orders[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};

exports.getCustomerOrders = (req, res) => {
  try {
    const email = req.params.email ? req.params.email.toLowerCase().trim() : '';
    const orders = readOrders();
    const customerOrders = orders.filter(o => 
      o.customer && o.customer.email && o.customer.email.toLowerCase().trim() === email
    );

    res.json({
      success: true,
      count: customerOrders.length,
      data: customerOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving customer orders', error: error.message });
  }
};
