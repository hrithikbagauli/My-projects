const express = require('express');
const premiumController = require('../controllers/premium');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/buy-premium', auth.authenticate, premiumController.getPremium);
router.post('/update-transaction-status', auth.authenticate, premiumController.updateTransactionStatus);
router.get('/get-scoreboard', auth.authenticate, premiumController.getScoreboard)
router.get('/get-report',auth.authenticate, premiumController.getReport);
router.get('/download',auth.authenticate, premiumController.getDownload);
module.exports = router;