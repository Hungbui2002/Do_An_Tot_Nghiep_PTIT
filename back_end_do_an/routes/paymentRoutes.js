// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.js');

// Định nghĩa route để lấy danh sách món ăn
router.post('/payment', paymentController.payment); 

router.post('/callback', paymentController.callback);



module.exports = router;