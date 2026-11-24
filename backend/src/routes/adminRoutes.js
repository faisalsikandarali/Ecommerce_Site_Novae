const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');

// Auth & Analytics
router.post('/login', adminController.login);
router.get('/stats', adminController.getStats);
router.get('/analytics', adminController.getStats);

// Products management
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Orders management & Folder pipelines
router.get('/orders', orderController.getAllOrders);
router.get('/orders/confirmed', orderController.getConfirmedOrders);
router.get('/orders/folders/summary', orderController.getOrderFoldersSummary);
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Notifications & Email logs
router.get('/notifications', orderController.getAllNotifications);
router.get('/emails/logs', orderController.getEmailLogs);
router.post('/emails/resend/:orderId', orderController.resendEmailNotification);

// Customers management
router.get('/users', userController.getAllUsers);

module.exports = router;
