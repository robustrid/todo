const express = require('express');
const router = express.Router();
const userController = require('../controller/users.controller');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser)
router.get('/verify', userController.getUserFromToken)


module.exports = router;
