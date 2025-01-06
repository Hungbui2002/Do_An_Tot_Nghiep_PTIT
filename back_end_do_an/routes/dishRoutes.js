// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController.js');

// Định nghĩa route để lấy danh sách món ăn
router.get('/getall', dishController.getPageDishes); 
router.get('/getall/:MaKhachHang', dishController.getPageDishesByCustomer); 

////
router.get('/getallPurchase', dishController.getAllDishes);

router.get('/getallPurchase/:MaKhachHang', dishController.getAllDishesByCustomerBought); 
router.get('/search', dishController.searchDishes);
const { authorize } = require('../controllers/user.js'); // Import middleware authorize

// router.post('/add', dishController.addDish);
router.delete('/delete/:MaMon',authorize(['Admin']), dishController.deleteDish); // DELETE /dishes/:DishId để xóa món ăn theo Id
// router.put('/update/:MaMon', dishController.updateDish);
// router.get('/:DishId', dishController.getOneDish);
 router.get('/CacBuocLam/:DishId', dishController.getOneDishSteps);
router.get('/step/:DishId', dishController.getDishWithSteps);
router.get('/stepAdmin/:DishId', dishController.getDishWithStepsAdmin); 
router.get('/step/:DishId/:MaKhachHang', dishController.getDishWithStepsLogin);


router.get('/getIngredientsByDish/:MaMon', dishController.getIngredientsByDish);
router.post('/add',authorize(['Admin']), dishController.addDish);
router.put('/update/:MaMon',authorize(['Admin']), dishController.updateDish);
router.get('/getDishesByCategory/:MaLoaiMon', dishController.getDishesByCategory);
router.get('/getDishesByCategory/:MaLoaiMon/:MaKhachHang', dishController.getDishesByCategoryByCus);
// router.get('/getTopPopular', dishController.getTopPopular);



module.exports = router;
