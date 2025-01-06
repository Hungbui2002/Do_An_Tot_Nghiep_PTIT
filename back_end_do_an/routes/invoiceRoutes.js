// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController.js');
const { authorize } = require('../controllers/user.js'); // Import middleware authorize


router.get('/getInvoice/:MaKhachHang', invoiceController.getInvoicesByCustomer);
router.get('/getInvoice', invoiceController.getAllInvoicesByCustomer);


// ma giao dich, ma khach hang, ten khach hang, ten mon, so tien, ngay.
module.exports = router;