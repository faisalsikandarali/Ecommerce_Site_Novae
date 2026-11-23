const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public catalog routes
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);
router.post('/:id/reviews', productController.addReview);

// Admin & catalog management routes
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
