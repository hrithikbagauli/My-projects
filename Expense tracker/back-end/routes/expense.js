const express = require('express');
const expenseController = require('../controllers/expense');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/add-expense', auth.authenticate, expenseController.postAddExpense);
router.get('/get-expenses', auth.authenticate, expenseController.getExpenses);
router.post('/delete-item', auth.authenticate, expenseController.postDeleteItem);

module.exports = router;
