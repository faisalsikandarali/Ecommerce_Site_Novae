const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Folder pipeline & metrics
router.get('/folders/summary', orderController.getOrderFoldersSummary);
router.get('/folders/confirmed', orderController.getConfirmedOrders);

// Notifications endpoints
router.get('/notifications', orderController.getAllNotifications);
router.get('/notifications/customer/:email', orderController.getCustomerNotifications);
router.put('/notifications/:id/read', orderController.markNotificationAsRead);

// Email dispatch logs & resend
router.get('/emails/logs', orderController.getEmailLogs);
router.post('/emails/resend/:orderId', orderController.resendEmailNotification);

// Standard order routes
router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.get('/customer/:email', orderController.getCustomerOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
