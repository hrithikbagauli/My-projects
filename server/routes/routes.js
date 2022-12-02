const express = require('express');
const controller = require('../controller/controller');
const router = express.Router();

router.get('/', controller.getdata);
router.post('/', controller.postform);
router.post('/deleteItem', controller.postDeleteItem);
module.exports = router;
