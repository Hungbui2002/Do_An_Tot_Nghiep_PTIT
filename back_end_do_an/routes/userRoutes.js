// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const { authorize } = require('../controllers/user.js'); // Import middleware authorize

// Định nghĩa route để lấy danh sách món ăn
router.post('/login', userController.login); 

router.post('/register', userController.register);
router.delete('/delete/:MaKhachHang', userController.deleteUser);
router.get('/getall', userController.getAllUsers);



// ma giao dich, ma khach hang, ten khach hang, ten mon, so tien, ngay.
module.exports = router;