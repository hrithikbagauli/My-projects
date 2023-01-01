const express = require('express');
const expenseController = require('../controllers/expense');
const router = express.Router();

router.post('/add-expense', expenseController.postAddExpense);
router.get('/get-expenses', expenseController.getExpenses);
router.post('/delete-item', expenseController.postDeleteItem);

module.exports = router;
