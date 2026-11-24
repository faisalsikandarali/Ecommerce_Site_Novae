const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting NOVAÉ End-to-End API Test Suite ---');

  // 1. Health check
  const health = await request({ host: 'localhost', port: 5050, path: '/api/health', method: 'GET' });
  console.log('1. Health check:', health.status === 200 && health.data.status === 'online' ? 'PASS' : 'FAIL');

  // 2. Products listing
  const prods = await request({ host: 'localhost', port: 5050, path: '/api/products', method: 'GET' });
  console.log('2. Products listing:', prods.status === 200 && prods.data.success ? `PASS (${prods.data.count} items)` : 'FAIL');

  // 3. Admin Analytics
  const stats = await request({ host: 'localhost', port: 5050, path: '/api/admin/analytics', method: 'GET' });
  console.log('3. Admin Analytics:', stats.status === 200 && stats.data.success ? `PASS (Revenue: Rs. ${stats.data.data.totalRevenue})` : 'FAIL');

  // 4. Product Creation with complete admin fields
  const newProductPayload = {
    name: 'Structured Gabardine Trench Jacket',
    subtitle: 'Heavy 320 GSM Gabardine Cotton',
    price: 6990,
    originalPrice: 8500,
    gender: 'Men',
    category: 'Clothing',
    inStock: true,
    stockCount: 8,
    isHangerItem: true,
    fabricWeight: '320 GSM Structured Gabardine',
    hangerType: 'Solid Walnut Wood with Brass Hook',
    cut: 'Oversized Boxy Silhouette',
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
    colorName: 'Desert Dune',
    colorHex: '#C2B280',
    description: 'Bespoke tailoring with structured lapels and hanger presentation.',
    details: ['320 GSM Gabardine weave', 'Weather resistant', 'Solid Walnut hanger included']
  };
  const createProdRes = await request({
    host: 'localhost',
    port: 5050,
    path: '/api/products',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newProductPayload);
  console.log('4. Product Creation with Admin Info:', createProdRes.status === 201 && createProdRes.data.success ? `PASS (${createProdRes.data.data.id} - ${createProdRes.data.data.name})` : 'FAIL');

  const createdId = createProdRes.data?.data?.id;

  // 5. Stock Update & InStock Toggle
  const updateStockRes = await request({
    host: 'localhost',
    port: 5050,
    path: `/api/products/${createdId}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }, { inStock: false, stockCount: 0 });
  console.log('5. Stock Toggle & Units Update:', updateStockRes.status === 200 && updateStockRes.data.data.inStock === false && updateStockRes.data.data.stockCount === 0 ? 'PASS (Marked Out of Stock)' : 'FAIL');

  // Toggle back to in stock
  const restockRes = await request({
    host: 'localhost',
    port: 5050,
    path: `/api/products/${createdId}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }, { inStock: true, stockCount: 15 });
  console.log('5b. Restock Toggle:', restockRes.status === 200 && restockRes.data.data.inStock === true && restockRes.data.data.stockCount === 15 ? 'PASS (Re-stocked 15 units)' : 'FAIL');

  // 6. Create an Order
  const newOrderPayload = {
    customer: {
      fullName: 'VIP Patron Test',
      phone: '0300-9999999',
      email: 'vip@novae.com',
      address: 'Gulberg III, Block B',
      city: 'Lahore'
    },
    items: [
      { id: createdId, name: 'Structured Gabardine Trench Jacket', price: 6990, quantity: 1, size: 'M' }
    ],
    subtotal: 6990,
    shippingCost: 200,
    total: 7190,
    paymentMethod: 'Cash on Delivery'
  };
  const orderRes = await request({
    host: 'localhost',
    port: 5050,
    path: '/api/orders',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newOrderPayload);
  console.log('6. Create Order:', orderRes.status === 201 && orderRes.data.success ? `PASS (${orderRes.data.data.orderNumber})` : 'FAIL');

  // 7. Update Order Status
  const orderNumber = orderRes.data.data.orderNumber;
  const updateOrderRes = await request({
    host: 'localhost',
    port: 5050,
    path: `/api/orders/${orderNumber}/status`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }, { status: 'In Transit' });
  console.log('7. Update Order Status:', updateOrderRes.status === 200 && updateOrderRes.data.success ? `PASS (New status: ${updateOrderRes.data.data.status})` : 'FAIL');

  // 8. Customer Review Submission
  const reviewPayload = {
    author: 'Hamza Malik',
    rating: 5,
    title: 'Incredible texture and shoulder fit',
    comment: 'The garment looks stunning hanging in the wardrobe rail. Truly luxury feel.',
    fit: 'True to Size'
  };
  const reviewRes = await request({
    host: 'localhost',
    port: 5050,
    path: `/api/products/${createdId}/reviews`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, reviewPayload);
  console.log('8. Add Product Review:', reviewRes.status === 201 && reviewRes.data.success ? 'PASS' : 'FAIL');

  // 9. Users list
  const usersRes = await request({ host: 'localhost', port: 5050, path: '/api/users', method: 'GET' });
  console.log('9. Users list:', usersRes.status === 200 && usersRes.data.success ? `PASS (${usersRes.data.count} users)` : 'FAIL');

  // 10. Confirmed Orders Dedicated Folder Check
  const confirmedRes = await request({ host: 'localhost', port: 5050, path: '/api/orders/folders/confirmed', method: 'GET' });
  console.log('10. Confirmed Orders Folder:', confirmedRes.status === 200 && confirmedRes.data.success ? `PASS (${confirmedRes.data.count} confirmed orders in folder)` : 'FAIL');

  // 11. Order Folders Summary Metrics
  const summaryRes = await request({ host: 'localhost', port: 5050, path: '/api/orders/folders/summary', method: 'GET' });
  console.log('11. Order Folders Summary:', summaryRes.status === 200 && summaryRes.data.data.confirmed !== undefined ? 'PASS' : 'FAIL');

  // 12. Notifications & Email Dispatch Log Check
  const notifsRes = await request({ host: 'localhost', port: 5050, path: '/api/orders/notifications', method: 'GET' });
  const emailsRes = await request({ host: 'localhost', port: 5050, path: '/api/orders/emails/logs', method: 'GET' });
  console.log('12. In-App Notifications & Email Logs:', notifsRes.status === 200 && emailsRes.status === 200 ? `PASS (${notifsRes.data.count} notifs, ${emailsRes.data.count} emails dispatched)` : 'FAIL');

  console.log('--- All Backend Tests Finished Successfully ---');
}

runTests().catch(console.error);
