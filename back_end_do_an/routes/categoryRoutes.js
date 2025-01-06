// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');
const { authorize } = require('../controllers/user.js'); // Import middleware authorize

// Định nghĩa route để lấy danh sách món ăn
router.get('/getall', categoryController.getCategories); 

router.post('/add', authorize(['Admin']),categoryController.addCategory);
router.delete('/delete/:MaLoaiMon',authorize(['Admin']), categoryController.deleteCategory); // DELETE /dishes/:DishId để xóa món ăn theo Id
router.put('/update/:MaLoaiMon',authorize(['Admin']), categoryController.updateCategory);
router.get('/:MaLoaiMon', categoryController.getOneCategory);


module.exports = router;