const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const auth = require('../middleware/auth');


router.post('/user-signup', userController.postUserSignup);
router.post('/user-login', userController.postUserLogin);
router.post('/update-total', auth.authenticate, userController.updateTotal);

module.exports = router;
