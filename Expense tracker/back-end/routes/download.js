const express = require('express');
const downloadController = require('../controllers/download');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/get-downloads', auth.authenticate, downloadController.getDownloads);

module.exports = router;
