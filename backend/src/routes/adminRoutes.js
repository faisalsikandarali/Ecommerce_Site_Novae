const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');

// Auth & Analytics
router.post('/login', adminController.login);
router.get('/stats', adminController.getStats);
router.get('/analytics', adminController.getStats);

// Products management
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Categories management (Stored in categories.json)
router.get('/categories', categoryController.getAllCategories);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Orders management & Folder pipelines
router.get('/orders', orderController.getAllOrders);
router.get('/orders/confirmed', orderController.getConfirmedOrders);
router.get('/orders/folders/summary', orderController.getOrderFoldersSummary);
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Notifications & Email logs
router.get('/notifications', orderController.getAllNotifications);
router.get('/emails/logs', orderController.getEmailLogs);
router.post('/emails/resend/:orderId', orderController.resendEmailNotification);

// Patrons / Customers management
router.get('/users', userController.getAllUsers);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
