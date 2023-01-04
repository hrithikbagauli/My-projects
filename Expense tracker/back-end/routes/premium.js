const express = require('express');
const premiumController = require('../controllers/premium');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/buy-premium', auth.authenticate, premiumController.getPremium);
router.post('/update-transaction-status', auth.authenticate, premiumController.updateTransactionStatus);
router.get('/get-scoreboard', premiumController.getScoreboard)
module.exports = router;