const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registration & Login endpoints (No OTP)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/google-auth', userController.loginWithGoogle);
router.post('/phone-auth', userController.loginWithPhone);

// User management endpoints
router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);

module.exports = router;
