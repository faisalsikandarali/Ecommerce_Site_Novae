const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../data/orders.json');
const confirmedOrdersFilePath = path.join(__dirname, '../data/confirmed_orders.json');
const notificationsFilePath = path.join(__dirname, '../data/notifications.json');
const emailLogsFilePath = path.join(__dirname, '../data/email_logs.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper to safely read JSON
const readJsonFile = (filePath, defaultVal = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2));
      return defaultVal;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultVal;
  }
};

// Helper to safely write JSON
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

const readOrders = () => readJsonFile(ordersFilePath, []);
const saveOrders = (orders) => writeJsonFile(ordersFilePath, orders);

const readConfirmedOrders = () => readJsonFile(confirmedOrdersFilePath, []);
const saveConfirmedOrders = (orders) => writeJsonFile(confirmedOrdersFilePath, orders);

const readNotifications = () => readJsonFile(notificationsFilePath, []);
const saveNotifications = (notifs) => writeJsonFile(notificationsFilePath, notifs);

const readEmailLogs = () => readJsonFile(emailLogsFilePath, []);
const saveEmailLogs = (emails) => writeJsonFile(emailLogsFilePath, emails);

const updateUserStats = (customer, orderTotal) => {
  try {
    if (!fs.existsSync(usersFilePath)) return;
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const email = (customer.email || '').toLowerCase().trim();
    const phone = (customer.phone || '').trim().replace(/[^0-9]/g, '');

    let user = users.find(u => 
      (email && u.email && u.email.toLowerCase().trim() === email) ||
      (phone && u.phone && u.phone.replace(/[^0-9]/g, '') === phone)
    );

    if (user) {
      user.totalOrders = (user.totalOrders || 0) + 1;
      user.totalSpent = (user.totalSpent || 0) + (Number(orderTotal) || 0);
      user.lastOrderAt = new Date().toISOString();
      if (customer.address) user.address = customer.address;
      if (customer.city) user.city = customer.city;
    } else {
      user = {
        id: `usr_${Date.now()}`,
        fullName: customer.fullName || 'Valued Patron',
        email: email || `${phone}@phone.novae.com`,
        phone: customer.phone || '',
        city: customer.city || 'Multan',
        address: customer.address || '',
        authProvider: 'checkout',
        registeredAt: new Date().toISOString(),
        totalSpent: Number(orderTotal) || 0,
        totalOrders: 1,
        vipTier: 'Wardrobe Member',
        measurements: {
          shoulder: '48 cm',
          chest: '104 cm',
          waist: '32 in',
          recommendedSize: 'M'
        }
      };
      users.unshift(user);
    }
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error updating patron stats:', err);
  }
};

// Generate formatted HTML email template for order status update
const generateOrderEmailHtml = (order, status, trackingCode, courier) => {
  const statusColor = {
    'Confirmed': '#D97706',
    'Processing': '#2563EB',
    'In Transit': '#7C3AED',
    'Delivered': '#059669',
    'Cancelled': '#DC2626'
  }[status] || '#1C1917';

  const statusHeadline = {
    'Confirmed': 'Your Boutique Order is Confirmed!',
    'Processing': 'Your Order is in Processing & Tailoring',
    'In Transit': 'Your Package is In Transit with Courier!',
    'Delivered': 'Your NOVAÉ Order Has Been Delivered!',
    'Cancelled': 'Important Update: Order Cancelled'
  }[status] || 'Order Status Update';

  const statusExplanation = {
    'Confirmed': 'Thank you for shopping with NOVAÉ. Your pieces have been inspected, reserved, and allocated to our master atelier for steam-finishing.',
    'Processing': 'Our tailors are currently steaming, pressing, and hanging your garments on our signature solid oak hangers with luxury garment dust covers.',
    'In Transit': `Your luxury package has departed our distribution center and is in transit with ${courier || 'TCS Express Courier'} (Tracking: ${trackingCode || 'NV-EXP-2026'}). Expect doorstep delivery shortly.`,
    'Delivered': 'Your delivery is complete! We hope your curated pieces bring timeless grace to your wardrobe. Please reach out if you need any styling or exchange assistance.',
    'Cancelled': 'Your order has been cancelled per your request or boutique inventory adjustment. Any authorized funds have been immediately released.'
  }[status] || 'Your order status has been updated.';

  return `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E5E0D8; border-radius: 16px; overflow: hidden; padding: 32px; color: #1C1917;">
      <div style="text-align: center; border-bottom: 2px solid #E5E0D8; padding-bottom: 20px;">
        <h1 style="letter-spacing: 0.3em; font-size: 26px; margin: 0; text-transform: uppercase;">NOVAÉ</h1>
        <p style="font-size: 11px; letter-spacing: 0.15em; color: #78716C; margin: 4px 0 0 0; text-transform: uppercase;">Haute Couture & Everyday Living</p>
      </div>

      <div style="margin-top: 28px; text-align: center;">
        <span style="display: inline-block; background-color: ${statusColor}; color: #FFFFFF; font-size: 11px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; padding: 6px 16px; rounded-full: 9999px; border-radius: 20px;">
          ${status}
        </span>
        <h2 style="font-size: 22px; margin: 16px 0 8px 0;">${statusHeadline}</h2>
        <p style="font-size: 13px; color: #57534E; line-height: 1.6; margin: 0 auto; max-width: 480px;">${statusExplanation}</p>
      </div>

      <div style="background-color: #FFFFFF; border: 1px solid #E7E5E4; border-radius: 12px; padding: 20px; margin-top: 24px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #F5F5F4; padding-bottom: 12px; margin-bottom: 12px; font-size: 12px;">
          <span><strong>Order Reference:</strong> <span style="font-family: monospace;">#${order.orderNumber}</span></span>
          <span><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <div style="font-size: 12px; color: #44403C; line-height: 1.6;">
          <p style="margin: 4px 0;"><strong>Recipient:</strong> ${order.customer?.fullName || 'Valued Client'}</p>
          <p style="margin: 4px 0;"><strong>Shipping Destination:</strong> ${order.customer?.address || ''}, ${order.customer?.city || 'Pakistan'}</p>
          <p style="margin: 4px 0;"><strong>Phone:</strong> ${order.customer?.phone || ''}</p>
          ${trackingCode ? `<p style="margin: 4px 0; color: #7C3AED;"><strong>Courier Tracking:</strong> <span style="font-family: monospace; font-weight: bold;">${trackingCode}</span> (${courier || 'Express Air Courier'})</p>` : ''}
        </div>
      </div>

      <div style="margin-top: 20px; font-size: 12px;">
        <p style="font-weight: bold; color: #78716C; text-transform: uppercase; font-size: 11px; margin-bottom: 8px;">Curated Items in Order:</p>
        ${(order.items || []).map(it => `
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #E7E5E4;">
            <span>${it.name} (x${it.quantity}) • Size ${it.size || 'M'}</span>
            <span style="font-weight: bold;">Rs. ${(it.price * it.quantity).toLocaleString()}</span>
          </div>
        `).join('')}
        <div style="display: flex; justify-content: space-between; padding-top: 10px; font-weight: bold; font-size: 14px;">
          <span>Total Order Value:</span>
          <span>Rs. ${(order.total || 0).toLocaleString()}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 32px; border-top: 1px solid #E5E0D8; padding-top: 20px; font-size: 11px; color: #A8A29E;">
        <p>This is an automated delivery dispatch notification from NOVAÉ Boutique Systems.</p>
        <p>© 2026 NOVAÉ Apparel Atelier. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Map status to designated order folder
const mapStatusToFolder = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'processing': return 'processing';
    case 'in transit':
    case 'shipped': return 'in_transit';
    case 'delivered':
    case 'completed': return 'delivered';
    case 'cancelled':
    case 'rejected': return 'cancelled';
    case 'confirmed':
    default: return 'confirmed';
  }
};

// CREATE NEW ORDER
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
    const nowIso = new Date().toISOString();

    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: nowIso,
      updatedAt: nowIso,
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
      deliveryMethod: 'Standard Priority Courier',
      status: 'Confirmed',
      folder: 'confirmed', // Dedicated confirmed orders folder tag
      trackingCode: `TRK-NV-${Math.floor(10000 + Math.random() * 90000)}`,
      courier: 'TCS Boutique Express',
      timeline: [
        {
          status: 'Confirmed',
          timestamp: nowIso,
          note: 'Order successfully placed and confirmed via checkout',
          updatedBy: 'System'
        }
      ]
    };

    // Save to all orders
    orders.unshift(newOrder);
    saveOrders(orders);

    // Save to dedicated Confirmed Orders Folder file
    const confirmedOrders = readConfirmedOrders();
    confirmedOrders.unshift(newOrder);
    saveConfirmedOrders(confirmedOrders);

    // Generate initial customer in-app notification
    const notifications = readNotifications();
    const newNotif = {
      id: `notif_${Date.now()}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerEmail: newOrder.customer.email.toLowerCase().trim(),
      customerName: newOrder.customer.fullName,
      status: 'Confirmed',
      title: `Order #${newOrder.orderNumber} Confirmed!`,
      message: `Your order #${newOrder.orderNumber} has been received and confirmed. Our tailors are preparing your pieces.`,
      createdAt: nowIso,
      read: false,
      emailSent: true
    };
    notifications.unshift(newNotif);
    saveNotifications(notifications);

    // Generate initial simulated confirmation email log
    const emailLogs = readEmailLogs();
    const newEmailLog = {
      id: `eml_${Date.now()}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      to: newOrder.customer.email,
      toName: newOrder.customer.fullName,
      subject: `NOVAÉ Order Confirmation: #${newOrder.orderNumber} Confirmed`,
      status: 'Confirmed',
      sentAt: nowIso,
      courier: newOrder.courier,
      trackingCode: newOrder.trackingCode,
      htmlContent: generateOrderEmailHtml(newOrder, 'Confirmed', newOrder.trackingCode, newOrder.courier)
    };
    emailLogs.unshift(newEmailLog);
    saveEmailLogs(emailLogs);

    // Update or register patron statistics in users.json
    updateUserStats(newOrder.customer, newOrder.total);

    res.status(201).json({
      success: true,
      message: 'Order confirmed and registered in Confirmed Orders folder',
      data: newOrder,
      notification: newNotif,
      emailDispatched: newEmailLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing order',
      error: error.message
    });
  }
};

// GET ALL ORDERS
exports.getAllOrders = (req, res) => {
  try {
    const orders = readOrders();
    const { folder, status } = req.query;

    let filtered = orders;
    if (folder && folder !== 'all') {
      filtered = filtered.filter(o => (o.folder || mapStatusToFolder(o.status)) === folder.toLowerCase());
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(o => (o.status || '').toLowerCase() === status.toLowerCase());
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders', error: error.message });
  }
};

// GET DEDICATED CONFIRMED ORDERS FOLDER
exports.getConfirmedOrders = (req, res) => {
  try {
    const allOrders = readOrders();
    // Confirmed folder includes newly confirmed and active tailoring orders
    const confirmedOrders = allOrders.filter(o => 
      (o.folder === 'confirmed' || o.folder === 'processing' || o.status === 'Confirmed' || o.status === 'Processing')
    );

    // Ensure confirmed_orders.json is in sync
    saveConfirmedOrders(confirmedOrders);

    res.json({
      success: true,
      folder: 'Confirmed Orders',
      count: confirmedOrders.length,
      data: confirmedOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving confirmed orders folder', error: error.message });
  }
};

// GET ORDER FOLDERS SUMMARY (Aggregated metrics per folder)
exports.getOrderFoldersSummary = (req, res) => {
  try {
    const orders = readOrders();

    const summary = {
      all: { count: orders.length, total: 0 },
      confirmed: { count: 0, total: 0, label: 'Confirmed & Tailoring' },
      processing: { count: 0, total: 0, label: 'In Processing & Steaming' },
      in_transit: { count: 0, total: 0, label: 'In Transit / Courier' },
      delivered: { count: 0, total: 0, label: 'Delivered to Client' },
      cancelled: { count: 0, total: 0, label: 'Cancelled / Returned' }
    };

    orders.forEach(ord => {
      const folder = ord.folder || mapStatusToFolder(ord.status);
      const amount = Number(ord.total) || 0;

      summary.all.total += amount;

      if (summary[folder]) {
        summary[folder].count += 1;
        summary[folder].total += amount;
      }
    });

    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating folders summary', error: error.message });
  }
};

// GET ORDER BY ID OR ORDER NUMBER
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

// UPDATE ORDER STATUS (Advances folder stage & triggers in-app notification + email dispatch)
exports.updateOrderStatus = (req, res) => {
  try {
    const orders = readOrders();
    const { status, note, trackingCode, courier } = req.body;
    const index = orders.findIndex(o => o.id === req.params.id || o.orderNumber === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[index];
    const prevStatus = order.status;
    const newStatus = status || prevStatus;
    const newFolder = mapStatusToFolder(newStatus);
    const nowIso = new Date().toISOString();

    order.status = newStatus;
    order.folder = newFolder;
    order.updatedAt = nowIso;
    if (trackingCode) order.trackingCode = trackingCode;
    if (courier) order.courier = courier;

    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      status: newStatus,
      timestamp: nowIso,
      note: note || `Status transitioned from ${prevStatus} to ${newStatus}`,
      updatedBy: 'Boutique Operations Admin'
    });

    saveOrders(orders);

    // Keep confirmed_orders.json synchronized
    const confirmedOrders = orders.filter(o => 
      o.folder === 'confirmed' || o.folder === 'processing' || o.status === 'Confirmed' || o.status === 'Processing'
    );
    saveConfirmedOrders(confirmedOrders);

    // 1. Dispatch Customer In-App Notification
    const notifications = readNotifications();
    const notificationMessages = {
      'Confirmed': `Order #${order.orderNumber} is confirmed and reserved in our boutique queue.`,
      'Processing': `Order #${order.orderNumber} is now in processing. Garments are being pressed and hung on Scandi Oak hangers.`,
      'In Transit': `Order #${order.orderNumber} has been dispatched! It is in transit with ${order.courier || 'TCS'} (Tracking: ${order.trackingCode || 'NV-EXP-2026'}).`,
      'Delivered': `Order #${order.orderNumber} has been successfully delivered! Enjoy your timeless pieces.`,
      'Cancelled': `Order #${order.orderNumber} has been cancelled per request.`
    };

    const newNotification = {
      id: `notif_${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.customer?.email ? order.customer.email.toLowerCase().trim() : 'client@example.com',
      customerName: order.customer?.fullName || 'Client',
      status: newStatus,
      title: `Order #${order.orderNumber} Status: ${newStatus}`,
      message: notificationMessages[newStatus] || `Order #${order.orderNumber} status changed to ${newStatus}.`,
      trackingCode: order.trackingCode,
      courier: order.courier,
      createdAt: nowIso,
      read: false,
      emailSent: true
    };
    notifications.unshift(newNotification);
    saveNotifications(notifications);

    // 2. Dispatch Customer Simulated Email Log
    const emailLogs = readEmailLogs();
    const newEmailLog = {
      id: `eml_${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      to: order.customer?.email || 'client@example.com',
      toName: order.customer?.fullName || 'Client',
      subject: `NOVAÉ Order Update: #${order.orderNumber} is now ${newStatus}`,
      status: newStatus,
      sentAt: nowIso,
      courier: order.courier,
      trackingCode: order.trackingCode,
      htmlContent: generateOrderEmailHtml(order, newStatus, order.trackingCode, order.courier)
    };
    emailLogs.unshift(newEmailLog);
    saveEmailLogs(emailLogs);

    res.json({
      success: true,
      message: `Order status updated to ${newStatus} in folder "${newFolder}". Customer notification & email dispatched!`,
      data: order,
      notification: newNotification,
      emailDispatched: newEmailLog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};

// GET CUSTOMER ORDERS
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

// NOTIFICATION ENDPOINTS
exports.getAllNotifications = (req, res) => {
  try {
    const notifs = readNotifications();
    res.json({ success: true, count: notifs.length, data: notifs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reading notifications', error: error.message });
  }
};

exports.getCustomerNotifications = (req, res) => {
  try {
    const email = req.params.email ? req.params.email.toLowerCase().trim() : '';
    const notifs = readNotifications();
    const filtered = notifs.filter(n => n.customerEmail === email);
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reading customer notifications', error: error.message });
  }
};

exports.markNotificationAsRead = (req, res) => {
  try {
    const notifs = readNotifications();
    const { id } = req.params;
    let found = false;

    notifs.forEach(n => {
      if (n.id === id || id === 'all') {
        n.read = true;
        found = true;
      }
    });

    saveNotifications(notifs);
    res.json({ success: true, message: 'Notification marked as read', data: notifs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking notification read', error: error.message });
  }
};

// EMAIL LOGS ENDPOINTS
exports.getEmailLogs = (req, res) => {
  try {
    const emails = readEmailLogs();
    res.json({ success: true, count: emails.length, data: emails });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reading email logs', error: error.message });
  }
};

exports.resendEmailNotification = (req, res) => {
  try {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.orderId || o.orderNumber === req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const emailLogs = readEmailLogs();
    const nowIso = new Date().toISOString();
    const newEmailLog = {
      id: `eml_${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      to: order.customer?.email || 'client@example.com',
      toName: order.customer?.fullName || 'Client',
      subject: `[RESENT] NOVAÉ Order Update: #${order.orderNumber} Status: ${order.status}`,
      status: order.status,
      sentAt: nowIso,
      courier: order.courier,
      trackingCode: order.trackingCode,
      htmlContent: generateOrderEmailHtml(order, order.status, order.trackingCode, order.courier)
    };
    emailLogs.unshift(newEmailLog);
    saveEmailLogs(emailLogs);

    res.json({
      success: true,
      message: `Email notification successfully resent to ${order.customer?.email}`,
      data: newEmailLog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resend email', error: error.message });
  }
};
